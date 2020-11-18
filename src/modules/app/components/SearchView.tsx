import React from 'react';
import { Column } from '@8base/boost';
import { Heading } from '../../../shared/components/globals';
import { GameSearchResults } from '../../game/components/GameSearchResults';
import { TeamSearchResults } from '../../team/components/TeamSearchResults';
import { PlayerSearchResults } from '../../player/components/PlayerSearchResults';
import { CompetitionSearchResults } from '../../competition/components/CompetitionSearchResults';
import { useQuery } from '../../../shared/hooks';

export const SearchView: React.FC = () => {
  const [query] = useQuery();

  return (
    <div className="container mt-5">
      <Heading type="h1" fontWeight="900">
        <span role="img" aria-label="alien-game">🔎</span> Resultados de búsqueda "{query.q}"
      </Heading>
      <div className="row my-5">
        <div className="col-md-12">
          <Column stretch gap="lg">
            <GameSearchResults />
            <TeamSearchResults />
            <PlayerSearchResults />
            <CompetitionSearchResults />
          </Column>
        </div>
      </div>
    </div>
  );
}