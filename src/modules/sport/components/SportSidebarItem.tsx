import React from 'react';
import { Sport } from '../../../shared/types';
import { Heading, Avatar } from '../../../shared/components/globals';

export const SportSidebarItem: React.FC<{ sport: Sport }> = ({ sport }) => {
  return (
    <div className="w-100 d-flex flex-row p-3 align-items-center list-item ">
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
    </div>
  );
}