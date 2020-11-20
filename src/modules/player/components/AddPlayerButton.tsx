import React, { useCallback } from 'react';
import { Button, useModal } from '@8base/boost';
import PlayerFormDialog from './PlayerFormDialog';

const AddPlayerButton: React.FC<Props> = ({ id, onFinished }) => {
  const { openModal } = useModal('add-player-form');

  const onClick = useCallback(() => {
    openModal('add-player-form');
  }, [openModal]);

  return (
    <div>
      <Button color="neutral" onClick={onClick}>
        Agregar Jugador
      </Button>
      <PlayerFormDialog
        id={id}
        type="add"
        onFinished={onFinished}
      />
    </div>
  );
}

type Props = {
  id: number,
  onFinished: () => void,
}

export default AddPlayerButton;