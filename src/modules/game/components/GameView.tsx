import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Row, Loader } from '@8base/boost';
import { Game } from '../../../shared/types';
import { fetchGame } from '../game-actions';
import axios, { CancelTokenSource } from 'axios';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../../../shared/components/globals/VideoPlayer';
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

  return (
    <div className="mt-5 container">
      {loading && 
        <Row stretch alignItems="center" justifyContent="center">
          <Loader size="sm" />
        </Row>
      }
      {game !== null &&
        <VideoPlayer
          streamKey={game.streamKey}
        />
      }
    </div>
  );
};

export default GameView; 