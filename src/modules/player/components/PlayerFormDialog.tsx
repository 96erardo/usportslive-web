import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, Avatar, Row, Button, SelectField, Column, Icon, useModal } from '@8base/boost';
import ClickableInput from '../../../shared/components/form/ClickableInput';
import PersonSelector from '../../person/components/PersonSelector';
import { GENDERS, GENDER_OPTIONS } from '../../../shared/constants';
import InputField from '../../../shared/components/form/InputField';
import { onError } from '../../../shared/mixins';
import { createPlayer, updatePlayer, adddPlayerInTeam } from '../player-actions';
import { toast } from 'react-toastify';
import { Person, User } from '../../../shared/types';

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
  const [form, setForm] = useState<Form>(initialForm);

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

    let result;

    if (type === 'create') {
      result = await createPlayer({
        teamId: id,
        name: form.name,
        lastname: form.lastname,
        number: form.number,
        gender: form.gender,
      });
    } else if (type === 'update' && form.user !== null) {
      result = await updatePlayer(id, {
        id: form.id,
        number: form.number 
      });
    } else if (type === 'update' && form.user === null) {
      result = await updatePlayer(id, {
        id: form.id,
        name: form.name,
        lastname: form.lastname,
        number: form.number,
        gender: form.gender,
      })
    } else {
      result = await adddPlayerInTeam({
        teamId: id, 
        playerId: form.id ? form.id : 0, 
        number: form.number
      });
    }

    const [err] = result;

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success(type === 'create' ? 'Jugador creado correctamente' : 'Jugador editado correctamente');

    onFinished();

    closeModal(`${type}-player-form`);
  }, [id, type, form, closeModal, onFinished]);

  const onPersonSelect = useCallback((person: Person | null) => {
    setForm(state => ({
      ...state,
      id: person ? person.id : null,
      name: person ? person.name : '',
      lastname: person ? person.lastname : '',
      gender: person ? person.gender : GENDERS.MALE,
      photo: person ? person.photo : '',
      user: person ? person.user : null,
    }));
  }, [])

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
            pickLabel={(form.user === null && type !== 'add') ? 'Cambiar' : null}
            onPick={(form.user === null && type !== 'add') ? onPick : null}
          />
          {type !== 'add' ? (
            <>
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
            </>
          ) : (
            <PersonSelector id="add-player" onSelect={onPersonSelect}>
              {(open) => (
                <Row stretch alignItems="center">
                  <ClickableInput
                    stretch
                    readOnly
                    value={`${form.name} ${form.lastname}`}
                    placeholder="Elije el jugador"
                    cursor="pointer"
                    onChange={() => {}}
                    onClick={open}
                  />
                  <Button squared size="sm" color="neutral" onClick={() => onPersonSelect(null)}>
                    <Icon name="Delete" />
                  </Button>
                </Row>
              )}
            </PersonSelector>
          )}
          <InputField
            label="Número"
            name="number"
            initialValue={form.number}
            onChange={onChange}
          />
          {type !== 'add' &&
            <SelectField
              disabled={form.user !== null}
              label="Género"
              options={GENDER_OPTIONS}
              input={{
                value: form.gender,
                onChange: (value: string) => onChange('gender', value)
              }}
            />
          }
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
  type: 'add' | 'create' | 'update',
  onFinished: () => void
}

type Form = {
  id: string | number | null,
  name: string,
  lastname: string,
  number: string | number,
  gender: 'Masculino' | 'Femenino' | 'Otro' | string,
  photo: string,
  user: User | null | undefined,
}

export default PlayerFormDialog;