import React, { useCallback, useState, useEffect } from 'react';
import { Dialog, Row, Button, Column, DateInput, Icon, useModal } from '@8base/boost';
import CompetitionTeamSelector from '../../../competition/components/admin/CompetitionTeamSelector';
import ClickableInput from '../../../../shared/components/form/ClickableInput';
import { updateGame, deleteGame } from '../../game-actions';
import { toast } from 'react-toastify';
import { createGame } from '../../game-actions';
import { Team } from '../../../../shared/types';
import { onError } from '../../../../shared/mixins';

const initialForm = {
  id: null,
  date: '',
  local: null,
  visitor: null,
}

const GameFormDialog: React.FC<Props> = ({ id, afterMutation }) => {
  const { isOpen, args, closeModal } = useModal(`${id}-game-form-dialog`);
  const [form, setForm] = useState<Form>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const { onSubmit, type, ...rest } = args;
      setForm(state => ({
        ...state,
        ...rest
      }));
    } else {
      setForm(initialForm);
      setSubmitting(false);
      setDeleting(false);
    }
  }, [isOpen, args]);
  
  const close = useCallback(() => {
    closeModal(`${id}-game-form-dialog`);
  }, [id, closeModal]);

  const handleTime = useCallback((date) => {
    setForm(state => ({
      ...state,
      date
    }))
  }, []);

  const handleSubmit = useCallback(() => {
    setSubmitting(true);

    if (!args.onSubmit) {
      return toast.error('Submit function was not provided');
    }

    args.onSubmit(form);
  }, [args, form]);

  const handleDelete = useCallback(() => {
    setSubmitting(true);

    if (!args.onDelete) {
      return toast.error('Delete function was not provided');
    }

    args.onDelete(form.id);
  }, [args, form]);

  const onGameCreate = useCallback(async () => {
    setSubmitting(true);

    const [err] = await createGame({
      competitionId: form.competition ? form.competition : '',
      date: form.date,
      localId: form.local ? form.local.id : null,
      visitorId: form.visitor ? form.visitor.id : null,
    });

    setSubmitting(false);

    if (err) {
      return onError(err);
    }

    toast.success('Patido creado correctamente');

    afterMutation();

    closeModal(`${id}-game-form-dialog`);
  }, [id, form, afterMutation, closeModal]);

  const onGameUpdate = useCallback(async () => {
    setSubmitting(true);

    const [err] = await updateGame({
      id: parseInt(form.id as string),
      date: form.date,
      competitionId: parseInt(form.competition as string),
      localId: form.local ? form.local.id : null,
      visitorId: form.visitor ? form.visitor.id : null,
    });

    setSubmitting(false);

    if (err) {
      return onError(err);
    }

    toast.success('Partido actualizado correctamente');

    afterMutation();

    closeModal(`${id}-game-form-dialog`);
  }, [form, id, closeModal, afterMutation]);

  const onGameDelete = useCallback(async () => {
    setDeleting(true);

    const [err] = await deleteGame(parseInt(form.id as string));

    setDeleting(false);

    if (err) {
      return onError(err);
    }

    toast.success('Partido eliminado correctamente');

    afterMutation();

    closeModal(`${id}-game-form-dialog`)
  }, [id, form, closeModal, afterMutation]);

  const handleLocal = useCallback((local: Team | null) => {
    setForm(state => ({
      ...state,
      local
    }))
  }, [])
  
  const handleVisitor = useCallback((visitor: Team | null) => {
    setForm(state => ({
      ...state,
      visitor
    }))
  }, [])

  const title = (args.type === 'create' || args.type === 'before-create') ? 'Crear Partido' : 'Editar Partido';

  console.log('args', args);
  
  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Header title={title} onClose={close}/>
      <Dialog.Body>
        <Column stretch gap="md">
          <DateInput
            stretch
            value={form.date}
            onChange={handleTime}
            withTime
          />
          {(args.type !== 'before-create' && args.type !== 'before-create-update') &&
            <>
              <CompetitionTeamSelector id="local" onSelect={handleLocal}>
                {open => (
                  <Row stretch alignItems="center">
                    <ClickableInput
                      placeholder="Elige un equipo"
                      name="local"
                      value={form.local ? form.local.name : ''}
                      onClick={() => open({ competition: parseInt(form.competition as string) })}
                    />
                    <Button squared size="sm" color="neutral" onClick={() => handleLocal(null)}>
                      <Icon name="Delete" />
                    </Button>
                  </Row>
                )}
              </CompetitionTeamSelector>
              <CompetitionTeamSelector id="visitor" onSelect={handleVisitor}>
                {open => (
                  <Row stretch alignItems="center">
                    <ClickableInput
                      placeholder="Elige un equipo"
                      name="visitor"
                      value={form.visitor ? form.visitor.name : ''}
                      onClick={() => open({ competition: parseInt(form.competition as string) })}
                    />
                    <Button squared size="sm" color="neutral" onClick={() => handleVisitor(null)}>
                      <Icon name="Delete" />
                    </Button>
                  </Row>
                )}
              </CompetitionTeamSelector>
            </>
          }
        </Column>
      </Dialog.Body>
      <Dialog.Footer>
        <Row stretch alignItems="center" justifyContent="end">
          <Button color="neutral" onClick={close}>
            Cancelar
          </Button>
          {args.type === 'before-create-update' &&
            <Button disabled={submitting} loading={deleting} color="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          }
          {(args.type === 'before-create' || args.type === 'before-create-update') && 
            <Button disabled={deleting} loading={submitting} color="primary" onClick={handleSubmit}>
              Guardar
            </Button>
          }
          {args.type === 'update' &&
            <Button disabled={submitting} loading={deleting} color="danger" onClick={onGameDelete}>
              Eliminar
            </Button>
          }
          {args.type === 'update' && 
            <Button disabled={deleting} loading={submitting} color="primary" onClick={onGameUpdate}>
              Guardar
            </Button>
          }
          {args.type === 'create' && 
            <Button disabled={deleting} loading={submitting} color="primary" onClick={onGameCreate}>
              Guardar
            </Button>
          }
        </Row>
      </Dialog.Footer>
    </Dialog>
  );
};

type Props = {
  id: string,
  afterMutation: () => void
}

export type Form = {
  id?: number | string | null,
  date: string,
  competition?: string | number,
  local: Team | null,
  visitor: Team | null,
}

export default GameFormDialog;