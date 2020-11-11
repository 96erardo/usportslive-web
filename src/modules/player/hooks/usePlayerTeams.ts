import { useState, useEffect, useCallback } from 'react';
import { Team } from '../../../shared/types';
import { fetchPlayerTeams } from '../player-actions';
import axios, { CancelTokenSource } from 'axios';

const initialState = {
  loading: true,
  count: 0,
  items: [],
  error: null
};

/**
 * Fetches the teams where a person has played
 * 
 * @param {number} player - The player id
 * 
 * @returns {Result} The hook state
 */
export function usePlayerTeams (player: number): Result {
  const [page, setPage] = useState(1);
  const [state, setState] = useState<State>(initialState);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setState(prevState => ({...prevState, loading: true }));

    const [err, canceled, data] = await fetchPlayerTeams(player, page, source);

    if (canceled) 
      return;

    if (err) {
      return setState(prevState => ({
        ...prevState,
        loading: false,
        error: err
      }))
    }

    if (data) {
      return setState(prevState => ({
        ...prevState,
        loading: false,
        items: page === 1 ? data.items : [
          ...prevState.items,
          ...data.items
        ],
        count: data.count
      }))
    }
  }, [player, page]);

  const next = useCallback(() => {
    setPage(state => state + 1);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [player]);

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

type State = {
  loading: boolean,
  count: number,
  items: Array<Team>,
  error: Error | null,
}

type Result = State & {
  next: () => void
}