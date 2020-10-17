import React, { useCallback } from 'react';
import { Table, Dropdown, Icon, Menu, Text, Avatar, useModal } from '@8base/boost';
import { Team } from '../../../../shared/types';
import { DATE_FORMAT } from '../../../../shared/constants';
import Link from '../../../../shared/components/buttons/Link';
import { deleteTeam } from '../../team-actions';
import { modalId as decisionModalId } from '../../../../shared/components/globals/DecisionDialog';
import { onError } from '../../../../shared/mixins';
import { toast } from 'react-toastify';
import moment from 'moment';

function TeamTableRow ({ columns, team, afterUpdate }: Props) {
  const { openModal, closeModal } = useModal('update-team-dialog');

  const onUpdate = useCallback(() => {
    openModal('update-team-dialog', {
      id: team.id,
      name: team.name,
      logo: team.logo,
    });
  }, [team, openModal]);

  const confirmDelete = useCallback(async () => {
    const [err] = await deleteTeam(team.id);

    closeModal(decisionModalId);

    if (err) {
      return onError(err);
    }

    toast.success('Equipo eliminado correctamente');

    afterUpdate();
  }, [team, afterUpdate, closeModal]);

  const onDelete = useCallback(() => {
    openModal(decisionModalId, {
      title: 'Eliminar equipos',
      text: 'Está seguro de que desea eliminar este equipo ?',
      confirmText: 'Si, Eliminar',
      cancelText: 'Cancelar',
      onClose: () => closeModal(decisionModalId),
      onCancel: () => closeModal(decisionModalId),
      onConfirm: confirmDelete
    });
  }, [openModal, closeModal, confirmDelete]);

  return (
    <Table.BodyRow columns={columns}>
      <Table.BodyCell>
        <Avatar 
          size="sm"
          src={team.logo?.smallUrl}
          firstName={team.name[0]}
          lastName={team.name[1]}
        />
      </Table.BodyCell>
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
              <Menu.Item onClick={onDelete}>
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