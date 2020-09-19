import React, { useEffect, useState } from 'react';
import { Table, Pagination, Row } from '@8base/boost';
import { useTeams } from '../../../team/team-hooks';
import Body from '../../../../shared/components/globals/TableBody';
import { Team } from '../../../../shared/types';
import TeamRow from './TeamRow';
import { onError } from '../../../../shared/mixins';
import AddTeamButton from './AddTeamButton';
import Card from '../../../../shared/components/globals/Card';

const include: Array<string> = [];

const columns = '100px 1fr 200px';

const CompetitionTeamsTable: React.FC<Props> = ({ sportId, competitionId }) => {
  const [page, setPage] = useState(1);
  const { items, loading, count, error, setFilters, fetch } = useTeams(page, include);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error]);

  useEffect(() => {
    setFilters({
      competition: competitionId
    })
  }, [setFilters, competitionId]);

  return (
    <Card stretch>
      <Card.Header>
        <Row stretch alignItems="center" justifyContent="end">
          <AddTeamButton 
            sportId={sportId}
            competitionId={competitionId}
            afterMutation={fetch}
          />
        </Row>
      </Card.Header>
      <Card.Body>
        <Table>
          <Table.Header columns={columns}>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Header>
          <Body data={items} loading={loading}>
            {(team: Team) => (
              <TeamRow 
                team={team}
                columns={columns}
              />
            )}
          </Body>
          <Table.Footer>
            <Row stretch alignItems="center" justifyContent="center">
              <Pagination 
                total={count}
                onChange={setPage}
              />
            </Row>
          </Table.Footer>
        </Table>
      </Card.Body>
    </Card>
  );
}

type Props = {
  competitionId: number,
  sportId: number,
}

export default CompetitionTeamsTable;