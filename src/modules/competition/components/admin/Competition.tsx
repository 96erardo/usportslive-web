import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Card, Column, Grid, Button, Row, Icon, Input, DateInputField, Loader, styled } from '@8base/boost';
import axios, { CancelTokenSource } from 'axios';
import { createCompetition, updateCompetition } from '../../competition-actions';
import InputField from '../../../../shared/components/form/InputField';
import ClickableInput from '../../../../shared/components/form/ClickableInput';
import SportSelector from '../../../sport/components/SportSelector';
import { Sport } from '../../../../shared/types';
import CompetitionCalendar from '../CompetitionCalendar';
import { onError } from '../../../../shared/mixins';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import { fetchCompetition } from '../../competition-actions';
import { EventInput } from '@fullcalendar/react';
import CompetitionTeamsTable from './CompetitionTeamsTable';
import moment from 'moment';

const TitleField = styled(InputField)`
  & input {
    font-weight: bold;
    outline: none;
    border: none;
    font-size: 34px;
    height: 44px;
  }
`;

const initialForm = {
  competition: {
    name: '',
    sportId: 0,
    startDate: '',
    matchTime: 1,
    quantityOfTeams: 2,
    quantityOfPlayers: 1,
  },
  sport: null,
  games: [],
}

const include = ['sport'];

const Competition: React.FC = () => {
  const [form , setForm] = useState<Form>(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const cancelToken = useRef<CancelTokenSource>()
  const params = useParams<{ id: string | undefined }>();
  const history = useHistory();

  const fetch = useCallback(async (id: number) => {
      cancelToken.current = axios.CancelToken.source();

      const [err, canceled, data] = await fetchCompetition(id, include, cancelToken.current);

      if (canceled) {
        return;
      }

      if (err) {
        return onError(err);
      }

      if (data?.competition) {
        const { competition } = data;

        setForm(state => ({
          ...state,
          competition: {
            ...state.competition,
            id: competition.id,
            name: competition.name,
            sportId: competition.sportId,
            startDate: competition.startDate,
            matchTime: competition.matchTime,
            quantityOfTeams: competition.quantityOfTeams,
            quantityOfPlayers: competition.quantityOfPlayers,
          },
          sport: competition.sport ? competition.sport : null,
        }))

        setLoading(false);
      } else {
        history.replace('/admin/competitions');
      }
  }, [history]);

  useEffect(() => {
    if (params.id) {      
      fetch(parseInt(params.id));

      return () => cancelToken.current?.cancel();
    } else {
      setLoading(false);
    }
  }, [params, fetch]);

  const handleChange = useCallback((name, value) => {
    setForm(state => ({
      ...state,
      competition: {
        ...state.competition,
        [name]: value
      }
    }))
  }, []);

  const onSportSelect = useCallback((sport: Sport | null) => {
    setForm(state => ({
      ...state,
      competition: {
        ...state.competition,
        sportId: sport ? sport.id : 0,
      },
      sport
    }));
  }, []);

  const onNewGame = useCallback((game) => {
    setForm(state => ({
      ...state,
      games: [...state.games, game].map((game, i) =>({
        ...game,
        id: `n-${i + 1}`
      }))
    }))
  }, []);

  const onUpdateNewGame = useCallback((game: EventInput) => {
    setForm(state => ({
      ...state,
      games: state.games.map(g => {
        if (g.id === game.id) {
          return game;
        }

        return g;
      })
    }))
  }, [])

  const onDeleteNewGame = useCallback((id: string) => {
    setForm(state => ({
      ...state,
      games: state.games.filter(game => game.id !== id)
    }));
  }, []);

  const onSubmit = useCallback(async () => {
    setSubmitting(true);

    const { competition, games  } = form;

    const [err, data] = params.id ? (
      await updateCompetition({
        id: parseInt(params.id),
        name: form.competition.name,
        startDate: form.competition.startDate,
        matchTime: form.competition.matchTime,
        quantityOfTeams: form.competition.quantityOfTeams,
        quantityOfPlayers: form.competition.quantityOfPlayers
      })
    ) : (
      await createCompetition({
        ...competition,
        games: games.map(game => game.start as string)
      })
    );

    setSubmitting(false);

    if (err) {
      return onError(err);
    }

    if (data) {
      if (!data.success) {
        toast.warning('Lo partidos no pudieron ser creados para la competición, intentelo nuevamente');
      }

      if (params.id) {
        toast.success('Torneo actualizado correctamente');
      } else {
        toast.success('Torneo creado correctamente');        
        history.push('/admin/competitions');
      }
    }

  }, [history, form, params]);

  const { competition, games, sport } = form;

  return (
    <div style={{ padding: '24px' }}>
      {loading ? (
        <Row stretch alignItems="center" justifyContent="center">
          <Loader color="primary" size="md" />
        </Row>
      ) : (
        <Column stretch gap="md">
          <Card stretch>
            <Card.Body>
              <Column stretch gap="xl">
                <TitleField
                  placeholder="Name"
                  name="name"
                  initialValue={competition.name}
                  onChange={handleChange}
                />
                <Grid.Layout stretch gap="md" columns="minmax(300px, 400px) 1fr">
                  <Grid.Box>
                    <Column stretch gap="md">
                      {params.id ? (
                        <Input 
                          name="sport"
                          value={sport ? sport.name : ''}
                          readOnly
                        />
                      ) : (
                        <SportSelector id="create-competition" onSelect={onSportSelect}>
                          {open => (
                            <Row stretch alignItems="center">
                              <ClickableInput
                                stretch
                                readOnly
                                value={sport ? sport.name : ''}
                                placeholder="Select a sport"
                                cursor="pointer"
                                onChange={() => {}}
                                onClick={open}
                              />
                              <Button squared size="sm" color="neutral" onClick={() => onSportSelect(null)}>
                                <Icon name="Delete" />
                              </Button>
                            </Row>
                          )}
                        </SportSelector>
                      )}
                      <DateInputField 
                        label="Fecha de inicio"
                        input={{
                          name: 'startDate',
                          value: competition.startDate,
                          onChange: (value: string) => handleChange('startDate', value),
                        }}
                      />
                      <InputField
                        label="Tiempo por partido (minutos)"
                        name="matchTime"
                        initialValue={competition.matchTime}
                        type="number"
                        onChange={handleChange}
                      />
                      <InputField
                        label="N° de Equipos en el Torneo"
                        name="quantityOfTeams"
                        initialValue={competition.quantityOfTeams}
                        type="number"
                        onChange={handleChange}
                      />
                      <InputField
                        label="N° de Jugadores por Equipo"
                        name="quantityOfPlayers"
                        initialValue={competition.quantityOfPlayers}
                        type="number"
                        onChange={handleChange}
                      />
                    </Column>
                  </Grid.Box>
                  <Grid.Box>
                    <CompetitionCalendar
                      competition={competition}
                      newEvents={games}
                      onNewGame={onNewGame}
                      onUpdateNewGame={onUpdateNewGame}
                      onRemoveNewGame={onDeleteNewGame}
                    />
                  </Grid.Box>
                </Grid.Layout>
              </Column>
            </Card.Body>
            <Card.Footer>
              <Row stretch alignItems="center" justifyContent="end">
                <Button color="neutral">
                  Cancelar
                </Button>
                <Button color="primary" loading={submitting} onClick={onSubmit}>
                  Guardar Torneo
                </Button>
              </Row>
            </Card.Footer>
          </Card>
          {params.id && competition.id &&
            <CompetitionTeamsTable 
              competitionId={competition.id}
              sportId={competition.sportId}
            />
          }
        </Column>
      )}
    </div>
  );
}

type Form = {
  competition: {
    id?: number,
    name: string,
    sportId: number,
    startDate: string,
    matchTime: number,
    quantityOfTeams: number,
    quantityOfPlayers: number,
  },
  sport: Sport | null,
  games: Array<EventInput>
}

export default Competition;