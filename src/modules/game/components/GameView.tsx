import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Row, Column, Loader } from '@8base/boost';
import { Game } from '../../../shared/types';
import { fetchGame } from '../game-actions';
import axios, { CancelTokenSource } from 'axios';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../../../shared/components/globals/VideoPlayer';
import TeamLive from '../../team/components/TeamLive';
import LiveScore from './LiveScore';
import { GameProvider } from '../contexts/GameContext';
import { onError } from '../../../shared/mixins';

const GameView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const cancelToken = useRef<CancelTokenSource>();

  const fetch = useCallback(async () => {
    cancelToken.current = axios.CancelToken.source();
    setLoading(true);

    const [err, canceled, data] = await fetchGame(parseInt(id), ['competition', 'local', 'visitor']);

    if (canceled) {
      return;
    }

    if (err)
      onError(err);

    if (data)
      setGame(data.game);
    
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetch();

    return () => cancelToken.current?.cancel()
  }, [fetch]);

  if (loading) {
    return (
      <div className="mt-5 container">
        <Row stretch alignItems="center" justifyContent="center">
          <Loader size="sm" />
        </Row>
      </div>
    );
  }

  if (game == null) {
    return null;
  }

  return (
    <GameProvider game={game}>
      <div className="mt-5 container-fluid">
        <div className="row">
          <div className="col-12 col-lg-6 col-xl-3 order-2 order-xl-1 mb-4">
            <TeamLive 
              type="local"
              id={game.localId} 
              game={game}
            />
          </div>
          <div className="col-12 col-xl-6 order-1 order-xl-2 mb-4">
            <Column>
              <VideoPlayer 
                streamKey={game.streamKey}
              />
              <LiveScore 
                gameId={game.id} 
              />
            </Column>
          </div>
          <div className="col-12 col-lg-6 col-xl-3 order-3 order-xl-3 mb-4">
            <TeamLive 
              type="visitor"
              id={game.visitorId} 
              game={game}
            />
          </div>
        </div>
      </div>
    </GameProvider>
  );
};

export default GameView; 