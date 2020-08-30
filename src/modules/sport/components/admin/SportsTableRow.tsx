import React, { useCallback } from 'react';
import { Table, Text, Button, Row, Dropdown, Menu, Icon, useModal, styled } from '@8base/boost';
import { Sport } from '../../../../shared/types';

const ColorPreview = styled.span`
  background-color: ${(props: any) => props.color};
  width: 10px;
  height: 10px;
  border-radius: 100%;
`;

function SportsTableRow ({ columns, sport }: Props) {
  const { openModal } = useModal('update-sport-dialog');

  const onUpdate = useCallback(() => {
    openModal('update-sport-dialog', {
      id: sport.id,
      name: sport.name,
      color: sport.color,
      team: sport.team
    })
  }, [sport, openModal]);

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
      <Table.BodyCell>
        {sport.team ? sport.team.name : (
          <Button color="primary" variant="link">
            Asignar
          </Button>
        )}
      </Table.BodyCell>
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
}

export default SportsTableRow;