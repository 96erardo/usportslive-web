import React from 'react';
import { Row, Link, Loader, COLORS } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import { Heading } from '../../../shared/components/globals';
import { GameItem } from './GameItem';
import { usePlayerGames } from '../hooks/usePlayerGames';

export const LatestPlayerGames: React.FC<Props> = ({ player }) => {
  const { items, loading, count, next } = usePlayerGames(player);

  if (items.length === 0) {
    return null;
  }

  return (
    <Paper className="w-100" background={COLORS.BLACK} >
      <div className="w-100 p-3 border-bottom">
        <Heading type="h2" color="#fff">
          Últimos juegos
        </Heading>
      </div>
      {items.map((game, i) => (
        <GameItem
          index={i}
          game={game}
        />
      ))}
      {loading &&
        <Row className="w-100 py-3">
          <Loader color="PRIMARY" size="sm" />
        </Row>
      }
      {items.length < count && !loading &&
        <Row className="w-100 pb-3 pt-2" alignItems="center" justifyContent="center">
          <Link onClick={next}>
            Cargar más
          </Link>
        </Row>
      }
    </Paper>
  );
}

type Props = {
  player: number
}