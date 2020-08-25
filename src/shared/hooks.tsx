import React, { useEffect, useRef, useCallback } from 'react';
import { Size, EventStore, EventResult } from './types';

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

/**
 * Hooks that encapsulates the functionality of the global modal component
 * 
 * @param {string} title 
 * @param {React.ComponentType} Component 
 * @param {object} props 
 * 
 * @returns {Function}
 */
export function useModal (title: string, Component: React.ComponentType, maxWidth: Size = 'sm') {

  const open = useCallback(() => {
  }, []);

  const close = useCallback(() => {
  }, [])

  return { open, close };
}

/**
 * Hook that encapsulates the close functionality of the global modal component
 * 
 * @returns {Fuction} The close modal function
 */
export function useCloseModal () {

  const close = useCallback(() => {
  }, [])

  return close;
}