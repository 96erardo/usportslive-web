import { useCallback, useEffect, useState } from 'react';
import { Game } from '../../../shared/types';
import axios, { CancelTokenSource } from 'axios';
import { fetchGames } from '../../game/game-actions';
import { onError } from '../../../shared/mixins';

const initialState  = {
  items: [],
  count: 0,
  loading: true,
  error: null
}

/**
 * State for competition games fetching and pagination
 * 
 * @param {number} id - The competition id
 * 
 * @returns {HookState} The hook state
 */
export function useCompetitionGames (id: number): HookState {
  const [page, setPage] = useState(1);
  const [state, setState] = useState<State>(initialState);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setState(prevState => ({...prevState, loading: true }));

    const [err, canceled, data] = await fetchGames(page, ['local', 'visitor', 'local.logo', 'visitor.logo', 'competition'], {
      competition: id,
      local: { ne: null },
      visitor: { ne: null },
    }, source, 'date_ASC');

    if (canceled)
      return;

    if (err) {
      return onError(err);
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
      }));
    }
  }, [id, page]);

  const next = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [id]);

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

type State = {
  items: Array<Game>,
  count: number,
  loading: boolean,
  error: Error | null
}

type HookState = State & {
  next: () => void
}