import React, { useState, useEffect, useCallback } from 'react';
import { Loader, COLORS } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import { Heading } from '../../../shared/components/globals';
import { GameSidebarItem } from './GameSidebarItem';
import { Game } from '../../../shared/types';
import moment from 'moment';
import { fetchGames } from '../game-actions';

export const GamesSidebar: React.FC = () => {
  const [games, setGames] = useState<{ loading: boolean, items: Array<Game> }>({ loading: true, items: [] });

  const fetch = useCallback(async () => {
    const start = moment().startOf('day').toISOString();
    const end = moment().endOf('day').toISOString();

    const [, canceled, data] = await fetchGames(1, ['points', 'local', 'visitor', 'local.logo', 'visitor.logo'], {
      isAfter: start,
      isBefore: end,
      local: { ne: null },
      visitor: { ne: null }
    });

    if (canceled)
      return;

    if (data) {
      setGames(state => ({
        ...state,
        loading: false,
        items: data.items,
      }))
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (!games.loading && games.items.length === 0)
    return null;

  return (
    <Paper className="w-100 py-3" background={COLORS.BLACK}>
      <div className="px-4 mb-3">
        <Heading type="h2" fontWeight="600" color="#fff">
          Hoy
        </Heading>
      </div>
      {games.loading ? (
        <div className="p-4 d-flex flex-row align-items-center justify-content-center">
          <Loader size="sm" color="WHITE"/>
        </div>
      ) : (
        <div className="d-flex flex-column">
          {games.items.map(game => (
            <GameSidebarItem 
              key={game.id}
              game={game} 
            />
          ))}
        </div>
      )}
    </Paper>
  );
}