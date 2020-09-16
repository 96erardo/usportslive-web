import { useState, useCallback, useRef } from 'react';
import { fetchGames } from './game-actions';
import { Game, ListHooksState } from '../../shared/types';
import axios, { CancelTokenSource } from 'axios';

const initialState = {
  items: [],
  count: 0,
  loading: false,
  error: null,
};

const include = ['local', 'visitor'];

export function useCalendarGames () {
  const [state, setState] = useState<ListHooksState<Game>>(initialState);
  const cancelToken = useRef<CancelTokenSource>();

  const fetch = useCallback(async (competition: number, isAfter: string, isBefore: string) => {
    cancelToken.current?.cancel();

    setState(state => ({...state, loading: true }));

    const filters = { competition, isAfter, isBefore };

    cancelToken.current = axios.CancelToken.source();

    const [err, canceled, data] = await fetchGames(0, include, filters, cancelToken.current);

    if (canceled) {
      return;
    }

    if (err) {
      return setState(state => ({
        ...state,
        error: err,
      }));
    }

    if (data) {
      return setState(state => ({
        ...state,
        error: null,
        loading: false,
        count: data.count,
        items: data.items,
      }))
    }
  }, []);

  return {
    ...state,
    fetch
  };
}