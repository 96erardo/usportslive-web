import React from 'react';
import { Row, COLORS, styled } from '@8base/boost';
import { Avatar, Heading } from '../../../shared/components/globals';
import { Team } from '../../../shared/types';

const Item = styled.div`
  background: ${(props: { index: number }) => props.index % 2 === 0 ? 'transparent;' : `${COLORS.GRAY_70};`}
`;

export const TeamItem: React.FC<Props> = ({ team, index }) => {
  return (
    <Item className="w-100 p-3" index={index}>
      <Row className="w-100" alignItems="center" justifyContent="start" gap="md">
        <Avatar 
          size="sm"
          src={team.logo?.smallUrl}
          firstName={team.name}
          lastName={team.name[1]}
        />
        <Heading type="h5" weight="bold" color="#fff">
          {team.name}
        </Heading>
      </Row>
    </Item>
  );
}

type Props = {
  team: Team,
  index: number
}