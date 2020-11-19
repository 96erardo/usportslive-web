import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, Row, Button, Column, Input, useModal, Paragraph, COLORS, styled } from '@8base/boost';
import PersonSelector from '../../../person/components/PersonSelector';
import ClickableInput from '../../../../shared/components/form/ClickableInput';
import { Person as Player } from '../../../../shared/types';
import { createExchangeCode } from '../../user-actions';
import { onError } from '../../../../shared/mixins';
import { toast } from 'react-toastify';

const Code = styled(Input)`
  width: 50%;
  
  & > input {
    height: 90px;
    background: ${COLORS.GRAY_20};
    border-width: 0px;
    font-size: 24px;
    font-weight: 700;
  }
`;

export const modalId = 'bind-account-dialog';

export const BindAccountDialog: React.FC = () => {
  const { isOpen, closeModal } = useModal(modalId);
  const [player, setPlayer] = useState<Player | null>(null);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPlayer(null);
    }
  }, [isOpen]);

  const exchange = useCallback(async () => {
    setLoading(true);
    setCode('');

    if (player) {
      const [err, data] = await createExchangeCode(player.id);
      
      setLoading(false);

      if (err) {
        return onError(err);
      }

      toast.success('Código creado correctamente');

      if (data) {
        setCode(data.code);
      }
    }

  }, [player]);

  const close = useCallback(() => closeModal(modalId), [closeModal]);

  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Header 
        title="Vincula un jugador con una nueva cuenta" 
        onClose={close} 
      />
      <Dialog.Body>
        <Column className="w-100" gap="lg" alignItems="center">
          <PersonSelector id="bind-account" onSelect={setPlayer}>
            {open => (
              <ClickableInput 
                readOnly
                placeholder="Elige un perfil"
                name="player"
                value={player ? `${player.name} ${player.lastname}` : ''}
                onClick={open}
              />
            )}
          </PersonSelector>
          <Code
            type="text"
            readOnly
            align="center"
            value={code}
          />
          {code &&
            <Paragraph className="px-2" align="center">
              Entregue este código al usuario que está por registrarse
              para vincuar su nombre y correo al perfil de {player?.name} {player?.lastname}
            </Paragraph>
          }
        </Column>
      </Dialog.Body>
      <Dialog.Footer padding="sm">
        <Row className="w-100" justifyContent="end">
          <Button
            size="sm"
            color="neutral"
            disabled={loading}
            onClick={close}
          >
            {code ? 'Terminar' : 'Cancelar'}
          </Button>
          <Button
            size="sm"
            color="primary"
            disabled={player === null}
            loading={loading}
            onClick={exchange}
          >
            {code ? 'Generar otro': 'Crear Código'}
          </Button>
        </Row>
      </Dialog.Footer>
    </Dialog>
  );
}