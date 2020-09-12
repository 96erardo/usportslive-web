import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, Avatar, Row, Button, SelectField, Column, useModal } from '@8base/boost';
import { GENDERS, GENDER_OPTIONS } from '../../../shared/constants';
import InputField from '../../../shared/components/form/InputField';
import { onError } from '../../../shared/mixins';
import { createPlayer, updatePlayer } from '../player-actions';
import { toast } from 'react-toastify';

const initialForm = {
  id: null,
  name: '',
  lastname: '',
  number: 0,
  gender: GENDERS.MALE,
  photo: '',
  user: null,
};

const PlayerFormDialog: React.FC<Props> = ({ id, type, onFinished }) => {
  const { isOpen, closeModal, args } = useModal(`${type}-player-form`);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (isOpen) {
      setForm({
        ...initialForm,
        ...args
      })
    }
  }, [isOpen, args]);

  const onPick = useCallback(() => {

  }, []);

  const onChange = useCallback((name, value) => {
    setForm(state => ({
      ...state,
      [name]: value
    }));
  }, [])

  const onClose = useCallback(() => {
    closeModal(`${type}-player-form`);
  }, [type, closeModal]);

  const onSubmit = useCallback(async () => {
    setLoading(true);

    const [err] = type === 'create' ? (
      await createPlayer({
        teamId: id,
        name: form.name,
        lastname: form.lastname,
        number: form.number,
        gender: form.gender,
      })
    ) : form.user ? (
      await updatePlayer(id, {
        id: form.id,
        number: form.number 
      })
    ) : (
      await updatePlayer(id, {
        id: form.id,
        name: form.name,
        lastname: form.lastname,
        number: form.number,
        gender: form.gender,
      })
    );

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success(type === 'create' ? 'Jugador creado correctamente' : 'Jugador editado correctamente');

    onFinished();

    closeModal(`${type}-player-form`);
  }, [id, type, form, closeModal, onFinished])

  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Header 
        title={type === 'create' ? 'Crear Jugador' : 'Editar Jugador'}
        onClose={onClose}
      />
      <Dialog.Body>
        <Column stretch alignItems="center">
          <Avatar
            src={form.photo}
            size="xl"
            firstName={form.name}
            lastName={form.lastname}
            pickLabel={form.user === null ? 'Cambiar' : null}
            onPick={form.user === null ? onPick : null}
          />
          <InputField 
            readOnly={form.user !== null}
            label="Nombre"
            name="name"
            initialValue={form.name}
            onChange={onChange}
          />
          <InputField
            readOnly={form.user !== null}
            label="Apellido"
            name="lastname"
            initialValue={form.lastname}
            onChange={onChange}
          />
          <InputField
            label="Número"
            name="number"
            initialValue={form.number}
            onChange={onChange}
          />
          <SelectField
            disabled={form.user !== null}
            label="Género"
            options={GENDER_OPTIONS}
            input={{
              value: form.gender,
              onChange: (value: string) => onChange('gender', value)
            }}
          />
        </Column>
      </Dialog.Body>
      <Dialog.Footer>
        <Row stretch alignItems="center" justifyContent="end">
          <Button color="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button color="primary" loading={loading} onClick={onSubmit}>
            Guardar
          </Button>
        </Row>
      </Dialog.Footer>
    </Dialog>
  ); 
}

type Props = {
  id: number,
  type: 'create' | 'update',
  onFinished: () => void
}

export default PlayerFormDialog;