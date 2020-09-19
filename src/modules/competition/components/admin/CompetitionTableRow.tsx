import React, { useCallback } from 'react';
import { Table, Dropdown, Icon, Menu, Text, useModal } from '@8base/boost';
import { useHistory } from 'react-router';
import { Competition } from '../../../../shared/types';
import { DATE_FORMAT } from '../../../../shared/constants';
import { deleteCompetition } from '../../competition-actions';
import { modalId } from '../../../../shared/components/globals/DecisionDialog';
import { onError } from '../../../../shared/mixins';
import moment from 'moment';
import { toast } from 'react-toastify';


const CompetitionTableRow: React.FC<Props> = ({ columns, competition, afterMutation }) => {
  const { openModal, closeModal } = useModal(modalId);
  const history = useHistory();

  const onUpdate = useCallback(() => {
    history.push(`/admin/competition/${competition.id}`);
  }, [competition, history]);

  const handleDelete = useCallback(async () => {
    const [err] = await deleteCompetition(competition.id);

    closeModal(modalId);

    if (err) {
      return onError(err);
    }

    afterMutation();

    toast.success('Torneo eliminado correctamente');   
  }, [competition, closeModal, afterMutation]);

  const onDeleteClick = useCallback(() => {
    openModal(modalId, {
      title: 'Eliminar torneo',
      text: 'Está seguro de que desea eliminar el torneo ?',
      confirmText: 'Si, Sacar',
      cancelText: 'Cancelar',
      onClose: () => closeModal(modalId),
      onCancel: () => closeModal(modalId),
      onConfirm: handleDelete
    });
  }, [handleDelete, closeModal]);
  
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
              <Menu.Item onClick={onDeleteClick}>
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
  competition: Competition,
  afterMutation: () => Promise<void>
}

export default CompetitionTableRow;