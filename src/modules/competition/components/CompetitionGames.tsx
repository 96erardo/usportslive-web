import React from 'react';
import { Column, Row, Link, Loader, COLORS } from '@8base/boost';
import { useCompetitionGames } from '../hooks/useCompetitionGames';
import { GamePost } from '../../game/components/GamePost';
import { Heading } from '../../../shared/components/globals';

export const CompetitionGames: React.FC<Props> = ({ id }) => {
  const { items, count, loading, next } = useCompetitionGames(id);

  const games = items.map(game => (
    <GamePost
      key={game.id}
      game={game}
    />
  ));

  return (
    <Column className="w-100" gap="lg">
      {games}
      {loading && 
        <Row className="w-100" alignItems="center" justifyContent="center">
          <Loader size="md" color="PRIMARY" />
        </Row>
      }
      {!loading && count === 0 &&
        <Row stretch className="w-100" alignItems="center" justifyContent="center">
          <Column>
            <Heading type="h3" color={COLORS.GRAY_50}>
              Aún no se han agregado partidos en esta competición
            </Heading>
          </Column>
        </Row>
      }
      {!loading && items.length < count &&
        <Row className="w-100 py-3" alignItems="center" justifyContent="center">
          <Link onClick={next}>Cargar más</Link>
        </Row>
      }
    </Column>
  );
}

type Props = {
  id: number
}