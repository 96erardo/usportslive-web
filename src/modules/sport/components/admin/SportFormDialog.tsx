import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { Dialog, Button, Column, Row, Input, Icon, useModal } from '@8base/boost';
import Avatar from '../../../../shared/components/utilities/Avatar';
import ColorPicker from '../../../../shared/components/form/ColorPicker';
import TeamSelector from '../../../team/components/TeamSelector';
import { Team, Sport } from '../../../../shared/types';
import { createSport, updateSport } from '../../sport-actions';
import { onError } from '../../../../shared/mixins';
import { toast } from 'react-toastify';

const initialForm = {
  name: '',
  color: '#0874F9',
}

export default function SportFormDialog (props: Props) {
  const modalId = useRef(`${props.type}-sport-dialog`);
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

  const handleTeamChange = useCallback((team: Team | null) => {
    setForm(state => ({
      ...state,
      team
    }))
  }, []);

  const handleColor = useCallback((color: string) => {
    setForm(state => ({
      ...state,
      color: color
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    const [err, data] = props.type === 'create' ? (
      await createSport(form)
    ) : (
      await updateSport({
        id: form.id ? form.id : 0,
        name: form.name,
        color: form.color,
        team: form?.team === null ? null : form.team?.id,
      })
    );

    setLoading(false);

    if (err) {
      return onError(err);
    }

    if (props.type === 'create') {
      toast.success('Deporte creado con éxito');
    } else {
      toast.success('Deporte actualizado con éxito');
    }

    props.onFinished(data as Sport);

    closeModal(modalId.current);
  }, [props, form, closeModal]);

  return (
    <Dialog size="sm" isOpen={isOpen}>
      <Dialog.Header title="New Sport" onClose={() => closeModal(modalId.current)} />
      <Dialog.Body>
        <Column stretch gap="lg">
          <Row stretch alignItems="center" justifyContent="between" gap="lg">
            <div>
              <Avatar 
                size="md"
                firstName={form.name[0]}
                lastName={form.name[1]} 
                background={form.color}
              />
            </div>
            <Input 
              stretch
              name="name"
              onBlur={handleChange}
              insideRef={nameRef}
            />
          </Row>
          {props.type === 'update' && 
            <TeamSelector id="update-sport" onSelect={handleTeamChange}>
              {open => (
                <Row stretch alignItems="center">
                  <Input
                    stretch
                    readOnly
                    value={form.team ? form.team.name : ''}
                    placeholder="Select a team"
                    cursor="pointer"
                    onChange={() => {}}
                    onClick={() => open({ sport: form.id })}
                  />
                  <Button squared size="sm" color="neutral" onClick={() => handleTeamChange(null)}>
                    <Icon name="Delete" />
                  </Button>
                </Row>
              )}
            </TeamSelector>
          }
          <ColorPicker
            color={form.color}
            name="color"
            onChange={handleColor}
          />
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
  onFinished: (sport: Sport) => void
};

type Form = {
  id?: number,
  name: string,
  color: string,
  team?: Team | null
}