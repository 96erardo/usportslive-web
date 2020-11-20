import React, { useCallback } from 'react';
import { Row, Text } from '@8base/boost';
import { Game } from '../../../shared/types';
import { useHistory } from 'react-router-dom';

export const GameSearchItem: React.FC<Props> = ({ game, closeModal }) => {
  const history = useHistory();

  const onClick = useCallback(() => {
    history.push(`/game/${game.id}`);

    closeModal();
  }, [history, game, closeModal]);

  return (
    <Row
      className="w-100 py-3 px-4 white-list-item"
      alignItems="center"
      justifyContent="start"
      gap="sm"
      onClick={onClick}
    >
      <Text 
        ellipsis
        title={`${game.local?.name} vs ${game.visitor?.name} (${game.competition?.name})`}
      >
        {game.local?.name} vs {game.visitor?.name} ({game.competition?.name})
      </Text>
    </Row>

  );
}

type Props = {
  game: Game,
  closeModal: () => void
}