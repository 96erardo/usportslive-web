import { useState, useEffect, useCallback } from 'react';
import { fetchPlayerGames } from '../game-actions';
import axios, { CancelTokenSource } from 'axios';
import { Game, ListHooksState } from '../../../shared/types';

const initialState = {
  loading: true,
  count: 0,
  items: [],
  error: null,
};

export function usePlayerGames (player: number): Result {
  const [page, setPage] = useState(1);
  const [state, setState] = useState<ListHooksState<Game>>(initialState);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setState(prevState => ({...prevState, loading: true }));

    const [err, canceled, data] = await fetchPlayerGames(player, page, source);

    if (canceled) {
      return;
    }

    if (err) {
      return setState(prevState => ({
        ...prevState,
        error: err
      }));
    }

    if (data) {
      return setState(prevState => ({
        ...prevState,
        loading: false,
        count: data.count,
        items: page === 1 ? data.items : [
          ...prevState.items,
          ...data.items
        ]
      }))
    }
  }, [player, page]);

  const next = useCallback(() => {
    setPage(prevState => prevState + 1);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [player]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  return {
    ...state,
    next
  }
}

type Result = ListHooksState<Game> & {
  next: () => void
}