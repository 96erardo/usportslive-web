import React from 'react';
import { Table, Dropdown, Icon } from '@8base/boost';
import { Team } from '../../../../shared/types';
import { DATE_FORMAT } from '../../../../shared/constants';
import moment from 'moment';

function TeamTableRow ({ columns, team }: Props) {
  return (
    <Table.BodyRow columns={columns}>
      <Table.BodyCell>{team.id}</Table.BodyCell>
      <Table.BodyCell>{team.name}</Table.BodyCell>
      <Table.BodyCell>{team.sport?.name}</Table.BodyCell>
      <Table.BodyCell>
        {moment(team.createdAt).format(DATE_FORMAT)}
      </Table.BodyCell>
      <Table.BodyCell>
        <Dropdown defaultOpen={false}>
          <Dropdown.Head>
            <Icon name="More" color="GRAY_40" />
          </Dropdown.Head>
        </Dropdown>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

type Props = {
  team: Team,
  columns: string,
  afterUpdate: () => void
}

export default TeamTableRow;