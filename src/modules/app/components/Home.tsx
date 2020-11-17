import React, { useEffect, useMemo, useState } from 'react';
import { Link as BoostLink, Column, Row } from '@8base/boost';
import { useGamesFeed } from '../../game/game-hooks';
import { onError } from '../../../shared/mixins';
import { SportsSidebar } from '../../sport/components/SportsSidebar';
import { GamesSidebar, Props } from '../../game/components/GamesSidebar';
import { CompetitionSidebar } from '../../competition/components/CompetitionSidebar';
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
    <div className="container mt-5">
      <div className="row">
        <div className=".d-none .d-md-block col-md-4">
          <Media query="(min-width: 768px)">
            <Column stretch>
              <SportsSidebar 
                selected={sport} 
                onSelect={setSport}
              />
              {sidebars}
              <CompetitionSidebar 
                title="Torneos Activos"
                type="IN_PROGRESS"
              />
            </Column>
          </Media>
        </div>
        <div className="col-xs-12 col-md-8">
          <Column className="mb-3" stretch gap="lg">
            {content}
            {(!loading && items.length < count) &&
              <Row className="w-100" alignItems="center" justifyContent="center">
                <BoostLink onClick={next}>
                  Cargar más
                </BoostLink>
              </Row>
            }
          </Column>
        </div>
      </div>
    </div>
  );
}

export default Home;