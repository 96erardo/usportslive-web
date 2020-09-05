import React from 'react';
import { Card as BoostCard, Row, Avatar as BoostAvatar, Column, Text, styled } from '@8base/boost';
import { Person as Player } from '../../../shared/types';

const Card = styled(BoostCard)`
  border-radius: 0px;
  position: relative;
  background-color: transparent !important;
  box-shadow: none;
`;

const Avatar = styled(BoostAvatar)`
  z-index: 2;
`

const Number = styled(Text)`
  font-family: 'Roboto Slab', sans-serif;
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 135px;
  opacity: 0.2;
  z-index: 1;
`;

const UserName = styled(Text)`
  z-index: 2;
`;

export default function PlayerCard ({ player }: Props): React.ReactElement {
  const [team] = player.teams ? player.teams : [];
  
  return (
    <Card stretch>
      <BoostCard.Body padding="md">
        <Column stretch alignItems="center">
          <div>
            <Avatar 
              size="lg"
              src={player.photo} 
              firstName={player.name} 
              lastName={player.lastname} 
            />
          </div>
          <Column stretch gap="none" alignItems="center">
            <Text align="center" ellipsis>{player.name} {player.lastname}</Text>
            {player.user &&
              <UserName color="GRAY_60" weight="bold" cursor="pointer">@{player.user.username}</UserName>
            }
            {team.personHasTeam && (
              <Number>{team.personHasTeam.number}</Number>
            )}
          </Column>
        </Column>
      </BoostCard.Body>
    </Card>
  );
}

type Props = {
  player: Player
};