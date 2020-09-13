import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchCompetitions } from './competition-actions';
import axios, { CancelTokenSource } from 'axios';
import { ListHooksState, Competition } from '../../shared/types';

const initialState = {
  count: 0,
  items: [],
  loading: true,
  error: null
}

/**
 * Fetches the teams list
 * 
 * @param {number} page - The page number
 * @param {Array<string>} include - the relations to include
 * @param {object} initialFilters - The filters to first apply to the page
 * 
 * @returns {object} The hook state
 */
export function useCompetitions (page: number = 1, include: Array<string> = [], initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [state, setState] = useState<ListHooksState<Competition>>(initialState);
  const cancelToken = useRef<CancelTokenSource>()

  const fetch = useCallback(async () => {
    cancelToken.current = axios.CancelToken.source();

    setState(state => ({...state, loading: true }));

    const [error, canceled, data] = await fetchCompetitions(page, include, filters, cancelToken.current);

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