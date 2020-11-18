import React, { useCallback } from 'react';
import { Row, Text } from '@8base/boost';
import { Avatar } from '../../../shared/components/globals';
import { useHistory } from 'react-router-dom';
import { Team } from '../../../shared/types';

export const TeamSearchItem: React.FC<Props> = ({ team, closeModal }) => {
  const history = useHistory();

  const onClick = useCallback(() => {
    history.push(`/team/${team.id}`);

    closeModal();
  }, [history, team, closeModal]);

  return (
    <Row
      className="w-100 py-3 px-4 white-list-item"
      alignItems="center"
      justifyContent="start"
      gap="sm"
      onClick={onClick}
    >
      <Avatar
        size="xs"
        src={team.logo?.smallUrl}
        firstName={team.name}
        lastName={team.name[1]}
      />
      <Text>
        {team.name}
      </Text>
    </Row>
  );
}

type Props = {
  team: Team,
  closeModal: () => void
}