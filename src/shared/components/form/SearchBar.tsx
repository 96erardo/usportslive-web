import React, { useCallback, useRef, useState } from 'react';
import { Input, ButtonGroup as BoostButtonGroup, Icon, Button, Card as BoostCard, Row, Link, COLORS, styled } from '@8base/boost';
import { Heading } from '../globals'
import { search } from '../../../modules/app/app-actions';
import { onError } from '../../mixins';
import { SearchResults } from '../../types';
import { Column } from '../globals';
import { PlayerSearchItem } from '../../../modules/app/components/PlayerSearchItem';
import { GameSearchItem } from '../../../modules/app/components/GameSearchItem';
import { TeamSearchItem } from '../../../modules/app/components/TeamSearchItem';
import { CompetitionSearchItem } from '../../../modules/app/components/CompetitionSearchItem';
import axios, { CancelTokenSource } from 'axios';
import { useHistory } from 'react-router-dom';
import qs from 'qs';

const ButtonGroup = styled(BoostButtonGroup)`
  width: 100%;

  & > div > input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right-width: 0px;
  }

  & > div > input:focus {
    border-color: ${COLORS.GRAY};
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
  ${(props: { visible: boolean }) => props.visible && ``}
`;

const initialState: SearchResults = {
  games: [],
  competitions: { count: 0, items: [] },
  players: { count: 0, items: [] },
  teams: { count: 0, items: [] },
}

export const SearchBar: React.FC =  () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocus] = useState(false);
  const [{ games, players, teams, competitions }, setResults] = useState<SearchResults>(initialState);
  const timeout = useRef<number>();
  const token = useRef<CancelTokenSource>();
  const history = useHistory();

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

  const onFocus = useCallback(() => {
    setFocus(true);
  }, []);
  
  const onClose = useCallback(() => {
    setFocus(false);
    setText('');
  }, []);

  const onCompleteSearch = useCallback(() => {
    history.push(`/search?${qs.stringify({ q: text }, { encode: false, arrayFormat: 'brackets' })}`);

    onClose();
  }, [text, history, onClose]);

  const count = games.length + competitions.count + players.count + teams.count;

  return (
    <div style={{ width: '50%', position: 'relative', overflow: 'visible' }}>
      <ButtonGroup>
        <Input
          stretch
          name="text"
          value={text}
          onChange={handleChange}
          placeholder="Buscar"
          onFocus={onFocus}
        />
        <Button 
          squared 
          color="neutral" 
          size="sm" 
          loading={loading}
          onClick={onClose}
        >
          {focused && !loading && text !== "" &&
            <Icon name="Delete" />
          }
        </Button>
      </ButtonGroup>
      {focused && !loading && text !== "" && 
        <Card>
          <BoostCard.Body padding="none">
            <Column className="w-100" alignItems="start" gap="none">
              {players.count > 0 && (
                <>
                  <Heading className="p-3 w-100" type="h4" align="left">
                    <span role="img" aria-label="running">🏃</span> Perfiles
                  </Heading>
                  {players.items.map(player => (
                    <PlayerSearchItem 
                      key={player.id} 
                      player={player} 
                      closeModal={onClose}
                    />
                  ))}
                </>
              )}
              {games.length > 0 && (
                <>
                  <Heading className="p-3 w-100" type="h4" align="left">
                    <span role="img" aria-label="alien-game">👾</span> Juegos
                  </Heading>
                  {games.map(game => (
                    <GameSearchItem 
                      key={game.id} 
                      game={game}
                      closeModal={onClose}
                    />
                  ))}
                </>
              )}
              {teams.count > 0 && (
                <>
                  <Heading className="p-3 w-100" type="h4" align="left">
                    <span role="img" aria-label="shield">🛡</span> Equipos
                  </Heading>
                  {teams.items.map(team => (
                    <TeamSearchItem 
                      key={team.id} 
                      team={team}
                      closeModal={onClose}
                    />
                  ))}
                </>
              )}
              {competitions.count > 0 && (
                <>
                  <Heading className="p-3 w-100" type="h4" align="left">
                    <span role="img" aria-label="trophy">🏆</span> Torneos
                  </Heading>
                  {competitions.items.map(competition => (
                    <CompetitionSearchItem 
                      key={competition.id}
                      competition={competition}
                      closeModal={onClose}
                    />
                  ))}
                </>
              )}
              {!loading && count === 0 && (
                <Row className="w-100 py-4" alignItems="center" justifyContent="center">
                  <Heading type="h3" weight="800" color={COLORS.GRAY_50}>
                    No se encontraron coincidencias
                  </Heading>
                </Row>
              )}              
              {!loading && count > 0 && (
                <Row className="w-100 py-3 px-5" alignItems="center" justifyContent="end">
                  <Link onClick={onCompleteSearch}>
                    Ver más...
                  </Link>
                </Row>
              )}
            </Column>
          </BoostCard.Body>
        </Card>
      }
    </div>
  );
}