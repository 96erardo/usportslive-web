import React, { useCallback } from 'react';
import { Row, Text } from '@8base/boost';
import { useHistory } from 'react-router-dom';
import { Competition } from '../../../shared/types';

export const CompetitionSearchItem: React.FC<Props> = ({ competition, closeModal }) => {
  const history = useHistory();

  const onClick = useCallback(() => {
    history.push(`/competition/${competition.id}`);

    closeModal();
  }, [history, competition, closeModal]);

  return (
    <Row
      className="w-100 py-3 px-4 white-list-item"
      alignItems="center"
      justifyContent="start"
      gap="sm"
      onClick={onClick}
    >
      <Text>
        {competition.name}
      </Text>
    </Row>
  );
}

type Props = {
  competition: Competition,
  closeModal: () => void
}