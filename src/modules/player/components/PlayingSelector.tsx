import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Dialog, Button, Card, Icon, Row, Text, Loader, NoData, useModal, styled } from '@8base/boost';
import { fetchPlayersInGame } from '../../game/game-actions';
import axios, { CancelTokenSource } from 'axios';
import { Person as Player } from '../../../shared/types';

const Option = styled(Card.Section)`
  cursor: pointer;

  &:hover {
    background-color: #E8EFF5;
  }
`;

const Body = styled(Card.Body)`
  height: 300px;
  max-height: 300px;
`;

export const PlayingSelector: React.FC<Props> = (props) => {
  const { isOpen, closeModal, openModal, args } = useModal(`${props.id}-playing-selector`);
  const cancelToken = useRef<CancelTokenSource>();
  const [selected, setSelected] = useState<Player | null>(null);
  const [players, setPlayers] = useState<{ items: Array<Player>, count: number, loading: boolean }>({
    items: [],
    count: 0,
    loading: true
  });

  const fetch = useCallback(async () => {
    cancelToken.current = axios.CancelToken.source();

    setSelected(null);
    setPlayers(state => ({...state, loading: true }));

    const [error, canceled, data] = await fetchPlayersInGame(
      args.gameId as number, 
      args.teamId as number, 
      '',
      cancelToken.current
    );

    if (canceled)
      return;

    if (error) {
      return setPlayers(state => ({...state, loading: false, items: [] }));
    }

    setPlayers({
      loading: false,
      items: data? data.items : [],
      count: data? data.count : 0,
    })

  }, [args])

  useEffect(() => {
    if (isOpen) {
      fetch();
  
      return () => cancelToken.current?.cancel();
    } else {
      setSelected(null);
    }
  }, [isOpen, args, fetch]);

  
  const close = useCallback(() => closeModal(`${props.id}-playing-selector`), [closeModal, props.id]);
  
  const open = useCallback((gameId: number, teamId: number) => openModal(`${props.id}-playing-selector`, { gameId, teamId }), [openModal, props.id]);
  
  const handleSelect = useCallback(() => {
    props.onSelect(selected as Player);

    close();
  }, [props, selected, close]);

  let content = null;

  if (players.loading) {
    content = (
      <Row stretch alignItems="center" justifyContent="center">
        <Loader size="sm" />
      </Row>
    )
  }

  if (!players.loading && players.items.length === 0) {
    content = <NoData />;  
  }

  if (!players.loading && players.items.length > 0) {
    content = players.items.map(person => (
      <Option
        key={person.id} 
        stretch 
        padding="sm" 
        onClick={() => setSelected(person)}
      >
        <Row alignItems="center" justifyContent="start">
          {person.id === selected?.id && 
            <Icon name="Check" color="PRIMARY" />
          }
          <Text>
            {person.name} {person.lastname}
          </Text>
        </Row>
      </Option>
    ));
  }

  return (
    <>
      {props.children(open)}
      <Dialog size="md" isOpen={isOpen} onClose={close}>
        <Dialog.Header title="Elegir jugador" onClose={close}/>
        <Body padding="none" scrollable>
          {content}
        </Body>
        <Dialog.Footer>
          <Row stretch alignItems="center" justifyContent="end">
            <Button color="neutral" onClick={close}>Cancel</Button>
            <Button
              disabled={players.loading || !selected}
              color="primary" 
              onClick={handleSelect}
            >
              Seleccionar
            </Button>
          </Row>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

type Props = {
  id: string,
  onSelect: (player: Player) => void,
  children: (open: (gameId: number, teamId: number) => void) => React.ReactNode
}