import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Dialog, Button, Card, Icon, Row, Text, Avatar, Loader, NoData, useModal, styled } from '@8base/boost';
import { fetchPersons } from '../person-actions';
import SearchInput from '../../../shared/components/form/SearchInput';
import axios, { CancelTokenSource } from 'axios';
import { Person } from '../../../shared/types';

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

const PersonSelector: React.FC<Props> = (props) => {
  const { isOpen, closeModal, openModal } = useModal(`${props.id}-person-selector`);
  const cancelToken = useRef<CancelTokenSource>();
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<Person | null>(null);
  const [persons, setPersons] = useState<{ items: Array<Person>, count: number, loading: boolean }>({
    items: [],
    count: 0,
    loading: true
  });

  const fetch = useCallback(async () => {
    cancelToken.current = axios.CancelToken.source();

    setSelected(null);
    setPersons(state => ({...state, loading: true }));

    const [error, canceled, data] = await fetchPersons(1, ['avatar'], { q: search });

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

  }, [search])

  useEffect(() => {
    if (isOpen) {
      fetch();
  
      return () => cancelToken.current?.cancel();
    } else {
      setSelected(null);
    }
  }, [isOpen, fetch]);

  
  const close = useCallback(() => closeModal(`${props.id}-person-selector`), [closeModal, props.id]);
  
  const open = useCallback(() => openModal(`${props.id}-person-selector`), [openModal, props.id]);
  
  const handleSelect = useCallback(() => {
    props.onSelect(selected as Person);

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
            {person.name}
          </Text>
        </Row>
      </Option>
    ));
  }

  return (
    <div style={{ width: '100%' }}>
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
    </div>
  );
}

type Props = {
  id: string,
  onSelect: (sport: Person) => void,
  children: (open: () => void) => React.ReactNode
}

export default PersonSelector;