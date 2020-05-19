import React, { useCallback } from 'react';
import { openAppModal, closeAppModal } from './config/redux/actions/app';
import { useDispatch } from 'react-redux';
import { AppDispatch, Size } from './types';

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

export function useCloseModal () {
  const dispatch: AppDispatch = useDispatch();

  const close = useCallback(() => {
    dispatch(closeAppModal());
  }, [dispatch])

  return close;
}