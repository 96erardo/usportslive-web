import React, { useCallback } from 'react';
import MaterialDialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { closeAppModal } from '../../redux/actions/app';
import { AppDispatch } from '../../shared/types';

function Dialog () {
  const state: any = useSelector<RootState>(state => state.app.modal);
  const dispatch: AppDispatch = useDispatch();
  const Child: React.ComponentType | null = state.component;

  const handleClose = useCallback(() => {
    dispatch(closeAppModal())
  }, [dispatch])

  return (
    <MaterialDialog 
      open={state.isOpen} 
      maxWidth="sm"
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