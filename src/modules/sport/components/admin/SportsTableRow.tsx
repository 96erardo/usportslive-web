import React from 'react';
import { Table, Button } from '@8base/boost';
import { Sport } from '../../../../shared/types';

function SportsTableRow ({ columns, sport }: Props) {
  return (
    <Table.BodyRow columns={columns}>
      <Table.BodyCell>{sport.id}</Table.BodyCell>
      <Table.BodyCell>{sport.name}</Table.BodyCell>
      <Table.BodyCell>{sport.color}</Table.BodyCell>
      <Table.BodyCell>
        {sport.team ? sport.team.name : (
          <Button color="primary" variant="link">
            Asignar
          </Button>
        )}
      </Table.BodyCell>
      <Table.BodyCell>{sport.createdAt}</Table.BodyCell>
      <Table.BodyCell></Table.BodyCell>
    </Table.BodyRow>
  );
}

type Props = {
  sport: Sport,
  columns: string,
}

export default SportsTableRow;