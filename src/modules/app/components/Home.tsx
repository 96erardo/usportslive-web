import React, { useCallback, useEffect, useState } from 'react';
import { Link as BoostLink, Card, Column, Heading as BoostHeading, Row, styled } from '@8base/boost';
import { useHistory } from 'react-router-dom';
import { useGamesFeed } from '../../game/game-hooks';
import { Paper } from '../../../shared/components/globals/Paper';
import { onError } from '../../../shared/mixins';

const Heading = styled(BoostHeading)`
  cursor: pointer;
`;

function Home (props: Props) {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const { count, items, loading, error } = useGamesFeed(page);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error]);

  const onGameClicked = useCallback((id: number) => {
    history.push(`/game/${id}`);
  }, [history]);

  const handleMore = useCallback(() => {
    setPage(state => state + 1);
  }, []);

  const content = items.map(game => (
    <Paper key={game.id} stretch>
      <Card.Body>
        <Row stretch alignItems="center" justifyContent="center">
          <Heading type="h3" onClick={() => onGameClicked(game.id)}>
            {(game.local && game.visitor) ? (
                `${game.local.name} vs ${game.visitor.name}`
              ) : (
                game.competition?.name
              )
            }
          </Heading>
        </Row>
      </Card.Body>
    </Paper>
  ));

  return (
    <div>
      <div className="container-fluid mt-5">
        <Column stretch gap="lg">
          {content}
          {(!loading && items.length < count) &&
            <Row stretch alignItems="center" justifyContent="center">
              <BoostLink onClick={handleMore}>
                Load More
              </BoostLink>
            </Row>
          }
        </Column>
      </div>
    </div>
  );
}

type Props = {};

export default Home;