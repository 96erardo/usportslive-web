import React, { useCallback } from 'react';
import { Button, useModal } from '@8base/boost';
import TeamFormDialog from './TeamFormDialog';

function CreateTeamButton (props: Props) {
  const { openModal } = useModal('create-team-dialog');

  const handleClick = useCallback(() => {
    openModal('create-team-dialog');
  }, [openModal])

  return (
    <div>
      <Button color="neutral" onClick={handleClick}>
        Crear Equipo
      </Button>
      <TeamFormDialog type="create" onFinished={props.afterCreate} />
    </div>
  )
}

type Props = {
  afterCreate: () => void
}

export default CreateTeamButton;