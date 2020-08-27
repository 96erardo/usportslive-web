import { useState, useEffect, useCallback } from 'react';
import { fetchSports } from './sport-actions';

const initialState = {
  count: 0,
  items: [],
  loading: true,
  error: null
}

/**
 * Fetches the sports list
 * 
 * @param {number} page - The page to fetch the sports from
 * @param {object} initialFilters - The filters to first apply to the page
 * 
 * @return {object} - The hook state
 */
export function useSports (page: number = 1, include: Array<string> = [], initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [state, setState] = useState(initialState);

  const fetch = useCallback(async () => {
    const [error, data] = await fetchSports(page, include, filters);

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
      count: data.count,
      items: data.items
    }));

  }, [page, include, filters]);

  useEffect(() => {
    fetch();
  }, [fetch])

  return {
    ...state,
    setFilters
  }
}