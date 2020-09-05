import React, { useState } from 'react';
import { Table, Row, Pagination } from '@8base/boost';
import { useTeamPlayers } from '../../../player/player-hooks';
import Card from '../../../../shared/components/globals/Card';
import { Person as Player } from '../../../../shared/types';
import PlayerRow from './PlayerRow';

const include = ['user'];

const PlayersTable: React.FC<Props> = (props: Props) => {
  const [page, setPage] = useState(1);
  const { items, count, loading } = useTeamPlayers(props.teamId, page, include);

  return (
    <Card stretch>
      <Card.Body padding="none">
        <Table>
          <Table.Body data={items} loading={loading}>
            {(player: Player) => (
              <PlayerRow 
                player={player}
              />
            )}
          </Table.Body>
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