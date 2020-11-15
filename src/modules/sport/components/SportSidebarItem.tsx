import React, { useCallback } from 'react';
import { COLORS, styled } from '@8base/boost';
import { Sport } from '../../../shared/types';
import { Heading, Avatar } from '../../../shared/components/globals';

const Item = styled.div`
  ${(props: { selected: boolean, color: string }) => props.selected && `
    background: ${COLORS.GRAY_70};
  `}
`;

export const SportSidebarItem: React.FC<Props> = ({ sport, selected, onSelect }) => {
  const onClick = useCallback(() => {
    if (onSelect) {
      onSelect(sport.id);
    }
  }, [sport, onSelect]);

  return (
    <Item
      selected={sport.id === selected}
      className="w-100 d-flex flex-row p-3 align-items-center list-item" 
      onClick={onClick}
    >
      <Avatar 
        size="xs" 
        className="mr-3"
        src={sport.icon?.mediumUrl} 
        firstName={sport.name} 
        lastName={sport.name[1]} 
      />
      <Heading 
        color="#fff" 
        type="h4"
        weight="bold"
      >
        {sport.name}
      </Heading>
    </Item>
  );
}

type Props = {
  sport: Sport,
  selected?: number,
  onSelect?: (id: number) => void,
}