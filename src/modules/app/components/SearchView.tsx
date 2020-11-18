import React from 'react';
import { Column } from '@8base/boost';
import { Heading } from '../../../shared/components/globals';
import { GameSearchResults } from '../../game/components/GameSearchResults';
import { useQuery } from '../../../shared/hooks';

export const SearchView: React.FC = () => {
  const [query] = useQuery();

  return (
    <div className="container mt-5">
      <Heading type="h1" fontWeight="900">
        <span role="img" aria-label="alien-game">🔎</span> Resultados de búsqueda "{query.q}"
      </Heading>
      <div className="row mt-5">
        <div className="col-md-12">
          <Column stretch>
            <GameSearchResults />
          </Column>
        </div>
      </div>
    </div>
  );
}