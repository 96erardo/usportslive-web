import React, { useCallback, useEffect, useState } from 'react';
import { Card, Table, Link, Row, Loader, COLORS } from '@8base/boost';
import { Heading } from '../../../shared/components/globals';
import { useQuery } from '../../../shared/hooks';
import { fetchCompetitions } from '../../competition/competition-actions';
import { Competition, ListHooksState } from '../../../shared/types';
import { INITIAL_LIST_STATE } from '../../../shared/constants';
import axios, { CancelTokenSource } from 'axios';
import { onError } from '../../../shared/mixins';
import { useHistory } from 'react-router-dom';

export const CompetitionSearchResults: React.FC = () => {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [competitions, setCompetitions] = useState<ListHooksState<Competition>>(INITIAL_LIST_STATE);
  const [query] = useQuery();

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setCompetitions(state => ({...state, loading: true }));

    const [err, canceled, data] = await fetchCompetitions(page, ['sport'], { q: query.q as string }, source);

    if (canceled)
      return;

    if (err) {
      return setCompetitions(state => ({
        ...state,
        error: err
      }))
    }

    if (data) {
      return setCompetitions(state => ({
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
    if (competitions.error) {
      onError(competitions.error);
    }
  }, [competitions.error]);

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
          <span role="img" aria-label="trophy">🏆</span> Torneos
        </Heading>
      </div>
      <Card.Body padding="none">
        <Table>
          {competitions.count > 0 &&
            <Table.Body data={competitions.items}>
              {(competition: Competition) => (
                <Table.BodyRow key={competition.id} columns="200px 1fr">
                  <Table.BodyCell>
                    <Link onClick={() => history.push(`/competition/${competition.id}`)}>
                      {competition.name}
                    </Link>
                  </Table.BodyCell>
                  <Table.BodyCell>
                    {competition.sport?.name}
                  </Table.BodyCell>
                </Table.BodyRow>
              )}
            </Table.Body>
          }
        {competitions.loading &&
          <Row className="w-100 py-3" alignItems="center" justifyContent="center">
            <Loader color="PRIMARY" size="sm" />
          </Row>
        }
        {!competitions.loading && competitions.items.length < competitions.count &&
          <Row className="w-100 py-3" alignItems="center" justifyContent="center">
            <Link onClick={next}>
              Cargar más
            </Link>
          </Row>
        }
        {!competitions.loading && competitions.count === 0 &&
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