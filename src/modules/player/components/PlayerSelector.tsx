import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Avatar, Dialog, Button, Card, Icon, Row, Text, Loader, NoData, useModal, styled } from '@8base/boost';
import { fetchTeamPlayers } from '../player-actions';
import SearchInput from '../../../shared/components/form/SearchInput';
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

const PlayerSelector: React.FC<Props> = (props) => {
  const { isOpen, closeModal, openModal, args } = useModal(`${props.id}-player-selector`);
  const cancelToken = useRef<CancelTokenSource>();
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<Player | null>(null);
  const [persons, setPersons] = useState<{ items: Array<Player>, count: number, loading: boolean }>({
    items: [],
    count: 0,
    loading: true
  });

  const fetch = useCallback(async () => {
    cancelToken.current = axios.CancelToken.source();

    setSelected(null);
    setPersons(state => ({...state, loading: true }));

    const [error, canceled, data] = await fetchTeamPlayers(args.id as number, 1, ['avatar'], { q: search });

    if (canceled)
      return;

    if (error) {
      return setPersons(state => ({...state, loading: false, items: [] }));
    }

    setPersons({
      loading: false,
      items: data? data.items : [],
      count: data? data.count : 0,
    })

  }, [args, search])

  useEffect(() => {
    if (isOpen) {
      fetch();
  
      return () => cancelToken.current?.cancel();
    } else {
      setSelected(null);
    }
  }, [isOpen, args, fetch]);

  
  const close = useCallback(() => closeModal(`${props.id}-player-selector`), [closeModal, props.id]);
  
  const open = useCallback((id: number) => openModal(`${props.id}-player-selector`, { id }), [openModal, props.id]);
  
  const handleSelect = useCallback(() => {
    props.onSelect(selected as Player);

    close();
  }, [props, selected, close]);

  let content = null;

  if (persons.loading) {
    content = (
      <Row stretch alignItems="center" justifyContent="center">
        <Loader size="sm" />
      </Row>
    )
  }

  if (!persons.loading && persons.items.length === 0) {
    content = <NoData />;  
  }

  if (!persons.loading && persons.items.length > 0) {
    content = persons.items.map(person => (
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
          <Avatar 
            size="sm"
            src={person.avatar?.smallUrl}
            firstName={person.name}
            lastName={person.lastname}
          />
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
        <Card.Section>
          <SearchInput 
            stretch
            placeholder="Busca por el nombre del jugador"
            onSearch={setSearch}
          />
        </Card.Section>
        <Body padding="none" scrollable>
          {content}
        </Body>
        <Dialog.Footer>
          <Row stretch alignItems="center" justifyContent="end">
            <Button color="neutral" onClick={close}>Cancel</Button>
            <Button
              disabled={persons.loading || !selected}
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
  children: (open: (id: number) => void) => React.ReactNode
}

export default PlayerSelector;