import React, { useState, useCallback } from 'react';
import { Table, Text, Button, Row, Dropdown, Menu, Icon, Loader, useModal, styled } from '@8base/boost';
import { Avatar } from '../../../../shared/components/globals';
import TeamSelector from '../../../team/components/TeamSelector';
import { Sport, Team } from '../../../../shared/types';
import { assignTeamToSport, deleteSport } from '../../sport-actions';
import { onError } from '../../../../shared/mixins';
import { modalId as decisionModalId } from '../../../../shared/components/globals/DecisionDialog';
import { } from '../../sport-actions';
import { toast } from 'react-toastify';
import { DATE_TIME_FORMAT } from '../../../../shared/constants';
import moment from 'moment';

const ColorPreview = styled.span`
  background-color: ${(props: any) => props.color};
  width: 10px;
  height: 10px;
  border-radius: 100%;
`;

function SportsTableRow ({ columns, sport, afterUpdate }: Props) {
  const { openModal, closeModal } = useModal('update-sport-dialog');
  const [loading, setLoading] = useState(false);

  const onUpdate = useCallback(() => {
    openModal('update-sport-dialog', {
      id: sport.id,
      name: sport.name,
      color: sport.color,
      team: sport.team,
      icon: sport.icon
    })
  }, [sport, openModal]);

  const confirmDelete = useCallback(async () => {
    const [err] = await deleteSport(sport.id);

    closeModal(decisionModalId)

    if (err) {
      return onError(err)
    };

    toast.success('Deporte eliminado correctament');

    afterUpdate();
  }, [sport, closeModal, afterUpdate]);

  const onDelete = useCallback(() => {
    openModal(decisionModalId, {
      title: 'Eliminar deporte',
      text: 'Está seguro de que desea eliminar este deporte ?',
      confirmText: 'Si, Eliminar',
      cancelText: 'Cancelar',
      onClose: () => closeModal(decisionModalId),
      onCancel: () => closeModal(decisionModalId),
      onConfirm: confirmDelete
    });
  }, [openModal, closeModal, confirmDelete]);

  const updateAssignedTeam = useCallback(async (team: Team) => {
    setLoading(true);

    const [err] = await assignTeamToSport(sport.id, team.id);

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success('Equipo asignado correctamente');

    afterUpdate();
  }, [sport, afterUpdate])

  return (
    <Table.BodyRow columns={columns}>
      <Table.BodyCell>
        <Avatar
          size="sm"
          src={sport.icon?.smallUrl}
          firstName={sport.name[0]}
          lastName={sport.name[1]}
        />
      </Table.BodyCell>
      <Table.BodyCell>
        {sport.name}
      </Table.BodyCell>
      <Table.BodyCell>
        <Row stretch alignItems="center" justifyContent="start">
          <ColorPreview color={sport.color} /> 
          <Text>
            {sport.color}
          </Text>
        </Row>
      </Table.BodyCell>
      {loading ? (
        <Row stretch alignItems="center" justifyContent="center">
          <Loader size="sm" />
        </Row>
      ) : (
        <Table.BodyCell>        
          {sport.team ? sport.team.name : (
            <TeamSelector id={sport.id.toString()} onSelect={updateAssignedTeam}>
              {open => (
                <Button onClick={() => open({ sport: sport.id })} color="primary" variant="link">
                  Asignar
                </Button>
              )}
            </TeamSelector>
          )}
        </Table.BodyCell>
      )}
      <Table.BodyCell>
        {moment(sport.createdAt).format(DATE_TIME_FORMAT)}
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
  sport: Sport,
  columns: string,
  afterUpdate: () => void
}

export default SportsTableRow;