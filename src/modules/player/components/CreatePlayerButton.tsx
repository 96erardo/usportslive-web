import React, { useCallback } from 'react';
import { Button, useModal } from '@8base/boost';
import PlayerFormDialog from './PlayerFormDialog';

const CreatePlayerButton: React.FC<Props> = ({ id, afterCreate }) => {
  const { openModal } = useModal('create-player-form');

  const onClick = useCallback(() => {
    openModal('create-player-form');
  }, [openModal]);

  return (
    <div>
      <Button color="neutral" onClick={onClick}>
        Crear Jugador
      </Button>
      <PlayerFormDialog
        id={id}
        type="create"
        onFinished={afterCreate}
      />
    </div>
  )
}

type Props = {
  id: number,
  afterCreate: () => void
}

export default CreatePlayerButton