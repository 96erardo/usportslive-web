import React, { useCallback, useEffect, useState } from 'react';
import { Row, Card, Loader, Column, Text, Table } from '@8base/boost';
import { Heading } from '../../../shared/components/globals';
import { useParams } from 'react-router-dom';
import { fetchCompetition } from '../competition-actions';
import axios, { CancelTokenSource } from 'axios';
import { onError } from '../../../shared/mixins';
import { Competition } from '../../../shared/types';
import { DATE_FORMAT } from '../../../shared/constants';
import moment from 'moment';
import { CompetitionGames } from './CompetitionGames';
import { CompetitionTeams } from './CompetitionTeams';

export const CompetitionView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const [competition, setCompetition] = useState<Competition | null>();

  const fetch = useCallback(async (source: CancelTokenSource) => {
    setLoading(true);

    const [err, canceled, data] = await fetchCompetition(
      parseInt(id),
      ['sport'],
      source
    );

    if (canceled)
      return;

    if (err) {
      return onError(err);
    }

    if (data) {
      setCompetition(data.competition);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  if (loading) {
    return (
      <Row className="w-100 mt-5" alignItems="center" justifyContent="center">
        <Loader size="md" color="PRIMARY" />
      </Row>
    )
  }

  return (
    <div className="container mt-5 mb-3">
      <div className="row">
        <div className="col-xs-12 col-lg-6">
          <Heading type="h1" fontWeight="900">
            {competition?.name}
          </Heading>
          <Column className="w-100 my-4" gap="lg">
            <Card className="w-100">
              <Card.Body padding="none">
                <Table>
                  <Table.Body data={[
                    { label: 'Deporte', value: competition?.sport?.name },
                    { label: 'Fecha de inicio', value: moment(competition?.startDate).format(DATE_FORMAT) },
                    { label: 'Estatus', value: competition?.status}
                  ]}>
                    {(row: { label: string, value: string }) => (
                      <Table.BodyRow columns="50% 50%">
                        <Table.BodyCell>
                          <Text weight="bold">
                            {row.label}
                          </Text>
                        </Table.BodyCell>
                        <Table.BodyCell>
                          <Text>
                            {row.value}
                          </Text>
                        </Table.BodyCell>
                      </Table.BodyRow>
                    )}
                  </Table.Body>
                </Table>
              </Card.Body>
            </Card>
            <CompetitionTeams id={parseInt(id)}/> 
          </Column>
        </div>
        <div className="col-xs-12 col-lg-6">
          <CompetitionGames id={parseInt(id)} />
        </div>
      </div>
    </div>
  );
}