import React, { useCallback } from 'react';
import MaterialDialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { useDispatch } from 'react-redux';
import { closeAppModal } from '../../config/redux/actions/app';
import { AppDispatch, ModalState } from '../../types';
import { useTypedSelector } from '../../utils';

function Dialog () {
  const state: ModalState = useTypedSelector(state => state.app.modal);
  const dispatch: AppDispatch = useDispatch();
  const Child: React.ComponentType | undefined = state.component;

  const handleClose = useCallback(() => {
    dispatch(closeAppModal())
  }, [dispatch])

  return (
    <MaterialDialog 
      open={state.isOpen} 
      maxWidth={state.maxWidth}
      fullWidth
      onClose={handleClose}
    >
      <DialogTitle>{state.title}</DialogTitle>
      <DialogContent dividers>
        {Child &&
          <Child {...state.props} />
        }
      </DialogContent>
    </MaterialDialog>
  );
}

export default Dialog;