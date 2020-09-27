import React, { useCallback } from 'react';
import { Row, Text, Icon, styled } from '@8base/boost';
import { Person as Player } from '../../../shared/types';

const Item = styled(Row)`
  padding: 16px;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
`;

const SubstitutionPlayer: React.FC<Props> = ({ player, selected, type, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(player.id);
  }, [player, onClick]);

  return (
    <Item onClick={handleClick} gap="md" alignItems="center" justifyContent="between">
      <Text>
        <Text weight="bold">10</Text> {player.name} {player.lastname}
      </Text>
      {(selected === player.id && type === 'in') &&
        <Icon
          size="md"
          name="ChevronTop"
          color="SUCCESS"
        />
      }
      {(selected === player.id && type === 'out') &&
        <Icon
          size="md"
          name="ChevronDown"
          color="DANGER"
        />
      }
    </Item>
  );
}

type Props = {
  type: 'in' | 'out',
  selected?: number,
  player: Player,
  onClick: (value: number) => void
}

export default SubstitutionPlayer;