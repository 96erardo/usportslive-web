import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, Button, Column, Row, Input, useModal } from '@8base/boost';
import Avatar from '../../../../shared/components/utilities/Avatar';
import ColorPicker from '../../../../shared/components/form/ColorPicker';
import TeamSelector from '../../../team/components/TeamSelector';
import { Team, Sport } from '../../../../shared/types';
import { createSport } from '../../sport-actions';
import { onError } from '../../../../shared/mixins';
import { toast } from 'react-toastify';

export const modalId = 'sport-form-dialog';

const initialForm = {
  name: '',
  color: '#0874F9',
}

export default function SportFormDialog (props: Props) {
  const modalId = useRef(`${props.type}-sport-dialog`);
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

  const handleChange = useCallback((event) => {
    event.persist();

    setForm(state => ({
      ...state,
      [event.target.name]: event.target.value
    }));
  }, [])

  const handleTeamChange = useCallback((team: Team) => {
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
      await Promise.resolve([new Error(), null])
    );

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success('Deporte creado');

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
            />
          </Row>
          {props.type === 'update' && 
            <TeamSelector onSelect={handleTeamChange}>
              {open => (
                <Input
                  stretch
                  readOnly
                  value={form.team?.name}
                  placeholder="Select a team"
                  onClick={() => open({ sport: form.id })}
                />
              )}
            </TeamSelector>
          }
          <ColorPicker
            initialColor={form.color}
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
  team?: Team
}