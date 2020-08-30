import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { Dialog, Button, Column, Row, Input, Avatar, Icon, useModal } from '@8base/boost';
import ClickableInput from '../../../../shared/components/form/ClickableInput';
// import TeamSelector from '../../../team/components/TeamSelector';
import SportSelector from '../../../sport/components/SportSelector';
import { Team, Sport } from '../../../../shared/types';
import { createTeam, updateTeam } from '../../team-actions';
import { onError } from '../../../../shared/mixins';
import { toast } from 'react-toastify';

const initialForm = {
  name: '',
  sport: null,
}

export default function TeamFormDialog (props: Props) {
  const modalId = useRef(`${props.type}-team-dialog`);
  const nameRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Form>(initialForm);
  const [loading, setLoading] = useState(false);
  const { isOpen, args, closeModal } = useModal(modalId.current);

  useEffect(() => {
    if (isOpen) {
      setForm({
        ...initialForm,
        ...args
      });
    }
  }, [isOpen, args]);
  
  useLayoutEffect(() => {
    if (isOpen) {
      if (nameRef.current !== null && args.name) {
        nameRef.current.value = args.name;
      }
    }
  }, [isOpen, args]);

  const handleChange = useCallback((event) => {
    event.persist();

    setForm(state => ({
      ...state,
      [event.target.name]: event.target.value
    }));
  }, [])

  const handleSportChange = useCallback((sport: Sport | null) => {
    setForm(state => ({
      ...state,
      sport
    }))
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    const [err, data] = props.type === 'create' ? (
      await createTeam({
        name: form.name,
        sport: form.sport?.id,
      })
    ) : (
      await updateTeam({
        id: form.id,
        name: form.name,
      })
    );

    setLoading(false);

    if (err) {
      return onError(err);
    }

    if (props.type === 'create') {
      toast.success('Equipo creado con éxito');
    } else {
      toast.success('Equipo actualizado con éxito');
    }

    props.onFinished(data as Team);

    closeModal(modalId.current);
  }, [props, form, closeModal]);

  return (
    <Dialog size="sm" isOpen={isOpen}>
      <Dialog.Header 
        title={props.type === 'create' ? 'Nuevo Equipo' : 'Editar Equipo'} 
        onClose={() => closeModal(modalId.current)} 
      />
      <Dialog.Body>
        <Column stretch gap="lg">
          <Row stretch alignItems="center" justifyContent="between" gap="lg">
            <div>
              <Avatar 
                size="md"
                firstName={form.name[0]}
                lastName={form.name[1]} 
              />
            </div>
            <Input 
              stretch
              name="name"
              onBlur={handleChange}
              insideRef={nameRef}
            />
          </Row>
          {props.type === 'create' && 
            <SportSelector id="create-team" onSelect={handleSportChange}>
              {open => (
                <Row stretch alignItems="center">
                  <ClickableInput
                    stretch
                    readOnly
                    value={form.sport ? form.sport.name : ''}
                    placeholder="Select a sport"
                    cursor="pointer"
                    onChange={() => {}}
                    onClick={open}
                  />
                  <Button squared size="sm" color="neutral" onClick={() => handleSportChange(null)}>
                    <Icon name="Delete" />
                  </Button>
                </Row>
              )}
            </SportSelector>
          }
        </Column>
      </Dialog.Body>
      <Dialog.Footer>
        <Row stretch alignItems="center" justifyContent="end">
          <Button 
            color="neutral"
            onClick={() => closeModal(modalId.current)}
          >
            Cancelar
          </Button>
          <Button 
            loading={loading}
            color="primary"
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
  type: 'create' | 'update',
  onFinished: (team: Team) => void
};

type Form = {
  id?: number,
  name: string,
  sport?: Sport | null
}