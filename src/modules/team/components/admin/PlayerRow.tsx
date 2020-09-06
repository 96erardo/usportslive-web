import React from 'react';
import { Table, Text, Avatar, Icon, Dropdown, Menu, styled } from '@8base/boost';
import { Person as Player } from '../../../../shared/types';
import ShirtIcon from '../../../../shared/components/icons/ShirtIcon';

const Number = styled(Text)`
  font-family: 'Roboto Slab', sans-serif;
  font-size: 2rem;
`;

const PlayerRow: React.FC<Props> = ({ player, columns }) => {
  const [team] = player.teams ? player.teams : [];

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
        <Dropdown defaultOpen={false}>
          <Dropdown.Head>
            <Icon name="More" color="GRAY_40" />
          </Dropdown.Head>
          <Dropdown.Body>
            <Menu>
              <Menu.Item>
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
  )
}

type Props = {
  player: Player,
  columns: string
}

export default PlayerRow;