import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, Row, Button, InputField, useModal } from '@8base/boost';
import { updateSubstitutionMinute, UpdateSubMinuteData } from '../../game/game-actions';
import { toast } from 'react-toastify';
import { onError } from '../../../shared/mixins';

export const modalId = 'sub-minute-dialog';

const initialForm: UpdateSubMinuteData = {
  game: 0,
  team: 0,
  player: 0,
  type: 'inMinute',
  minute: 0,
}

const UpdateSubMinuteDialog: React.FC<Props> = ({ id }) => {
  const { isOpen, args, closeModal } = useModal(`${id}-${modalId}`);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<UpdateSubMinuteData>(initialForm);

  useEffect(() => {
    if (isOpen) {
      setForm(state => ({
        ...state,
        ...args
      }))

    } else {
      setLoading(false);

      setForm(initialForm);
    }
  }, [isOpen, args]);

  const close = useCallback(() => closeModal(`${id}-${modalId}`), [closeModal, id]);

  const handleChange = useCallback((name: string, minute: string) => {
    setForm(state => ({
      ...state,
      [name]: minute,
    }))
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    const [err] = await updateSubstitutionMinute(form);

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success('Sustitución actualizada  correctamente');

    close();
  }, [form, close]);

  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Header title="Actualizar minuto de substitución" onClose={close} />
      <Dialog.Body>
        <InputField 
          stretch
          label="Minuto"
          type="number"
          input={{
            name: 'minute',
            value: form.minute,
            onChange: (value: string) => handleChange('minute', value)
          }}
        />
      </Dialog.Body>
      <Dialog.Footer>
        <Row stretch alignItems="center" justifyContent="end">
          <Button color="neutral" onClick={close}>
            Cancelar
          </Button>
          <Button loading={loading} color="primary" onClick={handleSubmit}>
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

export default UpdateSubMinuteDialog;