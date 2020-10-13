import React, { useState, useEffect, useCallback } from 'react';
import { Table, Row, Pagination, styled } from '@8base/boost';
import Card from '../../../../shared/components/globals/Card';
import SearchInput from '../../../../shared/components/form/SearchInput';
import { useQuery } from '../../../../shared/hooks';
import { useUsers } from '../../user-hooks';
import { User } from '../../../../shared/types';
import UserTableRow from './UserTableRow';

const Body = styled(Table.Body)`
  min-height: 500px;
`;

const include = ['person', 'role'];
const columns = '100px 1fr 200px 150px 200px';

function TeamsView () {
  const [query, setQuery] = useQuery();
  const [page, setPage] = useState(1);
  const { items, count, loading, filters, setFilters, fetch } = useUsers(
    page,
    include,
    query
  );

  useEffect(() => {
    setFilters(query)
  }, [query, setFilters]);

  const handleSearch = useCallback((value) => {
    setQuery('/admin/users', {
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
        </Card.Header>
        <Card.Body padding="none">
          <Table>
            <Table.Header columns={columns}>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Nombre</Table.HeaderCell>
              <Table.HeaderCell>Rol</Table.HeaderCell>
              <Table.HeaderCell>Stream Key</Table.HeaderCell>
              <Table.HeaderCell>Fecha de Alta</Table.HeaderCell>
            </Table.Header>
            <Body data={items} loading={loading}>
              {(user: User) => (
                <UserTableRow
                  user={user}
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
    </div>
  )
}

export default TeamsView;