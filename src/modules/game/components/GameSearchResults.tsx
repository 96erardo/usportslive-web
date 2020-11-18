import React, { useCallback, useEffect, useState } from 'react';
import { Card, Table, Link, Row, Loader } from '@8base/boost';
import { Heading } from '../../../shared/components/globals';
import { useQuery } from '../../../shared/hooks';
import { searchGames } from '../game-actions';
import { Game, ListHooksState } from '../../../shared/types';
import { INITIAL_LIST_STATE, DATE_TIME_FORMAT } from '../../../shared/constants';
import axios, { CancelTokenSource } from 'axios';
import { onError } from '../../../shared/mixins';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

export const GameSearchResults: React.FC = () => {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [games, setGames] = useState<ListHooksState<Game>>(INITIAL_LIST_STATE);
  const [query] = useQuery();

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setGames(state => ({...state, loading: true }));

    const [err, canceled, data] = await searchGames(query.q as string, page, source);

    if (canceled)
      return;

    if (err) {
      return setGames(state => ({
        ...state,
        error: err
      }))
    }

    if (data) {
      return setGames(state => ({
        ...state,
        error: null,
        loading: false,
        items: page === 1 ? data.items: [
          ...state.items,
          ...data.items
        ],
        count: data.count,
      }))
    }
  }, [query, page]);

  const next = useCallback(() => {
    setPage(state => state + 1);
  }, []);

  useEffect(() => {
    if (games.error) {
      onError(games.error);
    }
  }, [games.error]);

  useEffect(() => {
    setPage(1);
  }, [query.q]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  return (
    <Card stretch>
      <Card.Body padding="sm">
        <Heading type="h2" fontWeight="800">
          <span role="img" aria-label="alien-game">👾</span> Juegos
        </Heading>
      </Card.Body>
      <Card.Body padding="none">
        <Table>
          {games.count > 0 &&
            <Table.Body data={games.items}>
              {(game: Game) => (
                <Table.BodyRow key={game.id} columns="1fr 1fr 200px">
                  <Table.BodyCell>
                    <Link onClick={() => history.push(`/game/${game.id}`)}>
                      {game.local?.name} vs {game.visitor?.name}
                    </Link>
                  </Table.BodyCell>
                  <Table.BodyCell>
                    <Link onClick={() => history.push(`/competition/${game.competition?.id}`)}>
                      {game.competition?.name}
                    </Link>
                  </Table.BodyCell>
                  <Table.BodyCell>
                    {moment(game.date).format(DATE_TIME_FORMAT)}
                  </Table.BodyCell>
                </Table.BodyRow>
              )}
            </Table.Body>
          }
        {games.loading &&
          <Row className="w-100 py-3" alignItems="center" justifyContent="center">
            <Loader color="PRIMARY" size="sm" />
          </Row>
        }
        {!games.loading && games.items.length < games.count &&
          <Row className="w-100 py-3" alignItems="center" justifyContent="center">
            <Link onClick={next}>
              Cargar más
            </Link>
          </Row>
        }
        </Table>
      </Card.Body>
    </Card>
  );
}