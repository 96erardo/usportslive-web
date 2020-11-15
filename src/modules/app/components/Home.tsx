import React, { useEffect, useMemo, useState } from 'react';
import { Link as BoostLink, Column, Row } from '@8base/boost';
import { useGamesFeed } from '../../game/game-hooks';
import { onError } from '../../../shared/mixins';
import { SportsSidebar } from '../../sport/components/SportsSidebar';
import { GamesSidebar, Props } from '../../game/components/GamesSidebar';
import { GamePost } from '../../game/components/GamePost';
import Media from 'react-media';

const games: Array<Props> = [
  { title: 'Hoy', startOf: 'day', endOf: 'day' },
  { title: 'Semana pasada', startOf: 'week', endOf: 'week', manipulate: { type: 'subtract', amount: 1, time: 'week' } },
  { title: 'Proxima semana', startOf: 'week', endOf: 'week', manipulate: { type: 'add', amount: 1, time: 'week' } },
];

function Home () {
  const [sport, setSport] = useState(0);
  const { count, items, next, loading, error } = useGamesFeed(sport);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error]);

  const content = items.map(game => (
    <GamePost
      key={game.id}
      game={game}
    />
  ));

  const sidebars = useMemo(() => games.map((game, i) => (
    <GamesSidebar 
      key={i}
      {...game}
    />
  )), []);

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className=".d-none .d-md-block col-md-3">
          <Media query="(min-width: 768px)">
            <Column stretch>
              <SportsSidebar 
                selected={sport} 
                onSelect={setSport}
              />
            </Column>
          </Media>
        </div>
        <div className="col-xs-12 col-md-6">
          <Column stretch gap="lg">
            {content}
            {(!loading && items.length < count) &&
              <Row stretch alignItems="center" justifyContent="center">
                <BoostLink onClick={next}>
                  Cargar más
                </BoostLink>
              </Row>
            }
          </Column>
        </div>
        <div className=".d-none .d-md-block col-md-3">
          <Media query="(min-width: 768px)">
            <Column stretch>
              {sidebars}
            </Column>
          </Media>
        </div>
      </div>
    </div>
  );
}

export default Home;