import React from 'react';
import { Column, Row, Icon, COLORS, styled } from '@8base/boost';
import Rating from 'react-rating';
import ReactStars from 'react-rating-stars-component';
import { Paper as BoostPaper } from '../../../shared/components/globals/Paper';
import { Heading } from '../../../shared/components/globals';
import { PlayedSports } from '../../../shared/types';
import { useSportPerformance } from '../../player/hooks/useSportPerformance';

const Paper = styled(BoostPaper)`
  ${(props: {border: string}) => props.border && `border: 2px solid ${props.border};`}
`;

export const SportPerformance: React.FC<Props> = ({ playerId, played }) => {
  const perf = useSportPerformance(playerId, played.id);

  const stars = perf.rating && perf.rating.value ? Math.round(perf.rating.value) : 1;

  console.log('stars', stars);

  return (
    <Paper 
      className="w-100 p-4" 
      background={COLORS.BLACK}
      border={played.color}
    >
      <Column className="w-100">
        <Row className="w-100" alignItems="center" justifyContent="between">
          <Heading type="h1" weight="bold" color="#fff">
            {played.name}
          </Heading>
          <Rating 
            readonly
            initialRating={stars}
            emptySymbol={<Icon name="BlankStar" size="sm" />}
            fullSymbol={<Icon name="YellowStar" size="sm" />}
          />
        </Row>
      </Column>
    </Paper>
  );
}

type Props = {
  playerId: number,
  played: PlayedSports
}
