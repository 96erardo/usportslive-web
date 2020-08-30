import React, { useState, useCallback, useEffect } from 'react';
import { Row, Table, Pagination, styled } from '@8base/boost';
import CreateSportButton from './CreateSportButton';
import Card from '../../../../shared/components/globals/Card';
import SportsTableRow from './SportsTableRow';
import { useSports } from '../../sport-hooks';
import { Sport } from '../../../../shared/types';
import SearchInput from '../../../../shared/components/form/SearchInput';
import { useQuery } from '../../../../shared/hooks';
import { useHistory } from 'react-router-dom';
import SportFormDialog, { } from './SportFormDialog';
import qs from 'qs';

const Body = styled(Table.Body)`
  min-height: 500px;
`;

const include = ['team'];
const columns = '100px 1fr 150px repeat(2, 1fr) 150px';

function SportsView () {
  const history = useHistory();
  const query = useQuery();
  const [page, setPage] = useState(1);
  const { items, count, loading, filters, setFilters, fetch } = useSports(
    page, 
    include,
    query
  );

  useEffect(() => {
    setFilters(query);
  }, [query, setFilters])

  const handleSearch = useCallback((value: string) => {    
    history.push(`/admin/sports?${qs.stringify({
      ...filters,
      q: value ? value : undefined
    })}`);
  }, [history, filters]);

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
          <Card.Header.Right gap="sm">
            <CreateSportButton afterCreate={fetch}/>
          </Card.Header.Right>
        </Card.Header>
        <Card.Body padding="none">
          <Table>
            <Table.Header columns={columns}>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Nombre</Table.HeaderCell>
              <Table.HeaderCell>Color</Table.HeaderCell>
              <Table.HeaderCell>Equipo Oficial</Table.HeaderCell>
              <Table.HeaderCell>Fecha de Creación</Table.HeaderCell>
              <Table.HeaderCell>Acciones</Table.HeaderCell>
            </Table.Header>
            <Body data={items} loading={loading}>
              {(sport: Sport) => (
                <SportsTableRow sport={sport} columns={columns} />
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
      <SportFormDialog 
        type="update"
        onFinished={fetch}
      />
    </div>
  )
}

export default SportsView;