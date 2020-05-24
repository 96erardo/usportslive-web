import React, { useEffect, useRef, useCallback } from 'react';
import { openAppModal, closeAppModal } from '../modules/app/app-actions';
import { useDispatch } from 'react-redux';
import { AppDispatch, Size, EventStore, EventResult } from './types';
import { useTypedSelector } from './utils';

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
  const data = useTypedSelector(state => state[store][event][result]);
  const mounted = useRef(false);

  const onHandler = useCallback(handler, dependencies);

  useEffect(() => {
    if (mounted.current) {
      onHandler(data);
    }
    
    mounted.current = true;
  }, [data, onHandler]);
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
  const dispatch: AppDispatch = useDispatch();

  const open = useCallback((props: object) => {
    dispatch(openAppModal(title, Component as React.ComponentType, props, maxWidth));
  }, [dispatch, title, Component, maxWidth]);

  const close = useCallback(() => {
    dispatch(closeAppModal());
  }, [dispatch])

  return { open, close };
}

/**
 * Hook that encapsulates the close functionality of the global modal component
 * 
 * @returns {Fuction} The close modal function
 */
export function useCloseModal () {
  const dispatch: AppDispatch = useDispatch();

  const close = useCallback(() => {
    dispatch(closeAppModal());
  }, [dispatch])

  return close;
}