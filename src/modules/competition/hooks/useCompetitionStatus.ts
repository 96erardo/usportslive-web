import { useCallback, useEffect, useState } from 'react';
import { INITIAL_LIST_STATE } from '../../../shared/constants';
import { ListHooksState, Competition } from '../../../shared/types';
import { fetchCompetitions } from '../competition-actions';
import axios, { CancelTokenSource } from 'axios';

export function useCompetitionStatus (status: 'SOON' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELED'): HookState {
  const [page, setPage] = useState(1);
  const [state, setState] = useState<ListHooksState<Competition>>(INITIAL_LIST_STATE);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setState(prevState => ({...prevState, loading: true }));

    const [err, canceled, data] = await fetchCompetitions(page, ['sport'], { status }, source);

    if (canceled)
      return;

    if (err) {
      return setState(prevState => ({
        ...prevState,
        error: err
      }))
    }

    if (data) {
      return setState(prevState => ({
        ...prevState,
        loading: false,
        error: null,
        count: data.count,
        items: page === 1 ? data.items : [
          ...prevState.items,
          ...data.items
        ]
      }));
    }
  }, [status, page]);

  const next = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [status]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  return {
    ...state,
    next
  }
}

type HookState = ListHooksState<Competition> & {
  next: () => void
}