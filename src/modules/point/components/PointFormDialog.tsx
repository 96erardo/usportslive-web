import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, Row, Column, Button, InputField, Label, SelectField, Icon, useModal } from '@8base/boost';
import { PlayingSelector } from '../../player/components/PlayingSelector';
import ClickableInput from '../../../shared/components/form/ClickableInput';
import { Person } from '../../../shared/types';
import { STATUS_OPTIONS } from '../../point/point-model';
import { createPoint, updatePoint, deletePoint } from '../../point/point-actions';
import { fetchPerson } from '../../person/person-actions';
import { onError } from '../../../shared/mixins';
import { toast } from 'react-toastify';

export const modalId = 'point-form-dialog';

const initialForm: Form = {
  minute: 0,
  scorer: null,
  assister: null,
}

export const PointFormDialog: React.FC<Props> = ({ id }) => {
  const { isOpen, args, closeModal } = useModal(`${id}-${modalId}`);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);

    const scorer = args.scorerId ? await fetchPerson(args.scorerId) : null;
    const assister = args.assisterId ? await fetchPerson(args.assisterId) : null;

    setLoading(false);
    
    if (scorer) {
      const [err,, data] = scorer;
      
      if (err) {
        onError(err);
      }
      
      if (data) {
        setForm(state => ({
          ...state,
          scorer: data.person,
        }))
      }
    }

    if (assister) {
      const [err,, data] = assister;

      if (err) {
        onError(err);
      }

      if (data) {
        setForm(state => ({
          ...state,
          assister: data.person
        }));
      }
    }
  }, [args]);

  const handleChange = useCallback((name: string, value: any) => {
    setForm(state => ({
      ...state,
      [name]: value
    }))
  }, []);

  useEffect(() => {
    if (isOpen) {
      setForm(state => ({
        ...state,
        id: args.id ? args.id : undefined,
        minute: args.minute ? args.minute : 0,
        status: args.status ? args.status : 'VALID'
      }));

      fetch();
    } else {
      setForm(initialForm);
    }
  }, [fetch, isOpen, args]);

  const close = useCallback(() => closeModal(`${id}-${modalId}`), [id, closeModal]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    
    const [err] = form.id ? (
      await updatePoint({
        id: form.id,
        minute: form.minute,
        scorerId: form.scorer ? form.scorer.id : 0,
        assisterId: form.assister ? form.assister.id : null,
        status: form.status ? form.status : 'VALID',
      })
    ) : (
      await createPoint({
        minute: form.minute,
        gameId: args.gameId,
        teamId: args.teamId,
        scorerId: form.scorer ? form.scorer.id : 0,
        assisterId: form.assister ? form.assister.id : undefined,
      })
    );

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success(form.id ? 'Point updated successfully' : 'Point created successfully');

    close();
  }, [form, args, close]);

  const handleDelete = useCallback(async () => {
    setDeleting(true);

    const [err] = await deletePoint(form.id ? form.id : 0);

    setDeleting(false);

    if (err) {
      return onError(err);
    }

    toast.success('Point deleted successfully');

    close();
  }, [form, close]);

  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Header title="Anotación" onClose={close} />
      <Dialog.Body>
        <Column stretch>
          <Label text="Anotador" />
          <PlayingSelector id={`${id}-goal-scorer`} onSelect={(player: Person) => handleChange('scorer', player)}>
            {open => (
              <ClickableInput 
                stretch
                readOnly
                value={form.scorer ? `${form.scorer.name} ${form.scorer.lastname}` : ''}
                placeholder="Select a player"
                cursor="pointer"
                onChange={() => {}}
                onClick={() => open(args.gameId, args.teamId)}
              />
            )}
          </PlayingSelector>
          <InputField 
            stretch
            label="Minuto"
            placeholder="Minuto"
            type="number"
            input={{ 
              name: 'minute', 
              value: form.minute,
              onChange: (value: any) => handleChange('minute', value) 
            }}
          />
          <Label text="Asistidor" />
          <PlayingSelector id={`${id}-goal-assister`} onSelect={(player: Person) => handleChange('assister', player)}>
            {open => (
              <Row stretch alignItems="center">
                <ClickableInput 
                  stretch
                  readOnly
                  value={form.assister ? `${form.assister.name} ${form.assister.lastname}` : ''}
                  placeholder="Select a player"
                  cursor="pointer"
                  onChange={() => {}}
                  onClick={() => open(args.gameId, args.teamId)}
                />
                <Button squared size="sm" color="neutral" onClick={() => handleChange('assister', null)}>
                  <Icon name="Delete" />
                </Button>
              </Row>
            )}
          </PlayingSelector>
          {form.id &&
            <SelectField 
              stretch
              label="Status"
              options={STATUS_OPTIONS}
              input={{
                name: 'status',
                value: form.status,
                onChange: (value: string) => handleChange('status', value)
              }}
            />
          }
        </Column>
      </Dialog.Body>
      <Dialog.Footer>
        <Row stretch alignItems="center" justifyContent="end"> 
          <Button color="neutral" onClick={close}>
            Cancelar
          </Button>
          {form.id && 
            <Button 
              color="danger" 
              loading={deleting}
              disabled={loading}
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          }
          <Button 
            color="primary" 
            loading={loading}
            disabled={deleting}
            onClick={handleSubmit}
          >
            Guardar
          </Button>
        </Row>
      </Dialog.Footer>
    </Dialog>
  );
}

type Props = {
  id: string,
}

type Form = {
  id?: number,
  minute: number,
  scorer: Person | null,
  assister: Person | null,
  status?: 'VALID' | 'CANCELED'
}