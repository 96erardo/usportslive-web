import React, { useCallback } from 'react';
import { useModal } from '@8base/boost';
import FullCalendar, { EventInput, EventClickArg } from '@fullcalendar/react';
import GameFormDialog, { Form } from '../../game/components/admin/GameFormDialog';
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

  const onCreate = useCallback((form: Form) => {
    const date = moment(form.date);

    onNewGame({
      title: 'Partido',
      start: form.date,
      end: date.add(competition.matchTime, 'minutes').toISOString()
    });

    closeModal(`calendar-game-form-dialog`);
  }, [competition, onNewGame, closeModal]);

  const onUpdate = useCallback((form: Form) => {
    const date = moment(form.date);

    onUpdateNewGame({
      id: form.id as string,
      title: 'Partido',
      start: form.date,
      end: date.add(competition.matchTime, 'minutes').toISOString()
    });

    closeModal(`calendar-game-form-dialog`);
  }, [competition, onUpdateNewGame, closeModal]);
  
  const onDelete = useCallback((id: string) => {
    onRemoveNewGame(id);

    closeModal(`calendar-game-form-dialog`);
  }, [onRemoveNewGame, closeModal]);

  const handleDateClick = useCallback((info) => {
    if (!competition.startDate) {
      return toast.error('Elija una fecha para el torneo antes de crear partidos');
    }

    openModal(`calendar-game-form-dialog`, {
      type: 'create',
      date: info.date.toISOString(),
      onSubmit: onCreate
    });
  }, [competition, onCreate, openModal]);

  const handleEventClick = useCallback(({ event }: EventClickArg) => {
    openModal(`calendar-game-form-dialog`, {
      type: 'mock-update',
      id: event.id,
      date: event.start?.toISOString(),
      onSubmit: onUpdate,
      onDelete: onDelete
    })
  }, [openModal, onUpdate, onDelete]);

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={newEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
      <GameFormDialog id="calendar" />
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