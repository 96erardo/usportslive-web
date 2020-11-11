import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Column, Loader } from '@8base/boost';
import { useParams, useHistory } from 'react-router-dom';
import { fetchTeam, updateTeamName } from '../../team-actions';
import { Team } from '../../../../shared/types';
import EditableTitle from '../../../../shared/components/form/EditableTitle';
import { Avatar } from '../../../../shared/components/globals';
import axios, { CancelTokenSource } from 'axios';
import { onError } from '../../../../shared/mixins';
import PlayersTable from './PlayersTable';
import { toast } from 'react-toastify';

function TeamDetails () {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const cancelToken = useRef<CancelTokenSource>()

  const fetch = useCallback(async () => {
    cancelToken.current = axios.CancelToken.source();
    setLoading(true);

    const [err, canceled, data] = await fetchTeam(parseInt(id), ['logo'], cancelToken.current);

    if (canceled)
      return;
    
    if (err) {
      onError(err);

      return history.goBack();
    }

    if (data && data.team === null) {
      toast.error('El equipo que intenta visualzar no existe');

      return history.replace('/admin/teams');
    }

    setTeam((data && data.team) ? data.team : null);
    setLoading(false);
  }, [id, history]);

  const onNameChange = useCallback(async (name: string) => {
    const [err] = await updateTeamName(parseInt(id), name);

    if (err) {
      onError(err);

      return false;
    }

    setTeam(state => state ? ({
      ...state,
      name
    }) : state);

    toast.success('Nombre actualizado correctamente');

    return true;
  }, [id]);

  useEffect(() => {
    fetch();

    return () => cancelToken.current?.cancel()
  }, [fetch]);

  if (loading || !team) {
    return (
      <div style={{ padding: '24px' }}>
        <Row stretch alignItems="center" justifyContent="center">
          <Loader />
        </Row>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Column stretch gap="lg">
        <Row stretch alignItems="center" justifyContent="start" gap="md">
          <Avatar 
            size="lg" 
            src={team.logo?.url}
            firstName={team.name[0]} 
            lastName={team.name[1]} 
          />
          <EditableTitle 
            tagName="h1"
            value={team.name}
            onBlur={onNameChange}
          />
        </Row>
        <Row stretch>
          <PlayersTable teamId={team.id} />
        </Row>
      </Column>

    </div>
  );
}

export default TeamDetails;