import { useState, useEffect, useCallback } from 'react';
import { INITIAL_LIST_STATE } from '../../../shared/constants';
import { Comment, ListHooksState } from '../../../shared/types';
import { fetchComments, FetchCommentsFilterData } from '../comment-actions';
import axios, { CancelTokenSource } from 'axios';

export function useComments (orderBy: OrderBy = 'createdAt_DESC', initialFilter: FetchCommentsFilterData): HookState {
  const [page, setPage] = useState(1);
  const [state, setState] = useState<ListHooksState<Comment>>(INITIAL_LIST_STATE);
  const [filters] = useState(initialFilter);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setState(prevState => ({...prevState, loading: true }));

    const [err, canceled, data] = await fetchComments(page, orderBy, ['user', 'user.person'], filters, source);

    if (canceled)
      return;

    if (err) {
      return setState(prevState => ({
        ...prevState,
        error: err,
      }));
    }

    if (data) {
      return setState(prevState => ({
        ...prevState,
        error: null,
        loading: false,
        count: data.count,
        items: page === 1 ? data.items : [
          ...prevState.items,
          ...data.items
        ]
      }));
    }
  }, [page, orderBy, filters]);

  const refresh = useCallback(() => {
    setState(prevState => ({ ...prevState, items: [], count: 0 }));

    if (page === 1) {
      fetch();
    } else {
      setPage(1);
    }
  }, [page, fetch]);

  const next = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  useEffect(() => {
    if (orderBy && filters) {
      setPage(1);
    }
  }, [orderBy, filters]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  return {
    ...state,
    next,
    refresh
  }
}

type HookState = ListHooksState<Comment> & {
  next: () => void,
  refresh: () => void,
}

type OrderBy = 'createdAt_ASC' | 'createdAt_DESC';