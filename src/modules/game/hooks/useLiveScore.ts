import { useState, useEffect, useCallback, useRef } from 'react';
import { Game, Team, Point } from '../../../shared/types';
import { fetchGame } from '../game-actions';
import { CancelTokenSource } from 'axios';

const initialState = {
  loading: true,
  error: null,
  game: null,
  local: null,
  visitor: null,
  points: [],
}

const include = ['points', 'local', 'visitor'];

/**
 * Hooks that returns a game live score
 * 
 * @param {number} game - The game to fetch the score from
 * 
 * @returns {State} The hook state
 */
export function useLiveScore (game: number): State {
  const [state, setState] = useState<State>(initialState);
  const cancelToken = useRef<CancelTokenSource>();
  const interval = useRef<number>();

  const fetch = useCallback(async () => {
    cancelToken.current?.cancel();

    setState(prevState => ({
      ...prevState,
      loading: prevState.game === null,
      error: null,
    }))

    const [err, canceled, data] = await fetchGame(game, include);

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
  }, [game]);

  useEffect(() => {
    fetch();

    interval.current = window.setInterval(fetch, 60000);

    return () => clearInterval(interval.current);
  }, [fetch]);

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