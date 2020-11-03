import React, { useContext, useEffect, useState } from 'react';
import { Loader, Heading as BoostHeading, Column as BoostColumn, Row, styled } from '@8base/boost';
import { GameContext } from '../contexts/GameContext';
import moment from 'moment';
import noSignal from '../../../shared/assets/images/no_signal.png';

const Heading = styled(BoostHeading)`
  color: #fff;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 450px;
  background-image: url(${noSignal});
  background-position: center center;
  background-size: cover;
  border-radius: .5rem;
  overflow: hidden;
`;

const Shadow = styled(BoostColumn)`
  background-image: linear-gradient(rgba(0,0,0, 0.3), #000);
  padding: 24px;
`;

export const WaitingStream: React.FC = () => {
  const game = useContext(GameContext);
  const [until, setUntil] = useState(moment(game?.date).valueOf() - moment().valueOf());

  const [isTime, setIsTime] = useState(false);

  useEffect(() => {
    if (until <= 0) {
      setIsTime(true);
    }
  }, [until]);

  useEffect(() => {
    if (!isTime) {
      const interval = setInterval(() => setUntil(state => state - 1000), 1000);

      return () => clearInterval(interval);
    }
  }, [isTime]);

  if (isTime) {
    return (
      <Placeholder stretch background="#000">
        <Shadow stretch alignItems="between" justifyContent="end" gap="xs">
          <Row alignItems="center" justifyContent="between">
            <Heading type="h1" weight="bold">
              <span role="img" aria-label="pop-corn">🍿</span> El Directo empieza pronto
            </Heading>
            <Loader size="sm" color="DANGER"/>
          </Row>
        </Shadow>
      </Placeholder>
    )
  }

  const duration = moment.duration(until, 'milliseconds');
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  
  return (
    <Placeholder stretch background="#000">
      <Shadow stretch alignItems="end" justifyContent="end" gap="xs">
        <Heading type="h1" weight="bold">El Directo empieza en</Heading>
        <Heading type="h2" weight="bold">
          ⏲ {`${days > 1 ? `${days} días ` : ''} ${hours}h ${minutes}m ${seconds}seg`}
        </Heading>
      </Shadow>
    </Placeholder>
  );
}