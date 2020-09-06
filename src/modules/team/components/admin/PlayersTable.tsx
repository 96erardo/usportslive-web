import React, { useState } from 'react';
import { Table, Row, Button, Pagination } from '@8base/boost';
import { useTeamPlayers } from '../../../player/player-hooks';
import Card from '../../../../shared/components/globals/Card';
import TableBody from '../../../../shared/components/globals/TableBody';
import { Person as Player } from '../../../../shared/types';
import CreatePlayerButton from '../../../player/components/CreatePlayerButton';
import PlayerRow from './PlayerRow';

const include = ['user'];

const columns = '100px 135px 1fr 150px';

const PlayersTable: React.FC<Props> = (props: Props) => {
  const [page, setPage] = useState(1);
  const { items, count, loading, fetch } = useTeamPlayers(props.teamId, page, include);

  return (
    <Card stretch>
      <Card.Header>
        <Card.Header.Left>          
        </Card.Header.Left>
        <Card.Header.Right>
          <Button color="neutral">
            Add Player
          </Button>
          <CreatePlayerButton
            id={props.teamId}
            afterCreate={fetch}
          />
        </Card.Header.Right>
      </Card.Header>
      <Card.Body padding="none">
        <Table>
          <Table.Header columns={columns}>
            <Table.HeaderCell>Photo</Table.HeaderCell>
            <Table.HeaderCell>Number</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Header>
          <TableBody data={items} loading={loading}>
            {(player: Player) => (
              <PlayerRow 
                player={player}
                columns={columns}
              />
            )}
          </TableBody>
          <Table.Footer>
            <Row stretch alignItems="center" justifyContent="center">
              <Pagination 
                total={count}
                page={page}
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
  teamId: number
}

export default PlayersTable;