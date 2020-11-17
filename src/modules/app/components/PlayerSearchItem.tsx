import React, { useCallback } from 'react';
import { Row, Text } from '@8base/boost';
import { Avatar } from '../../../shared/components/globals';
import { Person as Player } from '../../../shared/types';
import { useHistory } from 'react-router-dom';

export const PlayerSearchItem: React.FC<Props> = ({ player }) => {
  const history = useHistory();

  const onClick = useCallback(() => {
    history.push(`/profile/${player.id}`);
  }, [player, history]);

  return (
    <Row
      className="w-100 py-3 px-4 white-list-item"
      alignItems="center"
      justifyContent="start"
      gap="sm"
      onClick={onClick}
    >
      <Avatar
        src={player.avatar?.smallUrl}
        size="xs"
        firstName={player.name}
        lastName={player.lastname}
      />
      <Text>
        {player.name} {player.lastname}
      </Text>
    </Row>
  );
}

type Props = {
  player: Player
}