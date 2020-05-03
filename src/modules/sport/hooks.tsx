import { useState, useEffect } from 'react';
import { getSports } from './actions';
import { PaginatedListState, Sport } from '../../shared/types';
import { ITEMS_PER_PAGE } from '../../shared/constants';

const initialSports: PaginatedListState<Sport> = {
  items: [],
  count: 0,
  error: null,
  loading: true,
  last: false,
}

export function useSports (page = 0, infinite = false): PaginatedListState<Sport> {
  const [sports, setSports] = useState<PaginatedListState<Sport>>(initialSports);
  
  useEffect(() => {
    getSports(page)
      .then(items =>
        setSports(sports => ({
          ...sports,
          loading: false,
          items: infinite ? [...sports.items, ...items] : items,
          last: items.length < ITEMS_PER_PAGE,
        }))
      )
      .catch(e => setSports(sports => ({...sports, error: e})));
  }, [page, infinite]);

  return sports;
}