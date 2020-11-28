import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchGames } from './game-actions';
import { Game, ListHooksState } from '../../shared/types';
import axios, { CancelTokenSource } from 'axios';
import moment from 'moment';

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

export function useGamesFeed (sport?: number) {
  const [page, setPage] = useState(1);
  const [state, setState] = useState<ListHooksState<Game>>(initialState);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setState(state => ({...state, loading: true }));

    const filters = {
      isBefore: moment().endOf('day').toISOString(),
      local: { ne: null },
      visitor: { ne: null },
      ...((sport !== undefined && sport > 0) ? {
        sport: sport
      }: { })
    };

    const [err, canceled, data] = await fetchGames(page, ['local', 'visitor', 'competition'], filters, source, 'date_DESC');

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
      return setState(prevState => ({
        ...prevState,
        error: null,
        loading: false,
        count: data.count,
        items: page === 1 ? data.items : [
          ...prevState.items,
          ...data.items
        ],
      }))
    }
  }, [page, sport]);

  const next = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source)

    return () => source.cancel();
  }, [fetch]);

  return {
    ...state,
    next
  };
}