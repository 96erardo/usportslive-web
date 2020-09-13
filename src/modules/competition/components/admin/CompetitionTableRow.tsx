import React from 'react';
import { Table, Dropdown, Icon } from '@8base/boost';
import { Competition } from '../../../../shared/types';
import { DATE_FORMAT } from '../../../../shared/constants';
import moment from 'moment';

const CompetitionTableRow: React.FC<Props> = ({ columns, competition }) => {
  return (
    <Table.BodyRow columns={columns}>
      <Table.BodyCell>
        {competition.id}
      </Table.BodyCell>
      <Table.BodyCell>
        {competition.name}
      </Table.BodyCell>
      <Table.BodyCell>
        {competition.quantityOfTeams} 
      </Table.BodyCell>
      <Table.BodyCell>
        {competition.matchTime} minutos
      </Table.BodyCell>
      <Table.BodyCell>
        {moment(competition.startDate).format(DATE_FORMAT)}
      </Table.BodyCell>
      <Table.BodyCell>
        {competition.sport?.name}
      </Table.BodyCell>
      <Table.BodyCell>
        {competition.status}
      </Table.BodyCell>
      <Table.BodyCell>
        <Dropdown>
          <Dropdown.Head>
            <Icon color="GRAY_40" name="More" />
          </Dropdown.Head>
        </Dropdown>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

type Props = {
  columns: string,
  competition: Competition
}

export default CompetitionTableRow;