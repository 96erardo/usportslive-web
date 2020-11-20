import React from 'react';
import { 
  Card,
  Row, 
  Column, 
  Heading as BoostHeading, 
  COLORS, 
  Loader,
  styled 
} from '@8base/boost';
import { PointFormDialog } from '../../point/components/PointFormDialog';
import { Paper } from '../../../shared/components/globals/Paper';
import { useLiveScore } from '../hooks/useLiveScore';
import { Avatar } from '../../../shared/components/globals';
import GameEvents from './GameEvents';
import { Game } from '../../../shared/types';

const Body = styled(Card.Body)`
  & > *:not(:last-child) {
    border-bottom: 2px solid #495661 !important;
  }
`;

const Events = styled(Column)`
  height: 200px;
  max-height: 400px;
  overflow: auto;
`;

const Heading = styled(BoostHeading)`
  ${({ color }: { color: string }) => color && `color: ${color};`}
`;

const LiveScore: React.FC<Props> = ({ game }) => {
  const { local, visitor, loading } = useLiveScore(game);

  if (loading) {
    return (
      <Paper stretch background={COLORS.GRAY_70}>
        <Row className="p-4" alignItems="center" justifyContent="center">
          <Loader size="md" color="WHITE" />
        </Row>
      </Paper>
    );
  }

  if (!local || !visitor) {
    return null;
  }

  return (
    <Paper stretch background={COLORS.GRAY_70}>
      <Body padding="none">
        <Row stretch className="py-4" alignItems="center" justifyContent="center" gap="md">
          <Avatar 
            src={local.logo?.url}
            firstName={local?.name[0]}
            lastName={local?.name[1]}
          />
          <Heading type="h1" color={COLORS.WHITE}>  
            {local?.points?.length} : {visitor?.points?.length}
          </Heading>
          <Avatar 
            src={visitor.logo?.url}
            firstName={visitor?.name[0]}
            lastName={visitor?.name[1]}
          />
        </Row>
        <Events 
          className="py-4"
          stretch
          gap="sm" 
          alignItems="start" 
        >
          <GameEvents gameId={game.id} />
        </Events>
      </Body>
      <PointFormDialog id="score" />
    </Paper>
  );
}

type Props = {
  game: Game,
}

export default LiveScore;