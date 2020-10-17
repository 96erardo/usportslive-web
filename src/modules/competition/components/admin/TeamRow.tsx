import React, { useCallback } from 'react';
import { Avatar, Table, Dropdown, Menu, Text, Icon, useModal } from '@8base/boost';
import { modalId } from '../../../../shared/components/globals/DecisionDialog';
import { removeTeamFromCompetition } from '../../competition-actions';
import { Team } from '../../../../shared/types';
import { onError } from '../../../../shared/mixins';
import { toast } from 'react-toastify';

const TeamRow: React.FC<Props> = ({ id, team, columns, afterMutation }) => {
  const { openModal, closeModal } = useModal(modalId);

  const handleDelete = useCallback(async () => {
    const [err] = await removeTeamFromCompetition(id, team.id);

    closeModal(modalId);

    if (err) {
      return onError(err);
    }

    toast.success('El equipo ya no pertenece al torneo');    
    
    afterMutation();
  }, [closeModal, id, team, afterMutation]);
  
  const handleClick = useCallback(() => {
    openModal(modalId, {
      title: 'Sacar equipo del torneo',
      text: 'Está seguro de que desea sacar al equipo de la torneo ?',
      confirmText: 'Si, Sacar',
      cancelText: 'Cancelar',
      onClose: () => closeModal(modalId),
      onCancel: () => closeModal(modalId),
      onConfirm: handleDelete
    });
  }, [handleDelete, openModal, closeModal]);

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
      <Table.BodyCell>{team.name}</Table.BodyCell>
      <Table.BodyCell>
        <Dropdown defaultOpen={false}>
          <Dropdown.Head>
            <Icon name="More" color="GRAY_40" />
          </Dropdown.Head>
          <Dropdown.Body >
            <Menu>
              <Menu.Item onClick={handleClick}>
                <Text color="DANGER">
                  Sacar
                </Text>
              </Menu.Item>
            </Menu>
          </Dropdown.Body>
        </Dropdown>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

type Props = {
  id: number,
  team: Team,
  columns: string,
  afterMutation: () => Promise<void>
}

export default TeamRow;