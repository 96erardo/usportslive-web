import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useModal } from '@8base/boost';
import FullCalendar, { EventInput, EventClickArg, DatesSetArg } from '@fullcalendar/react';
import GameFormDialog, { Form } from '../../game/components/admin/GameFormDialog';
import { useCalendarGames } from '../../game/game-hooks';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Competition } from '../../../shared/types';
import { toast } from 'react-toastify';
import moment from 'moment';

const CompetitionCalendar: React.FC<Props> = ({ 
  competition,
  newEvents,
  onNewGame,
  onUpdateNewGame,
  onRemoveNewGame
}) => {
  const { openModal, closeModal } = useModal(`calendar-game-form-dialog`);
  const [month, setMonth] = useState({ isAfter: '', isBefore: '' });
  const { items, fetch } = useCalendarGames();

  const refresh = useCallback(() => {
    if (competition.id) {
      fetch(competition.id, month.isAfter, month.isBefore);
    }
  }, [competition.id, month, fetch]);

  useEffect(() => {
    if (competition.id && month.isAfter && month.isBefore) {
      fetch(competition.id, month.isAfter, month.isBefore);
    }
  }, [competition.id, month, fetch]);

  const onCreate = useCallback((form: Form) => {
    console.log('date', form.date);
    const date = moment(form.date);

    onNewGame({
      title: 'Partido',
      start: form.date,
      end: date.add(competition.matchTime, 'minutes').toISOString()
    });

    closeModal(`calendar-game-form-dialog`);
  }, [competition.matchTime, onNewGame, closeModal]);

  const onUpdate = useCallback((form: Form) => {
    const date = moment(form.date);

    onUpdateNewGame({
      id: form.id as string,
      title: 'Partido',
      start: form.date,
      end: date.add(competition.matchTime, 'minutes').toISOString()
    });

    closeModal(`calendar-game-form-dialog`);
  }, [competition.matchTime, onUpdateNewGame, closeModal]);
  
  const onDelete = useCallback((id: string) => {
    onRemoveNewGame(id);

    closeModal(`calendar-game-form-dialog`);
  }, [onRemoveNewGame, closeModal]);

  const handleMonthChange = useCallback((arg: DatesSetArg) => {
    setMonth({
      isAfter: arg.startStr,
      isBefore: arg.endStr
    });
  }, [])

  const handleDateClick = useCallback((info) => {
    if (!competition.startDate) {
      return toast.error('Elija una fecha para el torneo antes de crear partidos');
    }

    openModal(`calendar-game-form-dialog`, {
      type: competition.id ? 'create' : 'before-create',
      competition: competition.id,
      date: info.date.toISOString(),
      onSubmit: onCreate
    });
  }, [competition.id, competition.startDate, onCreate, openModal]);

  const handleEventClick = useCallback(({ event }: EventClickArg) => {
    const game = items.find(item => item.id.toString() === event.id);

    openModal(`calendar-game-form-dialog`, {
      type: game ? 'update' : 'before-create-update',
      id: event.id,
      date: event.start?.toISOString(),
      local: game?.local,
      visitor: game?.visitor,
      competition: competition.id,
      onSubmit: onUpdate,
      onDelete: onDelete
    })
  }, [items, competition, openModal, onUpdate, onDelete]);

  const events = useMemo(() => items.map(game => ({
    id: game.id.toString(),
    title: (game.local && game.visitor) ? `${game.local.name} vs ${game.visitor.name}` : 'Partido',
    start: game.date,
    end: moment(game.date).add(competition.matchTime, 'minutes').toISOString()
  })), [items, competition.matchTime]);

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[
          ...events,
          ...newEvents,
        ]}
        datesSet={handleMonthChange}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
      <GameFormDialog 
        id="calendar" 
        afterMutation={refresh}
      />
    </>
  );
}

type Props = {
  competition: Partial<Competition>,
  newEvents: Array<EventInput>,
  onNewGame: (data: EventInput) => void,
  onUpdateNewGame: (data: EventInput) => void,
  onRemoveNewGame: (id: string) => void,
}

export default CompetitionCalendar;