import React from 'react';
import { Table, Dropdown, Icon } from '@8base/boost';
import { Team } from '../../../../shared/types';

const TeamRow: React.FC<Props> = ({ team, columns }) => {
  return (
    <Table.BodyRow columns={columns}>
      <Table.BodyCell>{team.id}</Table.BodyCell>
      <Table.BodyCell>{team.name}</Table.BodyCell>
      <Table.BodyCell>
        <Dropdown>
          <Dropdown.Head>
            <Icon name="More" color="GRAY_60" />
          </Dropdown.Head>
          <Dropdown.Body>
          
          </Dropdown.Body>
        </Dropdown>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

type Props = {
  team: Team,
  columns: string,
}

export default TeamRow;