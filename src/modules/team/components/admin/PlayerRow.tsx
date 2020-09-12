import React, { useCallback } from 'react';
import { Table, Text, Avatar, Icon, Dropdown, Menu, Link, useModal, styled } from '@8base/boost';
import { Person as Player } from '../../../../shared/types';
import ShirtIcon from '../../../../shared/components/icons/ShirtIcon';
import { modalId } from '../../../../shared/components/globals/DecisionDialog';
import { removePlayerFromTeam } from '../../../player/player-actions';
import { onError } from '../../../../shared/mixins';
import { toast } from 'react-toastify';

const Number = styled(Text)`
  font-family: 'Roboto Slab', sans-serif;
  font-size: 2rem;
`;

const PlayerRow: React.FC<Props> = ({ player, columns, onMutation }) => {
  const { openModal, closeModal } = useModal('update-player-form');
  const [team] = player.teams ? player.teams : [];

  const handleDelete = useCallback(async () => {
    const [err] = await removePlayerFromTeam(team.id, player.id);
    
    closeModal(modalId);
    
    if (err) {
      return onError(err);
    }

    toast.success('Jugador eliminado del equipo correctamente');

    onMutation();
  }, [player, closeModal, onMutation]);

  const onDelete = useCallback(() => {
    openModal(modalId, {
      title: 'Quitar jugador del equipo',
      text: '¿Estás seguro de que deseas quitar a este jugador del equipo?',
      confirmText: 'Si, Quitar',
      cancelText: 'Cancelar',
      onCancel: () => closeModal(modalId),
      onClose: () => closeModal(modalId),
      onConfirm: handleDelete,
    })
  }, [openModal, closeModal, handleDelete]);

  const onUpdate = useCallback(() => {
    openModal('update-player-form', {
      id: player.id,
      name: player.name,
      lastname: player.lastname,
      gender: player.gender,
      number: team.personHasTeam?.number,
      user: player.user,
    });
  }, [openModal, player, team]);

  return (
    <Table.BodyRow columns={columns}>
      <Table.BodyCell>
        <Avatar
          size="sm"
          src={player.photo}
          firstName={player.name}
          lastName={player.lastname}
        />
      </Table.BodyCell>
      <Table.BodyCell>
        <ShirtIcon
          width={50}
          height={50}
          neckColor="#B8E4FF"
          shirtColor="#fff"
          shieldColor="#FF5576"
          bordersColor="#444B54"
        />
        <Number>
          {team.personHasTeam?.number}
        </Number>
      </Table.BodyCell>
      <Table.BodyCell>
        <Text>
          {player.name} {player.lastname}
        </Text>
      </Table.BodyCell>
      <Table.BodyCell>
        <Link>
          {player.user?.username}
        </Link>
      </Table.BodyCell>
      <Table.BodyCell>
        <Dropdown defaultOpen={false}>
          <Dropdown.Head>
            <Icon name="More" color="GRAY_40" />
          </Dropdown.Head>
          <Dropdown.Body>
            <Menu>
              <Menu.Item onClick={onUpdate}>
                Editar
              </Menu.Item>
              <Menu.Item onClick={onDelete}>
                <Text color="DANGER">Dar de baja</Text>
              </Menu.Item>
            </Menu>
          </Dropdown.Body>
        </Dropdown>
      </Table.BodyCell>
    </Table.BodyRow>
  )
}

type Props = {
  player: Player,
  columns: string,
  onMutation: () => void
}

export default PlayerRow;