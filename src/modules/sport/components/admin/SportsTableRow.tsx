import React, { useState, useCallback } from 'react';
import { Table, Text, Button, Row, Dropdown, Menu, Icon, Loader, useModal, styled } from '@8base/boost';
import TeamSelector from '../../../team/components/TeamSelector';
import { Sport, Team } from '../../../../shared/types';
import { assignTeamToSport } from '../../sport-actions';
import { onError } from '../../../../shared/mixins';
import { toast } from 'react-toastify';

const ColorPreview = styled.span`
  background-color: ${(props: any) => props.color};
  width: 10px;
  height: 10px;
  border-radius: 100%;
`;

function SportsTableRow ({ columns, sport, afterUpdate }: Props) {
  const { openModal } = useModal('update-sport-dialog');
  const [loading, setLoading] = useState(false);

  const onUpdate = useCallback(() => {
    openModal('update-sport-dialog', {
      id: sport.id,
      name: sport.name,
      color: sport.color,
      team: sport.team
    })
  }, [sport, openModal]);

  const updateAssignedTeam = useCallback(async (team: Team) => {
    setLoading(true);

    const [err, data] = await assignTeamToSport(sport.id, team.id);

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success('Equipo asignado correctamente');

    afterUpdate();
  }, [sport])

  return (
    <Table.BodyRow columns={columns}>
      <Table.BodyCell>{sport.id}</Table.BodyCell>
      <Table.BodyCell>{sport.name}</Table.BodyCell>
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
      <Table.BodyCell>{sport.createdAt}</Table.BodyCell>
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
  sport: Sport,
  columns: string,
  afterUpdate: () => void
}

export default SportsTableRow;