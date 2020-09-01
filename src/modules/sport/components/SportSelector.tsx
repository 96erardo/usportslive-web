import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Dialog, Button, Card, Icon, Row, Text, Loader, NoData, useModal, styled } from '@8base/boost';
import SearchInput from '../../../shared/components/form/SearchInput';
import { fetchSports } from '../sport-actions';
import axios, { CancelTokenSource } from 'axios';
import { Sport } from '../../../shared/types';

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

function SportSelector (props: Props) {
  const { isOpen, closeModal, openModal } = useModal(`${props.id}-sport-selector`);
  const cancelToken = useRef<CancelTokenSource>();
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<Sport | null>(null);
  const [sports, setSports] = useState<{ items: Array<Sport>, count: number, loading: boolean }>({
    items: [],
    count: 0,
    loading: true
  });

  const fetch = useCallback(async () => {
    cancelToken.current = axios.CancelToken.source();

    setSelected(null);
    setSports(state => ({...state, loading: true }));

    const [error, canceled, data] = await fetchSports(1, [], { q: search });

    if (canceled)
      return;

    if (error) {
      return setSports(state => ({...state, loading: false, items: [] }));
    }

    setSports({
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

  
  const close = useCallback(() => closeModal(`${props.id}-sport-selector`), [closeModal, props.id]);
  
  const open = useCallback(() => openModal(`${props.id}-sport-selector`), [openModal, props.id]);
  
  const handleSelect = useCallback(() => {
    props.onSelect(selected as Sport);

    close();
  }, [props, selected, close]);

  let content = null;

  if (sports.loading) {
    content = (
      <Row stretch alignItems="center" justifyContent="center">
        <Loader size="sm" />
      </Row>
    )
  }

  if (!sports.loading && sports.items.length === 0) {
    content = <NoData />;  
  }

  if (!sports.loading && sports.items.length > 0) {
    content = sports.items.map(team => (
      <Option
        key={team.id} 
        stretch 
        padding="sm" 
        onClick={() => setSelected(team)}
      >
        <Row alignItems="center" justifyContent="start">
          {team.id === selected?.id && 
            <Icon name="Check" color="PRIMARY" />
          }
          <Text>
            {team.name}
          </Text>
        </Row>
      </Option>
    ));
  }

  return (
    <div style={{ width: '100%' }}>
      {props.children(open)}
      <Dialog size="md" isOpen={isOpen} onClose={close}>
        <Dialog.Header title="Elegir deporte" onClose={close}/>
        <Card.Section>
          <SearchInput 
            stretch
            placeholder="Search sport"
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
              disabled={sports.loading || !selected}
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
  onSelect: (sport: Sport) => void,
  children: (open: () => void) => React.ReactNode
}

export default SportSelector;