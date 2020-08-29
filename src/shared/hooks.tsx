import { useState, useEffect, useRef, useCallback } from 'react';
import { EventStore, EventResult } from './types';
import { useLocation } from 'react-router-dom';
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

export function useQuery () {
  const location = useLocation();
  const [query] = useState(qs.parse(location.search, { ignoreQueryPrefix: true }));

  return query;
}