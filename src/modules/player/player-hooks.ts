import { useState, useRef, useCallback, useEffect } from 'react';
import {
  fetchTeamPlayers,
  CreatePlayerFilter
} from './player-actions';
import { ListHooksState, Person as Player } from '../../shared/types';
import axios, { CancelTokenSource } from 'axios';

const initialState = {
  count: 0,
  items: [],
  loading: true,
  error: null
}

/**
 * Team players list hook
 * 
 * @param {number} id - The id of the team to fetch the players from
 * @param {number} page - The page to fetch the players from
 * @param {Array<string>} include - The array of relations to include with the players
 * @param {CreatePlayerFilter} initialFilters - Initial filters 
  */
export function useTeamPlayers (id: number, page: number = 1, include: Array<string> = [], initialFilters: CreatePlayerFilter = {}) {
  const [filters, setFilters] = useState<CreatePlayerFilter>(initialFilters);
  const [state, setState] = useState<ListHooksState<Player>>(initialState);
  const cancelToken = useRef<CancelTokenSource>();

  useEffect(() => {
    setState(state => ({
      ...state,
      count: 0,
      items: [],
    }))
  }, [id, filters])

  const fetch = useCallback(async () => {
    cancelToken.current = axios.CancelToken.source();

    setState(state => ({...state, loading: true }));

    const [error, canceled, data] = await fetchTeamPlayers(id, page, include, filters, cancelToken.current);

    if (canceled) {
      return;
    }

    if (error) {
      return setState(state => ({
        ...state,
        loading: false,
        count: 0,
        items: [],
        error
      }));
    }

    setState(state => ({
      ...state,
      error: null,
      loading: false,
      count: data ? data.count : 0,
      items: data ? data.items : []
    }));
  }, [id, page, include, filters]);

  useEffect(() => {
    fetch();

    return () => cancelToken.current?.cancel();
  }, [fetch]);

  return {
    ...state,
    fetch,
    setFilters
  }
}

