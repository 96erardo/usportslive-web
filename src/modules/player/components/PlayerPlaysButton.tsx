import React, { useCallback, useState } from 'react';
import { Button } from '@8base/boost';
import PlayerSelector from './PlayerSelector';
import { Person as Player } from '../../../shared/types';
import { addPlayerToGame } from '../../game/game-actions';
import { onError } from '../../../shared/mixins';

const PlayerPlaysButton: React.FC<Props> = ({ id, gameId, teamId, onFinished }) => {
  const [loading, setLoading] = useState(false);

  const onSelected = useCallback(async (player: Player) => {
    setLoading(true);

    const [err] = await addPlayerToGame(
      player.id,
      gameId,
      teamId
    );

    setLoading(false);

    if (err) {
      return onError(err);
    }

    return onFinished();

  }, [gameId, teamId, onFinished]);

  return (
    <PlayerSelector id={id} onSelect={onSelected}>
      {open => (
        <Button color="primary" size="sm" loading={loading} onClick={() => open(teamId)}>
          Agregar
        </Button>
      )}
    </PlayerSelector>
  );
}

type Props = {
  id: string,
  gameId: number,
  teamId: number,
  onFinished: () => void,
}

export default PlayerPlaysButton;