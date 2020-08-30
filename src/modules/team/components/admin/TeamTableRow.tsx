import React, { useCallback } from 'react';
import { Table, Dropdown, Icon, Menu, Text, useModal } from '@8base/boost';
import { Team } from '../../../../shared/types';
import { DATE_FORMAT } from '../../../../shared/constants';
import Link from '../../../../shared/components/buttons/Link';
import moment from 'moment';

function TeamTableRow ({ columns, team }: Props) {
  const { openModal } = useModal('update-team-dialog');

  const onUpdate = useCallback(() => {
    openModal('update-team-dialog', {
      id: team.id,
      name: team.name,
    });
  }, [team, openModal]);

  return (
    <Table.BodyRow columns={columns}>
      <Table.BodyCell>{team.id}</Table.BodyCell>
      <Table.BodyCell>
        <Link to={`/admin/team/${team.id}`} color="primary" variant="link">
          {team.name}
        </Link>
      </Table.BodyCell>
      <Table.BodyCell>{team.sport?.name}</Table.BodyCell>
      <Table.BodyCell>
        {moment(team.createdAt).format(DATE_FORMAT)}
      </Table.BodyCell>
      <Table.BodyCell>
        <Dropdown defaultOpen={false}>
          <Dropdown.Head>
            <Icon name="More" color="GRAY_40" />
          </Dropdown.Head>
          <Dropdown.Body>
            <Menu>
              <Menu.Item onClick={onUpdate}>Editar</Menu.Item>
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
  team: Team,
  columns: string,
  afterUpdate: () => void
}

export default TeamTableRow;