import { useState, useEffect, useRef, useCallback } from 'react';
import { EventStore, EventResult } from './types';
import { useLocation, useHistory } from 'react-router-dom';
import qs from 'qs';

/**
 * Hook that subscribes to store changes to execute callbacks
 * in every store event
 * 
 * @param {EventStore} store - The store to subscribe to
 * @param {string} event - The event that dispatches the action
 * @param {EventResult} result - The result of the request to be subscribed to
 * @param {Function} handler - The function called on every pub
 * 
 * @returns {void}
 */
export function useSubscription<R>(
  store: EventStore, 
  event: string, 
  result: EventResult, 
  handler: (data: R) => void, 
  dependencies: Array<any> = []
) {
  const mounted = useRef(false);

  const onHandler = useCallback(handler, dependencies);

  useEffect(() => {
    if (mounted.current) {
    }
    
    mounted.current = true;
  }, [onHandler]);
}

export function useQuery<T>(): [qs.ParsedQs, (path: string, filters: T) => void] {
  const location = useLocation();
  const history = useHistory();
  const [query, setQuery] = useState(qs.parse(location.search, { ignoreQueryPrefix: true }));

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setQuery(qs.parse(location.search, { ignoreQueryPrefix: true }));
    });

    return () => unlisten();
  });

  const updateQuery = useCallback((path: string, filters: T) => {
    history.push(`${path}?${qs.stringify(filters)}`);
  }, [history]);

  return [query, updateQuery];
}