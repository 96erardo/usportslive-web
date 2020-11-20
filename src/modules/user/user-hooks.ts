import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchUsers, FilterData } from './user-actions';
import axios, { CancelTokenSource } from 'axios';
import { ListHooksState, User } from '../../shared/types';

const initialState = {
  count: 0,
  items: [],
  loading: true,
  error: null
}

/**
 * Fetches the users list
 * 
 * @param {number} page - The page number
 * @param {Array<string>} include - the relations to include
 * @param {FilterData} initialFilters - The filters to first apply to the page
 * 
 * @returns {object} The hook state
 */
export function useUsers (page: number = 1, include: Array<string> = [], initialFilters: FilterData = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [state, setState] = useState<ListHooksState<User>>(initialState);
  const cancelToken = useRef<CancelTokenSource>()

  const fetch = useCallback(async () => {
    cancelToken.current = axios.CancelToken.source();

    setState(state => ({...state, loading: true }));

    const [error, canceled, data] = await fetchUsers(page, include, filters, cancelToken.current);

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

  }, [page, include, filters]);

  useEffect(() => {
    fetch();

    return () => cancelToken.current?.cancel();
  }, [fetch])

  return {
    ...state,
    fetch,
    filters,
    setFilters
  }
};