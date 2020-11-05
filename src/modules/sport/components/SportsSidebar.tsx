import React from 'react';
import { COLORS } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import { Heading } from '../../../shared/components/globals';
import { useAppStore } from '../../app/app-store';
import { SportSidebarItem } from './SportSidebarItem';

export const SportsSidebar: React.FC = () => {
  const sports = useAppStore(state => state.sports);

  return (
    <Paper stretch className="py-3" background={COLORS.BLACK}>
      <div className="px-4 mb-3">
        <Heading type="h2" fontWeight="600" color="#fff">
          Deportes
        </Heading>
      </div>
      <div className="w-100 d-flex flex-column">
        {sports.map(sport => (
          <SportSidebarItem 
            key={sport.id}
            sport={sport} 
          />
        ))}
      </div>
    </Paper>
  );
}