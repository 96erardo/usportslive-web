import React, { useCallback } from 'react';
import { Row, COLORS, styled } from '@8base/boost';
import { Avatar, Heading } from '../../../shared/components/globals';
import { Game } from '../../../shared/types';
import { useHistory } from 'react-router-dom';

const Item = styled.div`
  background: ${(props: { index: number }) => props.index % 2 === 0 ? 'transparent;' : `${COLORS.GRAY_70};`}
  cursor: pointer;
`;

export const GameItem: React.FC<Props> = ({ game, index }) => {
  const history = useHistory();
  const { local, visitor } = game;

  const onClick = useCallback(() => {
    history.push(`/game/${game.id}`);
  }, [history, game]);

  return (
    <Item 
      index={index}
      className="w-100 p-3 list-item" 
      onClick={onClick}
    >
      <Row className="w-100" alignItems="center" justifyContent="center" gap="lg">
        <Avatar 
          size="sm"
          src={local?.logo?.smallUrl}
          firstName={local?.name}
          lastName={local?.name[1]}
        />
        <Heading type="h4" weight="bold" color="#fff">
          VS
        </Heading>
        <Avatar 
          size="sm"
          src={visitor?.logo?.smallUrl}
          firstName={visitor?.name}
          lastName={visitor?.name[1]}
        />
      </Row>
    </Item>
  );
}

type Props = {
  index: number,
  game: Game
}