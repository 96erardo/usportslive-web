import React, { useCallback, useState, useEffect } from 'react';
import { Dialog, Row, Button, Column, DateInput, useModal } from '@8base/boost';
import { toast } from 'react-toastify';

const initialForm = {
  id: null,
  date: '',
  local: null,
  visitor: null,
}

const GameFormDialog: React.FC<Props> = ({ id }) => {
  const { isOpen, args, closeModal } = useModal(`${id}-game-form-dialog`);
  const [form, setForm] = useState<Form>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const { onSubmit, type, ...rest } = args;
      setForm(state => ({
        ...state,
        ...rest
      }));
    } else {
      setLoading(false);
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
    setLoading(true);

    if (!args.onSubmit) {
      return toast.error('Submit function was not provided');
    }

    args.onSubmit(form);
  }, [args, form]);

  const handleDelete = useCallback(() => {
    setLoading(true);

    if (!args.onDelete) {
      return toast.error('Delete function was not provided');
    }

    args.onDelete(form.id);
  }, [args, form]);
  
  const title = args.type === 'create' ? 'Crear Partido' : 'Editar Partido';
  
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
        </Column>
      </Dialog.Body>
      <Dialog.Footer>
        <Row stretch alignItems="center" justifyContent="end">
          <Button color="neutral" onClick={close}>
            Cancelar
          </Button>
          {args.type !== 'create' &&
            <Button loading={loading} color="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          }
          <Button loading={loading} color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Row>
      </Dialog.Footer>
    </Dialog>
  );
};

type Props = {
  id: string,
}

export type Form = {
  id?: number | string | null,
  date: string,
}

export default GameFormDialog;