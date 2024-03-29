import React, { useState, useEffect, useCallback } from 'react';
import { Table, Row, Pagination, styled } from '@8base/boost';
import Card from '../../../../shared/components/globals/Card';
import SearchInput from '../../../../shared/components/form/SearchInput';
import { useQuery } from '../../../../shared/hooks';
import { useTeams } from '../../team-hooks';
import { Team } from '../../../../shared/types';
import TeamTableRow from './TeamTableRow';
import CreateTeamButton from './CreateTeamButton';
import TeamFormDialog from './TeamFormDialog';
import DecisionDialog from '../../../../shared/components/globals/DecisionDialog';
import Can from '../../../../shared/components/utilities/Can';

const Body = styled(Table.Body)`
  min-height: 500px;
`;

const include = ['sport', 'logo'];
const columns = '100px 1fr 300px 200px 150px';

function TeamsView () {
  const [query, setQuery] = useQuery();
  const [page, setPage] = useState(1);
  const { items, count, loading, filters, setFilters, fetch } = useTeams(
    page,
    include,
    query
  );

  useEffect(() => {
    setFilters(query)
  }, [query, setFilters]);

  const handleSearch = useCallback((value) => {
    setQuery('/admin/teams', {
      ...filters,
      q: value ? value : undefined
    });
  }, [filters, setQuery]);

  return (
    <div style={{ padding: '24px' }}>
      <Card stretch>
        <Card.Header>
          <Card.Header.Left>
            <SearchInput
              initialValue={query.q as string}
              width={30}
              onSearch={handleSearch}
            />
          </Card.Header.Left>
          <Can 
            perform="team:create"
            onYes={() => (
              <Card.Header.Right>
                <CreateTeamButton afterCreate={fetch} />
              </Card.Header.Right>
            )}
          />
        </Card.Header>
        <Card.Body padding="none">
          <Table>
            <Table.Header columns={columns}>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Nombre</Table.HeaderCell>
              <Table.HeaderCell>Deporte</Table.HeaderCell>
              <Table.HeaderCell>Fecha de Creación</Table.HeaderCell>
              <Can 
                perform="team:update"
                onYes={() => (
                  <Table.HeaderCell>Acciones</Table.HeaderCell>                  
                )}
              />
            </Table.Header>
            <Body data={items} loading={loading}>
              {(team: Team) => (
                <TeamTableRow
                  team={team}
                  columns={columns}
                  afterUpdate={fetch}
                />
              )}
            </Body>
            <Table.Footer>
              <Row stretch alignItems="center" justifyContent="center">
                <Pagination
                  page={page}
                  total={count}
                  onChange={setPage}
                />
              </Row>
            </Table.Footer>
          </Table>
        </Card.Body>
      </Card>
      <TeamFormDialog type="update" onFinished={fetch} />
      <DecisionDialog />
    </div>
  )
}

export default TeamsView;