import { useState, useEffect, useCallback } from 'react';
import { ListHooksState, Team, } from '../../../shared/types';
import { INITIAL_LIST_STATE } from '../../../shared/constants';
import { fetchTeams } from '../team-actions';
import axios, { CancelTokenSource } from 'axios';

/**
 * Manages competition teams fetching and pagination
 * 
 * @param {number} id - The competition id
 * 
 * @returns {HookState} The hook state
 */
export function useCompetitionTeams (id: number): HookState {
  const [page, setPage] = useState(1);
  const [state, setState] = useState<ListHooksState<Team>>(INITIAL_LIST_STATE);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setState(prevState => ({...prevState, loading: true }));

    const [err, canceled, data] = await fetchTeams(page, ['logo'], {
      competition: id,
    }, source);

    if (canceled)
      return;

    if (err) {
      return setState(prevState => ({
        ...prevState,
        loading: false,
        error: err,
      }));
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
      }))
    }
  }, [id, page]);

  const next = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [id]);

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

type HookState = ListHooksState<Team> & {
  next: () => void
}