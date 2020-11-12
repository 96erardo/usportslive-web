import { useState, useEffect, useCallback } from 'react';
import { Game, ListHooksState, Person as Player } from '../../../shared/types';
import { fetchPlayersInGame } from '../game-actions';
import axios, { CancelTokenSource } from 'axios';

const initialState = {
  items: [],
  count: 0,
  loading: false,
  error: null,
};

export function usePlayersInGameLive (game: Game, teamId: number, type: 'playing' | 'bench' | '') {
  const [state, setState] = useState<ListHooksState<Player>>(initialState);

  const fetch = useCallback(async (source?: CancelTokenSource) => {

    if (teamId === 0) {
      return setState(state => ({
        ...state,
        loading: false,
        count: 0,
        items: [],
        error: null,
      }));
    }

    setState(state => ({...state, loading: true }));

    const [err, canceled, data] = await fetchPlayersInGame(game.id, teamId, type, source);

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
  }, [game.id, teamId, type]);

  useEffect(() => {
    let source = axios.CancelToken.source();

    fetch(source);

    if (!game.isFinished) {
      const interval = window.setInterval(() => {
        source = axios.CancelToken.source();
  
        fetch(source);
      }, 60000);

      return () => {
        clearInterval(interval);
        source.cancel();
      }
    }

    return () => source.cancel();
  }, [fetch, game]);

  return {
    ...state,
    fetch
  }
}