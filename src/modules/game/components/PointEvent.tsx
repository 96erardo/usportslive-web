import React, { useCallback, useContext } from 'react';
import { Grid, Text, Icon, Row, useModal, COLORS, styled } from '@8base/boost';
import { Point } from '../../../shared/types';
import { GameContext } from '../contexts/GameContext';
import { modalId as pointModalId } from '../../point/components/PointFormDialog';
import { useAuthStore } from '../../auth/auth-store';

const Layout = styled(Grid.Layout)`
  width: 100%;
`;

const Box = styled(Grid.Box)`
${(props: { clickable: boolean }) => props.clickable && `
    cursor: pointer;
    &:hover {
      background-color: ${COLORS.GRAY_70};
    }
  `}
`;

const PointEvent: React.FC<Props> = ({ point }) => {
  const { openModal } = useModal(`score-${pointModalId}`);
  const user = useAuthStore(state => state.user);
  const game = useContext(GameContext);

  const handleClick = useCallback(() => {
    if (user && user.roleId > 1 && ((game && game.isLive) || user.roleId === 4)) {
      const [assist] = point.assists ? point.assists : [];
  
      openModal(`score-${pointModalId}`, {
        id: point.id,
        minute: point.minute,
        status: point.status,
        gameId: point.gameId,
        teamId: point.teamId,
        scorerId: point.personId,
        assisterId: assist ? assist.personId : null,
      })
    }
  }, [user, game, point, openModal]);

  if (!game)
    return null;

  const clickable = user && user.roleId > 1 && (game.isLive || user.roleId === 4);

  return (
    <Layout inline alignItems="start" columns="50% 50%">
      <Box clickable={clickable && point.teamId === game.localId} className="px-4 py-2" direction="row" alignItems="start" justifyContent="flex-end">
        {point.teamId === game.localId &&
          <Row alignItems="center" gap="md" onClick={handleClick}>
            <Text color="WHITE">
              {point.person?.name} {point.person?.lastname}
            </Text>
            <Icon 
              name={point.status === 'VALID' ? "Planet" : "Delete"}
              color={point.status === 'VALID' ? "WHITE" : "DANGER"}
              size="sm"
            />
            <Text color="WHITE">
              min. {point.minute}
            </Text>
          </Row>
        }
      </Box>
      <Box clickable={clickable && point.teamId === game.visitorId} className="px-4 py-2" direction="row" alignItems="start" justifyContent="flex-start">
        {point.teamId === game.visitorId &&
          <Row alignItems="center" gap="md" onClick={handleClick}>
            <Text color="WHITE">
              min. {point.minute}
            </Text>
            <Icon 
              name={point.status === 'VALID' ? "Planet" : "Delete"}
              color={point.status === 'VALID' ? "WHITE" : "DANGER"}
              size="sm"
            />
            <Text color="WHITE">
              {point.person?.name} {point.person?.lastname}
            </Text>
          </Row>
        }
      </Box>
    </Layout>
  );
}

type Props = {
  point: Point,
}

export default PointEvent;