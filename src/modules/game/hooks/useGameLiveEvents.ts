import { useCallback, useState, useRef, useEffect } from 'react';
import { fetchGameEvents } from '../game-actions';
import axios, { CancelTokenSource } from 'axios';
import { Point, PersonPlaysGame, Game } from '../../../shared/types';

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
export function useGameLiveEvents (game: Game | null): State {
  const [state, setState] = useState<State>(initialState);
  const interval = useRef<number>();

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    if (!game)
      return;
    
    setState(prevState => ({
      ...prevState,
      loading: prevState.items.length === 0,
      error: null,
    }))

    const [err, canceled, data] = await fetchGameEvents(game.id, source);

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
    let source = axios.CancelToken.source();

    fetch(source);

    if (game !== null && !game.isFinished) {
      interval.current = window.setInterval(() => {
        source = axios.CancelToken.source();

        fetch(source);
      }, 60000);
  
      return () => {
        clearInterval(interval.current)
        source.cancel();
      };
    }

    return () => source.cancel()
  }, [fetch, game]);

  return state;
}

type State = { 
  items: Array<Point | PersonPlaysGame>,
  loading: boolean,
  error: Error | null,
}