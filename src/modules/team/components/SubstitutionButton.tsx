import React, { useCallback } from 'react';
import { Button, useModal } from '@8base/boost';
import SubstitutionDialog, { modalId } from './SubstitutionDialog';

const SubstitutionButton: React.FC<Props> = ({ id, gameId, teamId, afterSubstitution }) => {
  const { openModal } = useModal(`${id}-${modalId}`);

  const handleClick = useCallback(() => {
    openModal(`${id}-${modalId}`)
  }, [id, openModal])

  return (
    <>
      <Button color="primary" onClick={handleClick}>
        Substituir
      </Button>
      <SubstitutionDialog 
        id={id}
        gameId={gameId}
        teamId={teamId}
        afterSubstitution={afterSubstitution}
      />
    </>
  );
}

type Props = {
  id: string,
  gameId: number,
  teamId: number,
  afterSubstitution: () => void
}

export default SubstitutionButton;