import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchGames, fetchPlayersInGame } from './game-actions';
import { Game, Person as Player, ListHooksState } from '../../shared/types';
import axios, { CancelTokenSource } from 'axios';

const initialState = {
  items: [],
  count: 0,
  loading: false,
  error: null,
};

const useCalendarInclude = ['local', 'visitor'];

export function useCalendarGames () {
  const [state, setState] = useState<ListHooksState<Game>>(initialState);
  const cancelToken = useRef<CancelTokenSource>();

  const fetch = useCallback(async (competition: number, isAfter: string, isBefore: string) => {
    cancelToken.current?.cancel();

    setState(state => ({...state, loading: true }));

    const filters = { competition, isAfter, isBefore };

    cancelToken.current = axios.CancelToken.source();

    const [err, canceled, data] = await fetchGames(0, useCalendarInclude, filters, cancelToken.current);

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

const useGamesFeedInclude = ['local', 'visitor', 'competition'];

export function useGamesFeed (page: number = 1) {
  const [state, setState] = useState<ListHooksState<Game>>(initialState);
  const cancelToken = useRef<CancelTokenSource>();
  const last = useRef<string>();

  const fetch = useCallback(async (feedPage) => {
    cancelToken.current?.cancel();

    setState(state => ({...state, loading: true }));

    const filters = {
      // isBefore: feedPage === 1 ? moment().toISOString() : moment(last.current).toISOString(),
      local: { ne: null },
      visitor: { ne: null },
    };

    cancelToken.current = axios.CancelToken.source();

    const [err, canceled, data] = await fetchGames(0, useGamesFeedInclude, filters, cancelToken.current);

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
      if (data.count > 0) {
        last.current = data.items[data.items.length - 1].date;
      }

      return setState(state => ({
        ...state,
        error: null,
        loading: false,
        count: data.count,
        items: [
          ...state.items,
          ...data.items
        ],
      }))
    }
  }, []);

  useEffect(() => {
    fetch(page)
  }, [page, fetch])

  return {
    ...state,
    fetch
  };
}

export function usePlayersInGameLive (gameId: number, teamId: number, type: 'playing' | 'bench' | '') {
  const [state, setState] = useState<ListHooksState<Player>>(initialState);
  const cancelToken = useRef<CancelTokenSource>();
  const interval = useRef<number>();

  const fetch = useCallback(async () => {
    cancelToken.current?.cancel();

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

    cancelToken.current = axios.CancelToken.source();

    const [err, canceled, data] = await fetchPlayersInGame(gameId, teamId, type, cancelToken.current);

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
  }, [gameId, teamId, type]);

  useEffect(() => {
    fetch();

    interval.current = window.setInterval(fetch, 60000);

    return () => clearInterval(interval.current);
  }, [fetch]);

  return {
    ...state,
    fetch
  }
}