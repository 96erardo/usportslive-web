import React, { useState, useEffect, useCallback } from 'react';
import { Row, Loader } from '@8base/boost';
import { useParams } from 'react-router-dom';
import { Person } from '../../../shared/types';
import { fetchPersonByIdOrUser } from '../../person/person-actions';
import { PersonCard } from '../../person/components/PersonCard';
import { PlayerSports } from './PlayerSports';
import axios, { CancelTokenSource } from 'axios';

export const PlayerView: React.FC = () => {
  const [player, setPlayer] = useState<State>({ loading: true, person: null, error: null });
  const { id } = useParams<{ id: string }>();

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    const [err, canceled, data] = await fetchPersonByIdOrUser(id, ['user', 'avatar'], source);

    if (canceled)
      return;

    if (err) {
      return setPlayer(state => ({
        ...state,
        person: null,
        loading: false,
        error: err
      }))
    }

    if (data) {
      return setPlayer(state => ({
        ...state,
        person: data.person,
        loading: false,
        error: null
      }));
    }
  }, [id]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    
    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  if (player.loading) {
    return (
      <Row stretch className="mt-5" justifyContent="center">
        <Loader color="DANGER" size="md" />
      </Row>
    )
  }

  if (player.person === null) {
    return null;
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-md-3">
          <PersonCard 
            person={player.person}
            onChange={fetch}
          />
        </div>
        <div className="col-md-9">
          <PlayerSports playerId={player.person.id} />
        </div>
      </div>
    </div>
  );
}

type State = {
  loading: boolean,
  person: Person | null,
  error: Error | null,
}