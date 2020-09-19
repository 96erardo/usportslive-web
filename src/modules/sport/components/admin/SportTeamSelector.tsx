import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Dialog, Button, Card, Icon, Row, Text, Loader, NoData, useModal, styled } from '@8base/boost';
import SearchInput from '../../../../shared/components/form/SearchInput';
import { fetchTeams } from '../../../team/team-actions';
import axios, { CancelTokenSource } from 'axios';
import { Team } from '../../../../shared/types';

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

const Container = styled.div`
  ${(props: Props) => props.stretch && 'width: 100%;'}
`;

function SportTeamSelector ({
  id,
  stretch = true,
  onSelect,
  children
}: Props) {
  const { isOpen, args, closeModal, openModal } = useModal(`${id}-sport-team-selector`);
  const cancelToken = useRef<CancelTokenSource>();
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<Team | null>(null);
  const [teams, setTeams] = useState<{ items: Array<Team>, count: number, loading: boolean }>({
    items: [],
    count: 0,
    loading: true
  });

  const fetch = useCallback(async () => {
    cancelToken.current = axios.CancelToken.source();

    setSelected(null);
    setTeams(state => ({...state, loading: true }));

    const [error, canceled, data] = await fetchTeams(1, [], {
      q: search,
      sport: args.sport ? args.sport : undefined
    });

    if (canceled)
      return;

    if (error) {
      return setTeams(state => ({...state, loading: false, items: [] }));
    }

    setTeams({
      loading: false,
      items: data? data.items : [],
      count: data? data.count : 0,
    })

  }, [search, args])

  useEffect(() => {
    if (isOpen) {
      fetch();
  
      return () => cancelToken.current?.cancel();
    } else {
      setSelected(null);
    }
  }, [isOpen, fetch]);

  
  const close = useCallback(() => closeModal(`${id}-sport-team-selector`), [closeModal, id]);
  
  const open = useCallback((args: DialogArgs) => openModal(`${id}-sport-team-selector`, args), [openModal, id]);
  
  const handleSelect = useCallback(() => {
    onSelect(selected as Team);

    close();
  }, [onSelect, selected, close]);

  let content = null;

  if (teams.loading) {
    content = (
      <Row stretch alignItems="center" justifyContent="center">
        <Loader size="sm" />
      </Row>
    )
  }

  if (!teams.loading && teams.items.length === 0) {
    content = <NoData />;  
  }

  if (!teams.loading && teams.items.length > 0) {
    content = teams.items.map(team => (
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
    <Container stretch={stretch}>
      {children(open)}
      <Dialog size="md" isOpen={isOpen} onClose={close}>
        <Dialog.Header title="Elegir equipo" onClose={close}/>
        <Card.Section>
          <SearchInput 
            stretch
            placeholder="Search team"
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
              disabled={teams.loading || !selected}
              color="primary" 
              onClick={handleSelect}
            >
              Seleccionar
            </Button>
          </Row>
        </Dialog.Footer>
      </Dialog>
    </Container>
  );
}

type Props = {
  id: string,
  stretch?: boolean,
  onSelect: (team: Team) => void,
  children: (open: (args: DialogArgs) => void) => React.ReactNode,
}

export type DialogArgs = {
  sport?: number,
};

export default SportTeamSelector;