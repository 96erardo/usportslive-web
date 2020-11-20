import React, { useCallback, useState } from 'react';
import { Row, Link, Loader, COLORS } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import { Heading } from '../../../shared/components/globals';
import { useAppStore } from '../../app/app-store';
import { SportSidebarItem } from './SportSidebarItem';
import { useSports } from '../sport-hooks';

const include = ['icon'];

export const SportsSidebar: React.FC<Props> = ({ selected, onSelect }) => {
  const [page, setPage] = useState(1);
  const items = useAppStore(state => state.sports);
  const state = useSports(page, include);

  const sports = state.items || items;

  const next = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  return (
    <Paper className="w-100 py-3" background={COLORS.GRAY_70}>
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
            selected={selected}
            onSelect={onSelect}
          />
        ))}
        {state.loading && state.items.length > 0 &&
          <Row className="w-100 py-2" justifyContent="center">
            <Loader size="sm" color="PRIMARY" />
          </Row>
        }
        {!state.loading && state.items.length < state.count &&
          <Row className="w-100" justifyContent="center">
            <Link onClick={next}>Cargar más</Link>
          </Row>
        }
      </div>
    </Paper>
  );
}

type Props = {
  selected?: number,
  onSelect?: (id: number) => void,
}