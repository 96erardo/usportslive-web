import { useState, useEffect, useCallback } from 'react';
import { fetchSports } from './sport-actions';
import { PaginatedListState, PaginatedResponse, Sport, AppDispatch } from '../../shared/types';
import { useSubscription } from '../../shared/hooks';
import { useDispatch } from 'react-redux';

const initialSports: PaginatedListState<Sport> = {
  items: [],
  count: 0,
  refresh: () => { },
  error: null,
  loading: true,
  last: false,
}

export function useSports (page = 1, infinite = false): PaginatedListState<Sport> {
  const dispatch: AppDispatch = useDispatch();
  const [sports, setSports] = useState<PaginatedListState<Sport>>(initialSports);
  
  const refresh = useCallback(() => {
    setSports(sports => ({...sports, loading: true }));
    dispatch(fetchSports(page));
  }, [page, dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useSubscription<PaginatedResponse<Sport>>('sport', 'fetchSports', 'success', data => 
    setSports(state => ({
      ...state,
      loading: false,
      items: data.items,
      count: data.count,
    }))
  );

  useSubscription<Error>('sport', 'fetchSports', 'error', error => 
    setSports(state => ({
      ...state,
      error
    }))
  );

  return {...sports, refresh };
}