import React, { useCallback } from 'react';
import { Button, useModal } from '@8base/boost';
import SportDialog from './SportFormDialog';

function CreateSportButton (props: Props) {
  const { openModal } = useModal('create-sport-dialog');

  const handleClick = useCallback(() => {
    openModal('create-sport-dialog');
  }, [openModal])

  return (
    <React.Fragment>
      <Button color="neutral" onClick={handleClick}>
        Create Sport
      </Button>
      <SportDialog 
        type="create"
        onFinished={props.afterCreate}
      />
    </React.Fragment>
  );
}

type Props = {
  afterCreate: () => void
}

export default CreateSportButton;