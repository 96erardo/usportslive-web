import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Row, Pagination, styled } from '@8base/boost';
import CompetitionFilter from './CompetitionFilter';
import Card from '../../../../shared/components/globals/Card';
import SearchInput from '../../../../shared/components/form/SearchInput';
import { useCompetitions } from '../../competition-hooks';
import { useQuery } from '../../../../shared/hooks';
import { Competition } from '../../../../shared/types';
import CompetitionTableRow from './CompetitionTableRow';
import { FilterData } from '../../competition-actions';
import { useHistory } from 'react-router-dom';
import DecisionDialog from '../../../../shared/components/globals/DecisionDialog';

const Body = styled(Table.Body)`
  min-height: 500px;
`;

const include = ['sport'];
const columns = '80px 1fr 150px 150px 250px 1fr 100px 100px';

const CompetitionView: React.FC = () => {
  const history = useHistory();
  const [query, setQuery] = useQuery();
  const [page, setPage] = useState(1);
  const { items, count, loading, filters, setFilters, fetch } = useCompetitions(page, include, query);

  useEffect(() => {
    setFilters(query);
  }, [query, setFilters]);

  const handleCreate = useCallback(() => {
    history.push('/admin/competition');
  }, [history]);

  const handleFilter = useCallback((data: FilterData) => {
    setQuery('/admin/competitions', {
      ...filters,
      ...data
    });
  }, [filters, setQuery]);

  const handleSearch = useCallback((value) => {
    setQuery('/admin/competitions', {
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
            <CompetitionFilter
              initialValues={{
                sport: query.sport as string,
                startsAfter: query.startsAfter as string,
                startsBefore: query.startsBefore as string,
              }}
              onFilter={handleFilter}
            />
          </Card.Header.Left>
          <Card.Header.Right>
            <Button color="neutral" onClick={handleCreate}>
              Crear Torneo
            </Button>
          </Card.Header.Right>
        </Card.Header>
        <Card.Body padding="none">
          <Table>
            <Table.Header columns={columns}>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Nombre</Table.HeaderCell>
              <Table.HeaderCell>N° Equipos</Table.HeaderCell>
              <Table.HeaderCell>Duración</Table.HeaderCell>
              <Table.HeaderCell>Inicio</Table.HeaderCell>
              <Table.HeaderCell>Deporte</Table.HeaderCell>
              <Table.HeaderCell>Estatus</Table.HeaderCell>
              <Table.HeaderCell>Acciones</Table.HeaderCell>
            </Table.Header>
            <Body data={items} loading={loading}>
              {(competition: Competition) => (
                <CompetitionTableRow
                  columns={columns}
                  competition={competition}
                  afterMutation={fetch}
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
      <DecisionDialog />
    </div>
  );
}

export default CompetitionView;