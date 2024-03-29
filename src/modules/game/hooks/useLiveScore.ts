import { useState, useEffect, useCallback, useRef } from 'react';
import { Game, Team, Point } from '../../../shared/types';
import { fetchGame } from '../game-actions';
import axios, { CancelTokenSource } from 'axios';

const initialState = {
  loading: true,
  error: null,
  game: null,
  local: null,
  visitor: null,
  points: [],
}

const include = ['points', 'local', 'visitor', 'local.logo', 'visitor.logo'];

/**
 * Hooks that returns a game live score
 * 
 * @param {number} game - The game to fetch the score from
 * 
 * @returns {State} The hook state
 */
export function useLiveScore (game: Game): State {
  const [state, setState] = useState<State>(initialState);
  const interval = useRef<number>();

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setState(prevState => ({
      ...prevState,
      loading: prevState.game === null,
      error: null,
    }))

    const [err, canceled, data] = await fetchGame(game.id, include, source);

    if (canceled) {
      return;
    }

    if (err) {
      return setState(prevState => ({
        ...prevState,
        loading: false,
        error: err
      }));
    }

    if (data) {
      const { game } = data;

      return setState(prevState => ({
        ...prevState,
        loading: false,
        game: game,
        local: (game && game.local) ? {
          ...game.local,
          points: game && game.points ? game.points.filter(point => (point.teamId === game.local?.id) && point.status === 'VALID') : [],
        } : null,
        visitor: (game && game.visitor) ? {
          ...game.visitor,
          points: game && game.points ? game.points.filter(point => (point.teamId === game.visitor?.id) && point.status === 'VALID') : [],
        } : null,
        points: game && game.points ? game.points : [],
      }))
    }
  }, [game.id]);

  useEffect(() => {
    let source = axios.CancelToken.source();

    fetch(source);

    if (!game.isFinished) {
      interval.current = window.setInterval(() => {
        source = axios.CancelToken.source();

        fetch(source);
      } , 60000);
  
      return () => {
        clearInterval(interval.current);
        source.cancel();
      };
    }

    return () => source.cancel();
  }, [fetch, game]);

  return state;
}

type State = {
  loading: boolean,
  error: Error | null,
  game: Game | null,
  local: Team | null,
  visitor: Team | null,
  points: Array<Point>
}