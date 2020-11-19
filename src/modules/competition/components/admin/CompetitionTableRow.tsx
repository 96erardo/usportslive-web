import React, { useCallback, useMemo } from 'react';
import { Table, Dropdown, Icon, Menu, Text, Tag, useModal } from '@8base/boost';
import { useHistory } from 'react-router';
import { Competition, CompetitionStatus } from '../../../../shared/types';
import { DATE_FORMAT } from '../../../../shared/constants';
import { deleteCompetition, updateCompetitionStatus } from '../../competition-actions';
import { modalId } from '../../../../shared/components/globals/DecisionDialog';
import { COMPETITION_STATUS as STATUS } from '../../../../shared/constants';
import { onError } from '../../../../shared/mixins';
import moment from 'moment';
import { toast } from 'react-toastify';

const CompetitionTableRow: React.FC<Props> = ({ columns, competition, afterMutation }) => {
  const { openModal, closeModal } = useModal(modalId);
  const history = useHistory();
  
  const status = useMemo<Array<CompetitionStatus>>(() => {
    return Object.keys(STATUS).filter(value => value !== competition.status) as Array<CompetitionStatus>
  }, [competition.status]);

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
  }, [handleDelete, openModal, closeModal]);

  const onStatusChange = useCallback(async (value: CompetitionStatus) => {
    const [err] = await updateCompetitionStatus(competition.id, value);

    if (err) {
      return onError(err);
    }

    afterMutation();

    toast.success('Status actualizado correctamente');
  }, [competition, afterMutation]);
  
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
        <Dropdown defaultOpen={false}>
          <Dropdown.Head>
            <Tag color={STATUS[competition.status].color}>
              {STATUS[competition.status].label}
            </Tag>
          </Dropdown.Head>
          <Dropdown.Body>
            <Menu>
              {status.map((value) => (
                <Menu.Item key={value} onClick={() => onStatusChange(value)}>
                  {STATUS[value].label}
                </Menu.Item>
              ))}
            </Menu>
          </Dropdown.Body>
        </Dropdown>
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