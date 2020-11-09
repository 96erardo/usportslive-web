import React, { useCallback, useEffect, useState } from 'react';
import { Column, Row, Loader } from '@8base/boost';
import { fetchPersonsPlayedSports } from '../../person/person-actions';
import { PlayedSports } from '../../../shared/types';
import axios, { CancelTokenSource } from 'axios';
import { SportPerformance } from '../../sport/components/SportPerformance';
import { onError } from '../../../shared/mixins';

export const PlayerSports: React.FC<Props> = ({ playerId }) => {
  const [sports, setSports] = useState<State>({ loading: true, items: [], error: null });

  const fetch = useCallback(async (token?: CancelTokenSource) => {
    setSports(state => ({
      ...state, 
      loading: true,
      items: [],
      error: null,
    }))

    const [err, canceled, data] = await fetchPersonsPlayedSports(playerId, token);

    if (canceled)
      return;

    if (err) {
      onError(err);

      return setSports(state => ({
        ...state,
        loading: false,
        error: err,
      }));
    } 

    if (data) {
      setSports(state => ({
        ...state,
        loading: false,
        items: data.items,
        error: null
      }));
    }
  }, [playerId]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  if (sports.loading) {
    return (
      <Row className="mt-5 w-100" alignItems="center" justifyContent="center">
        <Loader color="PRIMARY" size="md"/>
      </Row>
    );
  }

  if (sports.items.length === 0) {

  }

  return (
    <Column className="w-100" gap="md">
      {sports.items.map(played => (
        <SportPerformance
          key={played.id}
          playerId={playerId}
          played={played} 
        />
      ))}
    </Column>
  );
}

type Props = {
  playerId: number,
}

type State = {
  loading: boolean,
  items: Array<PlayedSports>,
  error: Error | null
}