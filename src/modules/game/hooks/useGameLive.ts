import { useState, useEffect, useCallback, useRef } from 'react';
import { Game } from '../../../shared/types';
import { fetchGame } from '../game-actions';
import axios, { CancelTokenSource } from 'axios';

const initialState = {
  loading: true,
  game: null,
  error: null,
}

/**
 * Returns the state of the specified game with a minute difference
 * 
 * @param id - The id of the game to continously fetch
 * 
 * @returns {State} The hook state
 */
export function useGameLive (id: string | number): State {
  const [state, setState] = useState<State>(initialState);
  const cancelToken = useRef<CancelTokenSource>();

  const fetch = useCallback(async () => {
    cancelToken.current = axios.CancelToken.source();
    setState(prevState => ({
      ...prevState,
      loading: true,
    }));

    const [err, canceled, data] = await fetchGame(
      typeof id === 'string' ? parseInt(id) : id,
      ['competition', 'local', 'visitor', 'local.logo', 'visitor.logo'],
      cancelToken.current,
    );

    if (canceled) {
      return;
    }

    if (err) {
      return setState(prevState => ({
        ...prevState,
        loading: false,
        game: null,
        error: err
      }))
    }

    if (data) {
      return setState(prevState => ({
        ...prevState,
        loading: false,
        game: data.game,
        error: null
      }));
    }
  }, [id]);

  useEffect(() => {
    fetch();

    const interval = setInterval(() => fetch(), 60000); // A minute

    return () => clearInterval(interval);
  }, [fetch]);

  return state;
}

type State = {
  loading: boolean,
  game: Game | null,
  error: Error | null
}