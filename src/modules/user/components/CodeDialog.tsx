import React, { useCallback, useState } from 'react';
import { Dialog, Row, Button, Column, InputField, Paragraph, useModal } from '@8base/boost';

export const modalId = 'code-dialog';

export const CodeDialog: React.FC = () => {
  const [code, setCode] = useState('');
  const { isOpen, closeModal } = useModal(modalId);
  const [, setLoading] = useState(false);

  const close = useCallback(() => closeModal(modalId), [closeModal]);

  const exchange = useCallback(async () => {
    setLoading(true);


  }, []);

  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Header title="Introduce el código" onClose={close} />
      <Dialog.Body>
        <Column>
          <Paragraph align="center">
            Use el código proveido por el administrador para
            crear un usuario vinculado a un jugador ya existente
          </Paragraph>
          <InputField 
            stretch
            label="Código"
            input={{
              name: 'code',
              value: code,
              onChange: setCode
            }}
          />
        </Column>
      </Dialog.Body>
      <Dialog.Footer padding="sm">
        <Row className="w-100" alignItems="center" justifyContent="end">
          <Button
            size="sm"
            color="neutral"
            onClick={close}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            color="primary"
            onClick={exchange}
          >
            Canjear
          </Button>
        </Row>
      </Dialog.Footer>
    </Dialog>
  );
}