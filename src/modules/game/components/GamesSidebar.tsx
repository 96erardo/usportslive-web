import React, { useState, useEffect, useCallback } from 'react';
import { Loader, COLORS } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import { Heading } from '../../../shared/components/globals';
import { GameSidebarItem } from './GameSidebarItem';
import { Game } from '../../../shared/types';
import moment, { unitOfTime, DurationInputArg2 } from 'moment';
import { fetchGames } from '../game-actions';
import axios, { CancelTokenSource } from 'axios';

export const GamesSidebar: React.FC<Props> = ({ title, startOf, endOf, manipulate }) => {
  const [games, setGames] = useState<{ loading: boolean, items: Array<Game> }>({ loading: true, items: [] });

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    let start = moment();
    let end = moment();

    if (manipulate) {
      start = start[manipulate.type](manipulate.amount, manipulate.time);
      end = end[manipulate.type](manipulate.amount, manipulate.time);
    }

    start = start.startOf(startOf);
    end = end.endOf(endOf);

    const [, canceled, data] = await fetchGames(1, ['points', 'local', 'visitor', 'local.logo', 'visitor.logo'], {
      isAfter: start.toISOString(),
      isBefore: end.toISOString(),
      local: { ne: null },
      visitor: { ne: null }
    }, source, 'date_ASC');

    if (canceled)
      return;

    if (data) {
      setGames(state => ({
        ...state,
        loading: false,
        items: data.items,
      }))
    }
  }, [startOf, endOf, manipulate]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source);
    
    return () => source.cancel();
  }, [fetch]);

  if (!games.loading && games.items.length === 0)
    return null;

  return (
    <Paper className="w-100 py-3" background={COLORS.BLACK}>
      <div className="px-4 mb-3">
        <Heading type="h2" fontWeight="600" color="#fff">
          {title}
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

export type Props = {
  title: string,
  startOf: unitOfTime.StartOf,
  endOf: unitOfTime.StartOf,
  manipulate?: { 
    type: 'add' | 'subtract',
    amount: number,
    time: DurationInputArg2
  } | null,
}