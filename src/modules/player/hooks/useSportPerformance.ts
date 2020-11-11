import { useState, useEffect, useCallback } from 'react';
import { Rating } from '../../../shared/types';
import { fetchPlayerPerformanceInSport } from '../player-actions';
import axios, { CancelTokenSource } from 'axios';

const initialState = {
  loading: false,
  error: null,
  rating: null,
}

export function useSportPerformance (playerId: number, sportId: number): State {
  const [state, setState] = useState<State>(initialState);

  const fetch = useCallback(async (source: CancelTokenSource) => {
    const [err, canceled, data] = await fetchPlayerPerformanceInSport(playerId, sportId, source);

    if (canceled)
      return;

    if (err) {
      return setState(prevState => ({
        ...prevState,
        loading: false,
        error: err,
        rating: { quantity: 0, value: 0 }
      }));
    }
    
    if (data) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: null,
        rating: data
      }))
    }

  }, [playerId, sportId]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  return state;
}

type State = {
  loading: boolean,
  error: Error | null,
  rating: Rating | null
}