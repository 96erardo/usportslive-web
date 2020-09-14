import React, { useCallback, useState } from 'react';
import { Card, Column, Grid, Button, Row, Icon, DateInputField, styled } from '@8base/boost';
import { createCompetition } from '../../competition-actions';
import InputField from '../../../../shared/components/form/InputField';
import ClickableInput from '../../../../shared/components/form/ClickableInput';
import SportSelector from '../../../sport/components/SportSelector';
import { Sport } from '../../../../shared/types';
import CompetitionCalendar from '../CompetitionCalendar';
import { onError } from '../../../../shared/mixins';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { EventInput } from '@fullcalendar/react';

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

const Competition: React.FC = () => {
  const [form , setForm] = useState<Form>(initialForm);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

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
    setLoading(true);

    const { competition, games  } = form;

    const [err, data] = await createCompetition({
      ...competition,
      games: games.map(game => game.start as string)
    });

    setLoading(false);

    if (err) {
      return onError(err);
    }

    if (data) {
      const { success } = data;
      
      toast.success('Torneo creado correctamente');

      if (!success) {
        toast.warning('Lo partidos no pudieron ser creados para la competición, intentelo nuevamente');
      }

      history.push('/admin/competitions');
    }

  }, [history, form]);

  const { competition, games, sport } = form;

  return (
    <div style={{ padding: '24px' }}>
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
            <Button color="primary" loading={loading} onClick={onSubmit}>
              Guardar Torneo
            </Button>
          </Row>
        </Card.Footer>
      </Card>
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