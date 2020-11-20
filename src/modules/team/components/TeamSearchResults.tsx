import React, { useCallback, useEffect, useState } from 'react';
import { Card, Table, Link, Row, Loader, COLORS } from '@8base/boost';
import { Avatar } from '../../../shared/components/globals';
import { Heading } from '../../../shared/components/globals';
import { useQuery } from '../../../shared/hooks';
import { fetchTeams } from '../team-actions';
import { Team, ListHooksState } from '../../../shared/types';
import { INITIAL_LIST_STATE } from '../../../shared/constants';
import axios, { CancelTokenSource } from 'axios';
import { onError } from '../../../shared/mixins';
import { useHistory } from 'react-router-dom';

export const TeamSearchResults: React.FC = () => {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [teams, setTeams] = useState<ListHooksState<Team>>(INITIAL_LIST_STATE);
  const [query] = useQuery();

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setTeams(state => ({...state, loading: true }));

    const [err, canceled, data] = await fetchTeams(page, ['logo'], { q: query.q as string }, source);

    if (canceled)
      return;

    if (err) {
      return setTeams(state => ({
        ...state,
        error: err
      }))
    }

    if (data) {
      return setTeams(state => ({
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
    if (teams.error) {
      onError(teams.error);
    }
  }, [teams.error]);

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
          <span role="img" aria-label="shield">🛡</span> Equipos
        </Heading>
      </div>
      <Card.Body padding="none">
        <Table>
          {teams.count > 0 &&
            <Table.Body data={teams.items}>
              {(team: Team) => (
                <Table.BodyRow key={team.id} columns="100px 1fr">
                  <Table.BodyCell>
                    <Avatar 
                      size="sm"
                      src={team.logo?.smallUrl}
                      firstName={team.name}
                      lastName={team.name[1]}
                    />
                  </Table.BodyCell>
                  <Table.BodyCell>
                    <Link onClick={() => history.push(`/team/${team.id}`)}>
                      {team.name}
                    </Link>
                  </Table.BodyCell>
                </Table.BodyRow>
              )}
            </Table.Body>
          }
          {teams.loading &&
            <Row className="w-100 py-3" alignItems="center" justifyContent="center">
              <Loader color="PRIMARY" size="sm" />
            </Row>
          }
          {!teams.loading && teams.items.length < teams.count &&
            <Row className="w-100 py-3" alignItems="center" justifyContent="center">
              <Link onClick={next}>
                Cargar más
              </Link>
            </Row>
          }
          {!teams.loading && teams.count === 0 &&
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