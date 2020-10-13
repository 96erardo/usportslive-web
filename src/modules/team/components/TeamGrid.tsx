import React, { useEffect, useState } from 'react';
import { Avatar, Card, Table, Text, Row, COLORS, styled }  from '@8base/boost';
import { useTeamPlayers } from '../../player/player-hooks';
import PlayerCard from '../../player/components/PlayerCard';
import { FluentItem } from '../../../shared/components/layouts/FluentItem';
import ShirtIcon from '../../../shared/components/icons/ShirtIcon';
 
// const Card = styled(BoostCard)`
//   background-color: ${COLORS.GRAY_60};
//   color: #fff;
//   min-height: 400px;
// `;

const Number = styled(Text)`
  font-family: 'Roboto Slab', sans-serif;
  font-size: 1.5rem
`;
 
const include = ['user'];

export default function TeamGrid (props: Props) {
  const [page, setPage] = useState(1);
  const { items, count, loading } = useTeamPlayers(props.id, page, include);

  return (
    <Card stretch>
      <Card.Body padding="none">
        {items.map(player => {
          const [team] = player.teams ? player.teams : [];

          return (
            <Table.BodyRow  columns="125px 1fr">
              <Table.BodyCell >
                  <ShirtIcon 
                    width={50}
                    height={50}
                    neckColor="#B8E4FF"
                    shirtColor="#fff"
                    shieldColor="#FF5576"
                    bordersColor="#444B54"
                  />
                  <Number color="GRAY_60" weight="bold">
                    {team.personHasTeam?.number}
                  </Number>
              </Table.BodyCell>
              <Table.BodyCell>
                <Text color="GRAY_50" weight="semibold">
                  {player.name} {player.lastname}
                </Text>
              </Table.BodyCell>
            </Table.BodyRow>
          )
        })}
      </Card.Body>
    </Card>
  );
}

type Props = {
  id: number
}