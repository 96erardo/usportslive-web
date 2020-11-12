import React from 'react';
import { Column, Row, Icon, Grid, COLORS, Tooltip, styled } from '@8base/boost';
import Rating from 'react-rating';
import { Paper as BoostPaper } from '../../../shared/components/globals/Paper';
import { Heading } from '../../../shared/components/globals';
import { PlayedSports } from '../../../shared/types';
import { useSportPerformance } from '../../player/hooks/useSportPerformance';
import { usePerformanceDetails } from '../../player/hooks/usePerformanceDetails';

const Paper = styled(BoostPaper)`
  ${(props: {border: string}) => props.border && `border: 4px solid ${props.border};`}
`;

export const SportPerformance: React.FC<Props> = ({ playerId, played }) => {
  const perf = useSportPerformance(playerId, played.id);
  const stats = usePerformanceDetails(playerId, played.id);

  const stars = perf.rating && perf.rating.value ? Math.round(perf.rating.value) : 0;

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
          <Tooltip 
            cursor="pointer"
            message={`${perf.rating?.quantity} votante${perf.rating?.quantity !== 1 ? 's' : ''}`}
            placement="top"
          >
            <Rating
              readonly
              initialRating={stars}
              emptySymbol={<Icon name="BlankStar" size="sm" />}
              fullSymbol={<Icon name="YellowStar" size="sm" />}
            />
          </Tooltip>
        </Row>
        <Grid.Layout
          stretch
          columns="auto"
          areas={[
            ['starter', 'substitute', 'total'],
            ['points', 'assist', 'wins']
          ]}
        >
          <Grid.Box area="starter" direction="column">
            <Heading type="h4" weight="bold" color="#fff">
              Juegos como titular
            </Heading>
            <Heading type="h5" color="#fff">
              {`${stats.data.started}`}
            </Heading>
          </Grid.Box>
          <Grid.Box area="substitute" direction="column">
            <Heading type="h4" weight="bold" color="#fff">
              Juegos como suplente
            </Heading>
            <Heading type="h5" color="#fff">
              {`${stats.data.substitute}`} 
            </Heading>
          </Grid.Box>
          <Grid.Box area="total" direction="column">
            <Heading type="h4" weight="bold" color="#fff">
              Total de partidos jugados
            </Heading>
            <Heading type="h5" color="#fff">
              {`${stats.data.total}`} 
            </Heading>
          </Grid.Box>
          <Grid.Box className="mt-5" area="points" direction="column">
            <Heading type="h4" weight="bold" color="#fff">
              Puntos anotados
            </Heading>
            <Heading type="h5" color="#fff">
              {`${stats.data.points}`}
            </Heading>
          </Grid.Box>
          <Grid.Box className="mt-5" area="assist" direction="column">
            <Heading type="h4" weight="bold" color="#fff">
              Asistencias dadas
            </Heading>
            <Heading type="h5" color="#fff">
              {`${stats.data.points}`}
            </Heading>
          </Grid.Box>
        </Grid.Layout>
      </Column>
    </Paper>
  );
}

type Props = {
  playerId: number,
  played: PlayedSports
}
