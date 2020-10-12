import React, { useCallback } from 'react';
import { Avatar, Card, Row, COLORS, Text, styled } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import Can from '../../../shared/components/utilities/Can';
import PlayerPlaysButton from '../../player/components/PlayerPlaysButton';
import PlayerLiveItem from '../../player/components/PlayerLiveItem';
import SubstitutionButton from './SubstitutionButton';
import { PointFormDialog } from '../../point/components/PointFormDialog';
import { usePlayersInGameLive } from '../../game/game-hooks';
import { Game } from '../../../shared/types';

const Body = styled(Card.Body)`
  & > *:not(:last-child) {
    border-bottom: 2px solid #495661 !important;
  }
`;

const Section = styled(Card.Section)`
  height: 400px;
  overflow: auto;

  & > *:not(:last-child) {
    border-bottom: 1px solid #495661 !important;
  }
`;

const playing = 'playing';

const bench = 'bench';

const TeamLive: React.FC<Props> = ({ id, type, game }) => {
  const benchState = usePlayersInGameLive(game.id, id ? id : 0, bench);
  const fieldState = usePlayersInGameLive(game.id, id ? id : 0, playing);
  const { isLive, isFinished } = game;

  const refresh = useCallback(() => {
    benchState.fetch();
    fieldState.fetch();
  }, [benchState, fieldState]);

  const substitutes = benchState.items.map(player => (
    <PlayerLiveItem
      key={player.id}
      type="bench"
      teamId={id ? id : 0}
      player={player}
    />
  ));

  const players = fieldState.items.map(player => (
    <PlayerLiveItem
      key={player.id}
      type="playing"
      teamId={id ? id : 0}
      player={player}
    />
  ));

  return (
    <Paper background={COLORS.BLACK}>
      <Body padding="none">
        <Row className="p-4" stretch alignItems="center" justifyContent="between">
          <Row gap="md" alignItems="center">
            <Avatar size="sm" firstName={game[type]?.name[0]} lastName={game[type]?.name[0]} />
            <Text color="WHITE">{game[type]?.name}</Text>
          </Row>
        </Row>
        <Section padding="none">
          {players}
        </Section>
        {!isFinished &&
          <Row className="p-2" stretch alignItems="center" justifyContent="between">
            <Text color="WHITE">Suplentes</Text>
            <div>
              {!isLive &&
                <Can
                  perform="game-player:add"
                  onNo={() => null}
                  onYes={() => (
                    <PlayerPlaysButton 
                      id={type} 
                      teamId={id as number} 
                      gameId={game.id}
                      onFinished={refresh}
                    />
                  )}
                />
              }
              {isLive &&
                <Can
                  perform="game-player:substitution"
                  onNo={() => null}
                  onYes={() => (
                    <SubstitutionButton 
                      id={type}
                      teamId={id as number}
                      gameId={game.id}
                      afterSubstitution={refresh}
                    />
                  )}
                />
              }
            </div>
          </Row>
        }
        <Section padding="none">
          {substitutes}
        </Section>
      </Body>
      <PointFormDialog id={type} />
    </Paper>
  );
};

type Props = {
  type: 'local' | 'visitor',
  id: number | null,
  game: Game
}

export default TeamLive;