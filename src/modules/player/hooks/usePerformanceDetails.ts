import { useState, useEffect, useCallback } from 'react';
import { fetchPlayerPerformanceDetails } from '../player-actions';
import axios, { CancelTokenSource } from 'axios';
import { Stats } from '../../../shared/types';

const initialState = {
  loading: true,
  data: {
    started: 0,
    substitute: 0,
    total: 0,
    points: 0,
    assist: 0,
  },
  error: null
};

export function usePerformanceDetails (player: number, sport: number): Result {
  const [state, setState] = useState<State>(initialState);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setState(prevState => ({...prevState, loading: true }));

    const [err, canceled, data] = await fetchPlayerPerformanceDetails(player, sport, source);

    if (canceled)
      return;

    if (err) {
      return setState(prevState => ({
        ...prevState,
        loading: false,
        data: initialState.data,
        error: err
      }));
    }

    if (data) {
      return setState(prevState => ({
        ...prevState,
        loading: false,
        data: data,
        error: null
      }));
    }
  }, [player, sport]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  return {
    ...state,
    fetch
  }
}

type State = {
  loading: boolean,
  data: Stats,
  error: Error | null,
}

type Result = State & {
  fetch: (source?: CancelTokenSource) => void
}