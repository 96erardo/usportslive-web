import React, { useContext, useEffect, useState } from 'react';
import { Card, Heading as BoostHeading, Column, Row, styled } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import { GameContext } from '../contexts/GameContext';
import moment from 'moment';

const Heading = styled(BoostHeading)`
  color: #fff;
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
      <Paper stretch background="#000">
        <Card.Body padding="xl">
          <Row stretch alignContent="center" justifyContent="center">
            <Heading>El Directo empezará en unos minutos</Heading>
          </Row>
        </Card.Body>
      </Paper>
    )
  }

  const duration = moment.duration(until, 'milliseconds');
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  
  return (
    <Paper stretch background="#000">
      <Card.Body>
        <Column stretch>
          <Heading type="h1" weight="bold">El Directo empieza en:</Heading>
          <Row stretch alignItems="center" justifyContent="end">
            <Heading type="h2" weight="bold">
              {`${days > 1 ? `${days} días ` : ''} ${hours}h ${minutes}m ${seconds}seg`}
            </Heading>
          </Row>
        </Column>
      </Card.Body>
    </Paper>
  );
}