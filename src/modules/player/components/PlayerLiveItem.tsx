import React, { useCallback, useContext } from 'react';
import { Avatar, Grid, Icon, Text, Dropdown, Menu, Tooltip, useModal } from '@8base/boost';
import { Person as Player } from '../../../shared/types';
import { GameContext } from '../../game/contexts/GameContext';
import { modalId } from '../../point/components/PointFormDialog';
import Can from '../../../shared/components/utilities/Can';
import { lineupPlayerInGame } from '../player-actions';
import { onError } from '../../../shared/mixins';

const PlayerLiveItem: React.FC<Props> = ({ player, type, teamId, onActionFinished }) => {
  const { openModal } = useModal();
  const { inMinute, outMinute, points } = player.participation;
  const game = useContext(GameContext);

  const onScore = useCallback(() => {
    const team = game?.localId === teamId ? 'local' : 'visitor';

    openModal(`${team}-${modalId}`, {
      gameId: game?.id,
      teamId: teamId,
      scorerId: player.id,
    });
  }, [game, teamId, player, openModal]);

  const onLineup = useCallback(async () => {
    const [err] = await lineupPlayerInGame(game ? game.id : 0, teamId, player.id);

    if (err) {
      return onError(err);
    }

    onActionFinished();
  }, [game, player, teamId, onActionFinished]);

  const on = inMinute !== null && inMinute > 0 && outMinute === null;
  const off = outMinute !== null;

  return (
    <div className="p-4" style={{ width: '100%' }}>
      <Grid.Layout
        stretch
        columns="50px 1fr 1fr"
        areas={
          [
            ['avatar', 'name', 'actions'],
            ['avatar', 'points', 'actions'],
          ]
        }
      >
        <Grid.Box area="avatar">
          <Avatar 
            size="sm" src={player.avatar?.smallUrl}
            firstName={player.name} 
            lastName={player.lastname}
          />
        </Grid.Box>
        <Grid.Box area="name" direction="row" alignItems="center">
          <Text weight="bold" color="WHITE">{player.name} {player.lastname}</Text>
          {on &&
            <Tooltip placement="right" message={`Min ${inMinute}.`}>
              <Icon
                className="ml-4"
                size="sm"
                name="ChevronTop"
                color="SUCCESS"
              />
            </Tooltip>
          }
          {off &&
            <Tooltip placement="right" message={`Min ${outMinute}.`}>
              <Icon
                className="ml-4"
                size="sm"
                name="ChevronDown"
                color="DANGER"
              />
            </Tooltip>
          }
        </Grid.Box>
        {points.length > 0 && (
          <Grid.Box area="points">
            <Text color="WHITE">
              {`${points.length} punto${points.length > 1 ? 's' : ''}`}
            </Text>
          </Grid.Box>
        )}
        <Can 
          perform="game-player:actions"
          data={{ game, status: type, participated: inMinute !== null }}
          onYes={() => (
            <Grid.Box area="actions" direction="row" alignItems="center" justifyContent="flex-end">
              <Dropdown defaultOpen={false}>
                <Dropdown.Head>
                  <Icon name="More" color="WHITE" />
                </Dropdown.Head>
                <Dropdown.Body>
                  <Menu>
                    <Can
                      perform="game-player:lineup"
                      data={{ game }}
                      onYes={() =>  (
                        <Menu.Item onClick={onLineup}>
                          {type === 'playing' ? 'Suplente' : 'Titular'}
                        </Menu.Item>
                      )}
                    />
                    <Can 
                      perform="game-point:create"
                      data={{ game, status: type }}
                      onYes={() => (
                        <Menu.Item onClick={onScore}>
                          Anotación
                        </Menu.Item>
                      )}
                    />
                  </Menu>
                </Dropdown.Body>
              </Dropdown>
            </Grid.Box>
          )}
        />
      </Grid.Layout>
    </div>
  );
}

type Props = {
  type: 'playing' | 'bench',
  player: Player,
  teamId: number,
  onActionFinished: () => void
}

export default PlayerLiveItem;