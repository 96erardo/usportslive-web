import { useCallback, useEffect, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { fetchTeamPerformance } from '../../team-actions';
import { Game, GamePerformance } from '../../../../shared/types';

const initialState = {
  items: [],
  loading: true,
  error: null,
}

export function useTeamPerformance (team: number, game: Game): State {
  const [state, setState] = useState<State>(initialState);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    if (team === 0)
      return;

    setState(prevState => ({ ...prevState, loading: true }));

    const [err, canceled, data] = await fetchTeamPerformance(team, game.id, source);

    if (canceled)
      return;
    
    if (err) {
      return setState(prevState => ({
        ...prevState,
        error: err,
      }));
    }

    if (data) {
      return setState(prevState => ({
        ...prevState,
        items: data,
        loading: false,
      }))
    }
  }, [team, game.id]);

  useEffect(() => {
    if (game.isFinished) {
      const source = axios.CancelToken.source();
  
      fetch(source);
  
      return () => source.cancel();
    }
  }, [fetch, game.isFinished]);

  return state;
}

type State = {
  items: Array<GamePerformance>,
  loading: boolean,
  error: Error | null
}