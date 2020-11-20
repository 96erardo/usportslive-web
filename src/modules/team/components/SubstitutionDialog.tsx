import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, Grid, Row, Button, Loader, InputField, styled, useModal } from '@8base/boost';
import SubstitutionPlayer from './SubstitutionPlayer';
import { fetchPlayersInGame, performSubstitution } from '../../game/game-actions';
import { Person as Player } from '../../../shared/types';
import { onError } from '../../../shared/mixins';
import { toast } from 'react-toastify';

const Layout = styled(Grid.Layout)`
  & > *:not(:last-child) {
    border-right: 1px solid #E8EFF5 !important;
  }
`;

const Box = styled(Grid.Box)`
  height: 300px;
  overflow: auto;
`;

export const modalId = 'substitution-modal';

const SubstitutionDialog: React.FC<Props> = ({ id, gameId, teamId, afterSubstitution }) => {
  const { isOpen, closeModal } = useModal(`${id}-${modalId}`);
  const [loading, setLoading] = useState<boolean>(true);
  const [minute, setMinute] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [playing, setPlaying] = useState<Array<Player>>([]);
  const [waiting, setWaiting] = useState<Array<Player>>([]);
  const [enter, setEnter] = useState<number | undefined>();
  const [out, setOut] = useState<number | undefined>();

  const close = useCallback(() => closeModal(`${id}-${modalId}`), [id, closeModal]);

  const fetch = useCallback(async () => {
    setLoading(true);

    const players = await fetchPlayersInGame(gameId, teamId, 'playing');
    const substitutes = await fetchPlayersInGame(gameId, teamId, 'bench');

    setLoading(false);

    if (players[0]) {
      return onError(players[0]);
    }
    
    if (substitutes[0]) {
      return onError(substitutes[0]);
    }

    if (players[2]) {
      setPlaying(players[2].items);
    }
    
    if (substitutes[2]) {
      setWaiting(substitutes[2].items);
    }

    return setLoading(false);
  }, [gameId, teamId]);

  useEffect(() => {
    if (isOpen) {
      fetch();
    } else {
      setMinute(1);
      setPlaying([]);
      setWaiting([]);
      setEnter(undefined);
      setOut(undefined);
    }
  }, [isOpen, fetch]);

  const onSubmit = useCallback(async () => {
    setSubmitting(true);

    const [err] = await performSubstitution({
      gameId,
      teamId,
      out: out ? out : 0,
      in: enter ? enter : 0,
      minute,
    });

    if (err) {
      return onError(err);
    }

    toast.success('Sustitución realizada correctamente');

    afterSubstitution();

    close();

  }, [close, gameId, teamId, enter, out, minute, afterSubstitution]);

  const handleIn = useCallback((id: number) => {
    setEnter(id);
  }, []);
  
  const handleOut = useCallback((id: number) => {
    setOut(id);
  }, []);

  return (
    <Dialog size="xl" isOpen={isOpen}>
      <Dialog.Header title="Substitution" onClose={close}/>
      <Dialog.Body padding="none">
        <Row style={{ borderBottom: '1px solid #E8EFF5' }} stretch className="p-4" alignItems="center">
          <InputField
            stretch
            label="Minute"
            type="number"
            input={{ 
              name: 'number', 
              value: minute, 
              onChange: setMinute, 
            }}
          />
        </Row>
        <Layout stretch inline columns="50% 50%">
          <Box>
            {loading ? (
              <Row stretch className="p-4" alignItems="center" justifyContent="center"> 
                <Loader size="sm" />
              </Row>
            ) : (
              playing.map(player => (
                <SubstitutionPlayer
                  key={player.id}
                  type="out"
                  selected={out}
                  player={player}
                  onClick={handleOut}
                />
              ))
            )}
          </Box>
          <Box>
            {loading ? (
              <Row stretch className="p-4" alignItems="center" justifyContent="center">
                <Loader size="sm" />
              </Row>
            ) : (
              waiting.map(player => (
                <SubstitutionPlayer
                  key={player.id}
                  type="in"
                  selected={enter}
                  player={player}
                  onClick={handleIn}
                />
              ))
            )}
          </Box>
        </Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Row alignItems="center" justifyContent="end">
          <Button color="neutral" onClick={close}>
            Cancelar
          </Button>
          <Button 
            color="primary"
            loading={submitting}
            disabled={out === undefined || enter === undefined}
            onClick={onSubmit}
          >
            Sustituir
          </Button>
        </Row>
      </Dialog.Footer>
    </Dialog>
  );
}

type Props = {
  id: string,
  gameId: number,
  teamId: number,
  afterSubstitution: () => void
}

export default SubstitutionDialog;