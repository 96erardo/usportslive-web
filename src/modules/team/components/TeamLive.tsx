import React, { useCallback } from 'react';
import { Card, Row, COLORS, Text, styled } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import Can from '../../../shared/components/utilities/Can';
import PlayerPlaysButton from '../../player/components/PlayerPlaysButton';
import PlayerLiveItem from '../../player/components/PlayerLiveItem';
import SubstitutionButton from './SubstitutionButton';
import { PointFormDialog } from '../../point/components/PointFormDialog';
import { usePlayersInGameLive } from '../../game/hooks/usePlayersInGameLive';
import { Avatar } from '../../../shared/components/globals';
import { Game } from '../../../shared/types';
import { useTeamPerformance } from './hooks/useTeamPerformance';

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
  const benchState = usePlayersInGameLive(game, id ? id : 0, bench);
  const fieldState = usePlayersInGameLive(game, id ? id : 0, playing);
  const performance = useTeamPerformance(id ? id : 0 , game);
  

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
      performance={performance.items.find(perf => perf.person_id === player.id)}
      onActionFinished={refresh}
    />
  ));

  const players = fieldState.items.map(player => (
    <PlayerLiveItem
      key={player.id}
      type="playing"
      teamId={id ? id : 0}
      player={player}
      performance={performance.items.find(perf => perf.person_id === player.id)}
      onActionFinished={refresh}
    />
  ));

  return (
    <Paper background={COLORS.GRAY_70}>
      <Body padding="none">
        <Row className="p-4" stretch alignItems="center" justifyContent="between">
          <Row gap="md" alignItems="center">
            <Avatar
              size="sm"
              src={game[type]?.logo?.mediumUrl}
              firstName={game[type]?.name[0]}
              lastName={game[type]?.name[0]}
            />
            <Text color="WHITE">{game[type]?.name}</Text>
          </Row>
        </Row>
        <Section padding="none">
          {players}
        </Section>
        <Row gap="sm" className="p-2" stretch alignItems="center" justifyContent="between">
          <Text color="WHITE">Suplentes</Text>
          <Row alignItems="center" justifyContent="end">
            <Can
              perform="game-player:add"
              data={{ game }}
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
            <Can
              perform="game-player:substitute"
              data={{ game }}
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
          </Row>
        </Row>
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