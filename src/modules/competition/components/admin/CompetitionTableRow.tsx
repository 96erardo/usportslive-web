import React, { useCallback } from 'react';
import { Table, Dropdown, Icon, Menu, Text } from '@8base/boost';
import { useHistory } from 'react-router';
import { Competition } from '../../../../shared/types';
import { DATE_FORMAT } from '../../../../shared/constants';
import moment from 'moment';

const CompetitionTableRow: React.FC<Props> = ({ columns, competition }) => {
  const history = useHistory();

  const onUpdate = useCallback(() => {
    history.push(`/admin/competition/${competition.id}`);
  }, [competition, history]);
  
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
        <Dropdown defaultOpen={false}>
          <Dropdown.Head>
            <Icon color="GRAY_40" name="More" />
          </Dropdown.Head>
          <Dropdown.Body>
            <Menu>
              <Menu.Item onClick={onUpdate}>
                Editar
              </Menu.Item>
              <Menu.Item>
                <Text color="DANGER">Eliminar</Text>
              </Menu.Item>
            </Menu>
          </Dropdown.Body>
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