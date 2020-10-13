import { useCallback, useState, useRef, useEffect } from 'react';
import { fetchGameEvents } from '../game-actions';
import { CancelTokenSource } from 'axios';
import { Point, PersonPlaysGame } from '../../../shared/types';

const initialState = {
  items: [],
  loading: true,
  error: null,
}

/**
 * Fetches the specified game events
 * 
 * @param {number} game - The game to fetch the events from
 * 
 * @returns {State} The state of the fetched events
 */
export function useGameLiveEvents (game: number): State {
  const [state, setState] = useState<State>(initialState);
  const cancelToken = useRef<CancelTokenSource>();
  const interval = useRef<number>();

  const fetch = useCallback(async () => {
    cancelToken.current?.cancel();

    setState(prevState => ({
      ...prevState,
      loading: prevState.items.length === 0,
      error: null,
    }))

    const [err, canceled, data] = await fetchGameEvents(game, cancelToken.current);

    if (canceled) {
      return;
    }

    if (err) {
      return setState(prevState => ({
        ...prevState,
        loading: false,
        error: err,
      }))
    }

    if (data) {
      return setState(prevState => ({
        ...prevState,
        items: data.items,
        loading: false,
        error: null
      }))
    }

  }, [game]);

  useEffect(() => {
    fetch();

    interval.current = window.setInterval(fetch, 60000);

    return () => clearInterval(interval.current);
  }, [fetch]);

  return state;
}

type State = { 
  items: Array<Point | PersonPlaysGame>,
  loading: boolean,
  error: Error | null,
}