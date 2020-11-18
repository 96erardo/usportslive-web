import React, { useCallback, useEffect, useState } from 'react';
import { Card, Table, Link, Row, Loader, COLORS } from '@8base/boost';
import { Avatar } from '../../../shared/components/globals';
import { Heading } from '../../../shared/components/globals';
import { useQuery } from '../../../shared/hooks';
import { fetchPersons } from '../../person/person-actions';
import { Person as Player, ListHooksState } from '../../../shared/types';
import { INITIAL_LIST_STATE } from '../../../shared/constants';
import axios, { CancelTokenSource } from 'axios';
import { onError } from '../../../shared/mixins';
import { useHistory } from 'react-router-dom';

export const PlayerSearchResults: React.FC = () => {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [players, setPlayers] = useState<ListHooksState<Player>>(INITIAL_LIST_STATE);
  const [query] = useQuery();

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setPlayers(state => ({...state, loading: true }));

    const [err, canceled, data] = await fetchPersons(page, ['avatar'], { q: query.q as string }, source);

    if (canceled)
      return;

    if (err) {
      return setPlayers(state => ({
        ...state,
        error: err
      }))
    }

    if (data) {
      return setPlayers(state => ({
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
    if (players.error) {
      onError(players.error);
    }
  }, [players.error]);

  useEffect(() => {
    setPage(1);
  }, [query.q]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  return (
    <Card className="w-100">
      <div className="p-4">
        <Heading type="h2" fontWeight="800">
          <span role="img" aria-label="shield">👽</span> Perfiles
        </Heading>
      </div>
      <Card.Body padding="none">
        <Table>
          {players.count > 0 &&
            <Table.Body data={players.items}>
              {(player: Player) => (
                <Table.BodyRow key={player.id} columns="200px 1fr">
                  <Table.BodyCell>
                    <Avatar 
                      size="sm"
                      src={player.avatar?.smallUrl}
                      firstName={player.name}
                      lastName={player.lastname}
                    />
                  </Table.BodyCell>
                  <Table.BodyCell>
                    <Link onClick={() => history.push(`/profile/${player.id}`)}>
                      {player.name}
                    </Link>
                  </Table.BodyCell>
                </Table.BodyRow>
              )}
            </Table.Body>
          }
          {players.loading &&
            <Row className="w-100 py-3" alignItems="center" justifyContent="center">
              <Loader color="PRIMARY" size="sm" />
            </Row>
          }
          {!players.loading && players.items.length < players.count &&
            <Row className="w-100 py-3" alignItems="center" justifyContent="center">
              <Link onClick={next}>
                Cargar más
              </Link>
            </Row>
          }
          {!players.loading && players.count === 0 &&
            <Row className="w-100 py-4" alignItems="center" justifyContent="center">
              <Heading type="h3" weight="800" color={COLORS.GRAY_50}>
                No se encontraron coincidencias
              </Heading>
            </Row>
          }
        </Table>
      </Card.Body>
    </Card>
  );
}