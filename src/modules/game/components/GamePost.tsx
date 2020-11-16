import React, { useCallback } from 'react';
import { Paper } from '../../../shared/components/globals/Paper';
import { Heading } from '../../../shared/components/globals';
import { Game } from '../../../shared/types';
import { Like } from './Like';
import { Column, Row, COLORS, styled } from '@8base/boost';
import noSignal from '../../../shared/assets/images/no_signal.png';
import { keyframes } from '@emotion/core';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

const host = process.env.REACT_APP_MEDIA_SERVER_HOST;

const Display = styled.div`
  position: relative;
  height: 300px;
  background-size: cover;
  background-image: 
    linear-gradient(rgba(0,0,0,0.3), #000), 
    url(${(props: { streamKey: string }) => `${host}/${props.streamKey}_2.jpg`}), 
    url(${noSignal});
`;

const Label = styled(Column)`
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  position: relative;
`;

const toggle = keyframes`
  from: {
    opacity: 1;
  }

  to {
    opacity: .3;
  }
`

const Live = styled(Row)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Competition = styled(Heading)`
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;    
  }
`;
  
const LiveIcon = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${COLORS.DANGER};
  animation: ${toggle} 1s ease infinite;
`;

export const GamePost: React.FC<Props> = ({ game }) => {
  const history = useHistory();

  const onClick = useCallback(() => {
    history.push(`/game/${game.id}`);
  }, [history, game]);

  const onCompetition = useCallback(() => {
    history.push(`/competition/${game.competition?.id}`);
  }, [history, game]);

  return (
    <Paper className="w-100 border" background="#fff">
      <Display
        streamKey={game.streamKey}
        alignItems="center" 
        justifyContent="center"
      >
        <Label
          stretch
          className="p-4"
          alignItems="center" 
          justifyContent="end" 
          gap="xs"
        >
          <Row className="w-100" justifyContent="start">
            <Heading 
              clickable
              onClick={onClick}
              type="h2" 
              fontWeight={800}
              color="#fff"
            >
              {game.local?.name} vs {game.visitor?.name}
            </Heading>
          </Row>
          <Row className="w-100" alignItems="center" justifyContent="between">
            <Heading type="h5" color={COLORS.GRAY_20}>
              {moment(game.date).format('DD/MM/YYYY HH:mm')}
            </Heading>
            <Like game={game.id} />
          </Row>
          <Competition type="h5" color={COLORS.GRAY_20} onClick={onCompetition}>
            {game.competition?.name}
          </Competition>
          {game.isLive && (
            <Live ga="sm" alignItems="center">
              <LiveIcon />
              <Heading type="h3" color="#fff">En vivo</Heading>
            </Live>
          )}
        </Label>
      </Display>
    </Paper>
  );
}

type Props = {
  game: Game
}