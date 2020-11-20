import React, { useCallback, useEffect, useState } from 'react';
import { Row, Loader, Card, Table, Text } from '@8base/boost';
import { Avatar } from '../../../shared/components/globals';
import { Paper } from '../../../shared/components/globals/Paper';
import { useParams } from 'react-router-dom';
import { onError } from '../../../shared/mixins';
import { Team } from '../../../shared/types';
import { fetchTeam } from '../team-actions';
import { TeamGames } from './TeamGames';
import axios, { CancelTokenSource } from 'axios';

export const TeamView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<Team | null>(null);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setLoading(true);

    const [err, canceled, data] = await fetchTeam(parseInt(id), ['logo', 'sport'], source);

    if (canceled) {
      return;
    }

    if (err) {
      return onError(err);
    }

    setLoading(false);

    if (data) {
      setTeam(data.team);
    }
  }, [id]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    
    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  if (loading) {
    return (
      <Row className="my-5" alignItems="center" justifyContent="center">
        <Loader
          size="md"
          color="PRIMARY"
        />
      </Row>
    );
  }

  if (team === null) {
    return null;
  }

  return (
    <div className="mt-5 container">
      <div className="row">
        <div className="col-md-4">
          <Paper>
            <Row className="w-100 p-3" alignItems="center" justifyContent="center">
              <Avatar
                size="lg"
                src={team.logo?.url}
                firstName={team.name}
                lastName={team.name[1]}
              />
            </Row>
            <Card.Body padding="none">
              <Table>
                <Table.Body data={[
                  { label: 'Nombre', value: team.name },
                  { label: 'Deporte', value: team.sport?.name }
                ]}>
                  {(item: { label: string, value: string }) => (
                    <Table.BodyRow columns="150px 1fr">
                      <Table.BodyCell>
                        <Text weight="bold">{item.label}</Text>
                      </Table.BodyCell>
                      <Table.BodyCell>
                        <Text>{item.value}</Text>
                      </Table.BodyCell>
                    </Table.BodyRow>
                  )}
                </Table.Body>
              </Table>
            </Card.Body>
          </Paper>
        </div>
        <div className="col-md-8">
          <TeamGames id={parseInt(id)} />
        </div>
      </div>
    </div>
  );
}