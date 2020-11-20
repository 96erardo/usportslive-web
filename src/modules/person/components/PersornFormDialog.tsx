import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, Row, Button, Grid, Column, InputField, SelectField, useModal } from '@8base/boost';
import { ImageUploader } from '../../../shared/components/utilities/ImageUploader';
import { Avatar } from '../../../shared/components/globals';
import { Image, User } from '../../../shared/types';
import { GENDER_OPTIONS } from '../../../shared/constants';
import { updateProfile } from '../person-actions';
import { updateUser } from '../../user/user-actions';
import { onError } from '../../../shared/mixins';
import { toast } from 'react-toastify';

export const modalId = 'person-form-dialog';

const initialForm: Form = {
  id: 0,
  name: '',
  lastname: '',
  user: null,
  gender: '',
  email: '',
  oldPassword: '',
  password: '',
  passwordConfirmation: '',
}

export const PersonFormDialog: React.FC = () => {
  const { isOpen, args, closeModal } = useModal(modalId);
  const [form, setForm] = useState<Form>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(args);
    } else {
      setForm(initialForm);
    }
  }, [isOpen, args]);

  const close = useCallback(() => closeModal(modalId), [closeModal]);

  const onChange = useCallback((name: string, value: Image | null | string) => {
    setForm(state => ({
      ...state,
      [name]: value
    }))
  }, []);

  const onSubmit = useCallback(async () => {
    setLoading(true);

    const [err] = form.user ? (
      await updateUser({
        id: form.user.id,
        username: form.user.username,
        email: form.user.email,
        password: form.password,
        oldPassword: form.oldPassword,
        passwordConfirmation: form.passwordConfirmation,
        name: form.name,
        lastname: form.lastname,
        gender: form.gender,
        avatar: form.avatar
      })
    ) : (
      await updateProfile({
        id: form.id,
        name: form.name,
        lastname: form.lastname,
        gender: form.gender,
        avatar: form.avatar,
      })
    );

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success('Perfil actualizado correctamente');

    window.location.reload();
  }, [form]);

  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Header title="Editar perfil" onClose={close} />
      <Dialog.Body>
        <Column className="w-100" alignItems="center" justifyContent="center">
          <ImageUploader id="person-form" onSelect={(image: Image | null) => onChange('avatar', image)}>
            {open => (
              <Avatar
                size="lg"
                src={form.avatar?.url}
                firstName={form.name}
                lastName={form.lastname}
                pickLabel="cambiar"
                onPick={open}
              />
            )}
          </ImageUploader>
          <Grid.Layout 
            className="mt-3"
            columns="auto"
            areas={[
              ['name', 'lastname'],
              ['email', 'username'],
              ['old-password', 'old-password'],
              ['password', 'password-confirmation'],
              ['gender', 'gender']
            ]}
            gap="sm"
          >
            <Grid.Box area="name">
              <InputField 
                label="Nombre"
                input={{
                  type: 'text',
                  name: 'name',
                  value: form.name,
                  onChange: (value: string) => onChange('name', value)
                }}
              />
            </Grid.Box>
            <Grid.Box area="lastname">
              <InputField 
                label="Apellido"
                input={{
                  type: 'text',
                  name: 'lastname',
                  value: form.lastname,
                  onChange: (value: string) => onChange('lastname', value)
                }}
              />
            </Grid.Box>
            {form.user &&
              <>
                <Grid.Box area="email">
                  <InputField 
                    label="Correo electrónico"
                    input={{
                      type: 'email',
                      name: 'email',
                      value: form.user?.email,
                      onChange: (value: string) => onChange('email', value)
                    }}
                  />
                </Grid.Box>
                <Grid.Box area="username">
                  <InputField 
                    label="Nombre de Usuario"
                    input={{
                      type: 'text',
                      name: 'username',
                      value: form.user?.username,
                      onChange: (value: string) => onChange('username', value)
                    }}
                  />
                </Grid.Box>
                <Grid.Box area="old-password">
                  <InputField 
                    label="Contraseña antigua"
                    input={{
                      type: 'oldPassword',
                      name: 'oldPassword',
                      value: form.oldPassword,
                      onChange: (value: string) => onChange('oldPassword', value)
                    }}
                  />
                </Grid.Box>
                <Grid.Box area="password">
                  <InputField 
                    label="Contraseña"
                    input={{
                      type: 'password',
                      name: 'password',
                      value: form.password,
                      onChange: (value: string) => onChange('password', value)
                    }}
                  />
                </Grid.Box>
                <Grid.Box area="password-confirmation">
                  <InputField 
                    label="Repetir contraseña"
                    input={{
                      type: 'password',
                      name: 'passwordConfirmation',
                      value: form.passwordConfirmation,
                      onChange: (value: string) => onChange('passwordConfirmation', value)
                    }}
                  />
                </Grid.Box>
              </>
            }
            <Grid.Box area="gender">
              <SelectField 
                stretch
                label="Género"
                options={GENDER_OPTIONS}
                input={{
                  value: form.gender,
                  onChange: (value: string) => onChange('gender', value),
                }}
              />
            </Grid.Box>
          </Grid.Layout>
        </Column>
      </Dialog.Body>
      <Dialog.Footer padding="sm">
        <Row stretch alignItems="center" justifyContent="end">
          <Button
            disabled={loading}
            size="sm" 
            color="neutral" 
            onClick={close}
          >
            Cancelar
          </Button>
          <Button 
            loading={loading}
            size="sm" 
            color="primary"
            onClick={onSubmit}
          >
            Guardar
          </Button>
        </Row>
      </Dialog.Footer>
    </Dialog>
  );
}

export type Form = {
  id: number,
  name: string,
  lastname: string,
  avatar?: Image,
  gender: string,
  email?: string,
  username?: string,
  password: string,
  passwordConfirmation: string,
  oldPassword: string,
  user?: User | null
}