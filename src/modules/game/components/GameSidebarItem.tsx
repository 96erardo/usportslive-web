import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Game } from '../../../shared/types';
import { Heading, Avatar } from '../../../shared/components/globals';

export const GameSidebarItem: React.FC<{ game: Game }> = ({ game }) => {
  const history = useHistory();
  const local = useMemo(() => game.points?.filter(point => point.teamId === game.localId), [game]);
  const visitor = useMemo(() => game.points?.filter(point => point.teamId === game.visitorId), [game]);

  const handleClick = useCallback(() => {
    history.push(`/game/${game.id}`);
  }, [history, game]);

  
  return (
    <div 
      title={`${game.local?.name} vs ${game.visitor?.name}`}
      onClick={handleClick}
      className="w-100 d-flex flex-row p-3 align-items-center justify-content-center list-item"
    >
      <Avatar
        size="sm"
        className="mr-4"
        src={game.local?.logo?.smallUrl}
        firstName={game.local?.name}
        lastName={game.local?.name[1]}
      />
      <Heading type="h3" weight="bold" color="#fff">
        {local?.length} - {visitor?.length}
      </Heading>
      <Avatar
        size="sm"
        className="ml-4"
        src={game.visitor?.logo?.smallUrl}
        firstName={game.visitor?.name}
        lastName={game.visitor?.name[1]}
      />
    </div>
  );
}