import React from 'react';
import PointEvent from './PointEvent';
import SubstitutionEvent from './SubstitutionEvent';
  import { useGameLiveEvents } from '../hooks/useGameLiveEvents';
import { PersonPlaysGame } from '../../../shared/types';
import UpdateSubMinuteDialog from '../../team/components/UpdateSubMinuteDialog';
import DecisionDialog from '../../../shared/components/globals/DecisionDialog';

const GameEvents: React.FC<Props> = ({ gameId }) => {
  const { items } = useGameLiveEvents(gameId);

  const events = items.map((event, i) => (
    event.type === 'point' ? (
      <PointEvent 
        key={i}
        point={event}
      />
    ) : (
      <SubstitutionEvent 
        key={i}
        substitution={event as PersonPlaysGame}
      />
    )
  ));

  return (
    <div>
      {events}
      <UpdateSubMinuteDialog 
        id="live-score"
      />
      <DecisionDialog />
    </div>
  );
};

type Props = {
  gameId: number,
}

export default GameEvents;