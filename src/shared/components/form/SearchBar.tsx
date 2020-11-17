import React, { useCallback, useRef, useState } from 'react';
import { Input, ButtonGroup as BoostButtonGroup, Button, Card as BoostCard, styled } from '@8base/boost';
import { Heading } from '../globals'
import { search } from '../../../modules/app/app-actions';
import axios, { CancelTokenSource } from 'axios';
import { onError } from '../../mixins';
import { SearchResults } from '../../types';
import { Column } from '../globals';
import { PlayerSearchItem } from '../../../modules/app/components/PlayerSearchItem';
import { GameSearchItem } from '../../../modules/app/components/GameSearchItem';
import { TeamSearchItem } from '../../../modules/app/components/TeamSearchItem';
import { CompetitionSearchItem } from '../../../modules/app/components/CompetitionSearchItem';

const ButtonGroup = styled(BoostButtonGroup)`
  width: 100%;

  & > div > input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right-color: transparent;
  }

  & > button {  
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border-left-width: 0px;
  }
`;

const Card = styled(BoostCard)`
  position: fixed;
  top: 60px;
  width: inherit;
`;

export const SearchBar: React.FC =  () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>();
  const timeout = useRef<number>();
  const token = useRef<CancelTokenSource>();

  const fetch = useCallback(async (value: string) => {
    token.current?.cancel();

    token.current = axios.CancelToken.source();

    const [err, canceled, data] = await search(value, token.current);

    if (canceled)
      return;

    setLoading(false);

    if (err) {
      return onError(err);
    }

    if (data) {
      setResults(data);
    }
  }, []);

  const handleChange = useCallback((value: string) => {
    clearInterval(timeout.current);

    setText(value);

    if (value !== '') {
      setLoading(true);

      timeout.current = window.setTimeout(() => fetch(value), 350);
    }
  }, [fetch]);
  

  return (
    <div style={{ width: '50%', position: 'relative', overflow: 'visible' }}>
      <ButtonGroup>
        <Input
          stretch
          name="text"
          value={text}
          onChange={handleChange}
          placeholder="Buscar"
        />
        <Button squared color="neutral" size="sm" loading={loading} />
      </ButtonGroup>
      <Card>
        <BoostCard.Body padding="none">
          <Column className="w-100" alignItems="start" gap="none">
            {results && results.teams.count > 0 && (
              <>
                <Heading className="p-3 w-100" type="h4" align="left">
                  <span role="img" aria-label="running">🏃</span> Perfiles
                </Heading>
                {results.players.items.map(player => (
                  <PlayerSearchItem key={player.id} player={player} />
                ))}
              </>
            )}
            {results && results.games.length > 0 && (
              <>
                <Heading className="p-3 w-100" type="h4" align="left">
                  <span role="img" aria-label="alien-game">👾</span> Juegos
                </Heading>
                {results.games.map(game => (
                  <GameSearchItem key={game.id} game={game} />
                ))}
              </>
            )}
            {results && results.teams.count > 0 && (
              <>
                <Heading className="p-3 w-100" type="h4" align="left">
                  <span role="img" aria-label="shield">🛡</span> Equipos
                </Heading>
                {results.teams.items.map(team => (
                  <TeamSearchItem key={team.id} team={team} />
                ))}
              </>
            )}
            {results && results.competitions.count > 0 && (
              <>
                <Heading className="p-3 w-100" type="h4" align="left">
                  <span role="img" aria-label="trophy">🏆</span> Torneos
                </Heading>
                {results.competitions.items.map(competition => (
                  <CompetitionSearchItem key={competition.id} competition={competition} />
                ))}
              </>
            )}
          </Column>
        </BoostCard.Body>
      </Card>
    </div>
  );
}

type Props = {

}