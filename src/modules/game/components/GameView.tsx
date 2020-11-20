import React from 'react';
import { Row, Column, Loader } from '@8base/boost';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '../../../shared/components/globals/VideoPlayer';
import TeamLive from '../../team/components/TeamLive';
import LiveScore from './LiveScore';
import { WaitingStream } from './WaitingStream';
import { GameProvider } from '../contexts/GameContext';
import { useGameLive } from '../hooks/useGameLive';
import { PlayerRatingDialog } from '../../player/components/PlayerRatingDialog';

const GameView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { game, loading } = useGameLive(id);

  if (loading && game === null) {
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
              {(game.isLive || game.isFinished) ? (
                <VideoPlayer streamKey={game.streamKey} />
              ) : (
                <WaitingStream />
              )}
              <LiveScore game={game} />
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
        <PlayerRatingDialog />
      </div>
    </GameProvider>
  );
};

export default GameView; 