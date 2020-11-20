import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, Column, Row, Button, Icon, useModal } from '@8base/boost';
import { Avatar } from '../../../shared/components/globals';
import { fetchPlayerRatingInGame, ratePlayerPerformance } from '../player-actions';
import { CancelTokenSource } from 'axios';
import Rating from 'react-rating';
import { onError } from '../../../shared/mixins';
import { toast } from 'react-toastify';

export const modalId = 'player-rating-dialog';

export const PlayerRatingDialog: React.FC<Props> = () => {
  const { closeModal, isOpen, args } = useModal(modalId);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const close = useCallback(() => closeModal(modalId), [closeModal]);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setLoading(true);

    const [, canceled, data] = await fetchPlayerRatingInGame(
      args.person.id,
      args.game.id,
      source
    );

    setLoading(false);

    if (canceled)
      return;
    
    if (data && data.rating) {
      setPoints(data.rating.points);
    }
  }, [args]);

  const submit = useCallback(async () => {
    setLoading(true);

    const [err] = await ratePlayerPerformance(
      args.person.id,
      args.game.id,
      points
    );

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success('Calificación enviada');

    close();
  }, [args, points, close]);

  useEffect(() => {
    if (isOpen) {
      fetch();
    } else {
      setPoints(0);
    }
  }, [isOpen, fetch]);

  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Header 
        title={`Califica el rendimiento de ${args?.person?.name}`} 
        onClose={close}
      />
      <Dialog.Body>
        <Column className="w-100" alignItems="center" gap="lg">
          <Avatar 
            src={args?.person?.avatar?.url}
            size="lg"
            firstName={args?.person?.name}
            lastName={args?.person?.lastname}
          />
          <Rating 
            initialRating={points}
            onChange={setPoints}
            emptySymbol={<Icon name="BlankStar" size="md" />}
            fullSymbol={<Icon name="YellowStar" size="md" />}
          />
        </Column>
      </Dialog.Body>
      <Dialog.Footer padding="sm">
        <Row stretch alignItems="center" justifyContent="end">
          <Button 
            size="sm" 
            color="neutral"
            onClick={close}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            size="sm" 
            color="primary"
            loading={loading}
            onClick={submit}
          >
            Calificar
          </Button>
        </Row>
      </Dialog.Footer>
    </Dialog>
  );
}

type Props = {
}