import React, { useCallback } from 'react';
import { Button, useModal } from '@8base/boost';
import { modalId as bindAccountModalId, BindAccountDialog } from './BindAccountDialog';

export const BindAccountButton: React.FC = () => {
  const { openModal } = useModal(bindAccountModalId);

  const onClick = useCallback(() => {
    openModal(bindAccountModalId);
  }, [openModal]);

  return (
    <>
      <Button color="neutral" onClick={onClick}>
        Vincular Cuentas
      </Button>
      <BindAccountDialog />
    </>
  );
}