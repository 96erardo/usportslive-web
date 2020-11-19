import React, { useCallback, useState } from 'react';
import { Grid, Dialog, Column, Row, Button, InputField, SelectField, useModal } from '@8base/boost';
import { ImageUploader } from '../../../shared/components/utilities/ImageUploader';
import { Avatar } from '../../../shared/components/globals';
import { signup } from '../user-actions';
import { Image } from '../../../shared/types';
import { onError } from '../../../shared/mixins';
import { GENDER_OPTIONS } from '../../../shared/constants';
import { modalId as codeModalId, CodeDialog } from './CodeDialog';
import { toast } from 'react-toastify';

const initialForm = {
  avatar: null,
  name: '',
  lastname: '',
  email: '',
  username: '',
  password: '',
  passwordConfirmation: '',
  gender: '',
}

export const modalId = 'signin-dialog';

export const SigninDialog: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal(modalId);
  const [form, setForm] = useState<Form>(initialForm);
  const [loading, setLoading] = useState(false);

  const onChange = useCallback((name, value) => {
    setForm(state => ({
      ...state,
      [name]: value
    }))
  }, []);

  const onAvatar = useCallback((avatar: Image | null) => {
    setForm(state => ({
      ...state,
      avatar
    }));
  }, []);

  const close = useCallback(() => closeModal(modalId), [closeModal]);

  const open = useCallback(() => openModal(codeModalId), [openModal]);

  const onSubmit = useCallback(async () => {
    setLoading(true);

    const [err] = await signup({
      avatar: form.avatar ? form.avatar.id: null,
      name: form.name,
      lastname: form.lastname,
      email: form.email,
      username: form.username,
      password: form.password,
      passwordConfirmation: form.passwordConfirmation,
      gender: form.gender,
    });

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success('Usuario registrado satisfactoriamente, ya puede iniciar sesión');

    close();
  }, [form, close]);

  return (
    <Dialog isOpen={isOpen} size="md">
        <Dialog.Body>
          <Column stretch alignItems="center" gap="xl">
            <ImageUploader id="signin" onSelect={onAvatar}>
              {open => (
                <Avatar 
                  src={form.avatar ? form.avatar.url : ""}
                  firstName={form.name}
                  lastName={form.lastname}
                  size="xl"
                  pickLabel="Cambiar"
                  onPick={open}
                />
              )}  
            </ImageUploader>
            <Grid.Layout 
              columns="auto"
              areas={[
                ['name', 'lastname'],
                ['email', 'username'],
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
              <Grid.Box area="email">
                <InputField 
                  label="Correo electrónico"
                  input={{
                    type: 'email',
                    name: 'email',
                    value: form.email,
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
                    value: form.username,
                    onChange: (value: string) => onChange('username', value)
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
              size="sm"
              disabled={loading}
              color="neutral" 
              onClick={close}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={loading}
              color="success"
              onClick={open}
            >
              Código de Cuenta
            </Button>
            <Button 
              size="sm" 
              color="primary" 
              loading={loading}
              onClick={onSubmit}
            >
              Registrarse
            </Button>
          </Row>
        </Dialog.Footer>
        <CodeDialog />
      </Dialog>
  );
}

type Form = {
  avatar: Image | null,
  name: string,
  lastname: string,
  email: string,
  username: string,
  password: string,
  passwordConfirmation: string,
  gender: string,
}