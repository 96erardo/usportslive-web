import React, { useCallback, useContext } from 'react';
import { Grid, Row, Text, Icon, COLORS, styled, useModal } from '@8base/boost';
import { GameContext } from '../contexts/GameContext';
import { PersonPlaysGame } from '../../../shared/types';
import { modalId } from '../../team/components/UpdateSubMinuteDialog';
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

const SubstitutionEvent: React.FC<Props> = ({ substitution }) => {
  const { openModal } = useModal(`live-score-${modalId}`);
  const user = useAuthStore(state => state.user);
  const game = useContext(GameContext);
  const { person } = substitution;

  const handleClick = useCallback(() => {
    if (user && user.roleId > 1 && ((game && game.isLive) || user.roleId === 4)) { 
      openModal(`live-score-${modalId}`, {
        game: substitution.gameId,
        team: substitution.teamId,
        player: substitution.personId,
        minute: substitution.type === 'in' ? substitution.inMinute : substitution.outMinute,
        type: substitution.type === 'in' ? 'inMinute' : 'outMinute',
      });
    }
  }, [user, game, substitution, openModal]);

  if (!game)
    return null;

  const clickable = user && user.roleId > 1 && (game.isLive || user.roleId === 4);

  return (
    <Layout inline columns="50% 50%">
      <Box clickable={clickable && substitution.teamId === game.localId} className="px-4 py-2" direction="row" alignItems="start" justifyContent="flex-end">
        {substitution.teamId === game.localId &&
          <Row alignItems="center" gap="md" onClick={handleClick}>
            <Text color="WHITE">
              {person?.name} {person?.lastname}
            </Text>
            <Icon 
              name={substitution.type === 'in' ? "ChevronTop" : "ChevronDown"}
              color={substitution.type === 'in' ? "SUCCESS" : "DANGER"}
              size="sm"
            />
            <Text color="WHITE">
              min. {substitution.type === 'in' ? substitution.inMinute : substitution.outMinute}
            </Text>
          </Row>
        }
      </Box>
      <Box clickable={clickable && substitution.teamId === game.visitorId} className="px-4 py-2" direction="row" alignItems="start" justifyContent="flex-start">
        {substitution.teamId === game.visitorId &&
          <Row alignItems="center" gap="md" onClick={handleClick}>
            <Text color="WHITE">
              {person?.name} {person?.lastname}
            </Text>
            <Icon 
              name={substitution.type === 'in' ? "ChevronTop" : "ChevronDown"}
              color={substitution.type === 'in' ? "SUCCESS" : "DANGER"}
              size="sm"
            />
            <Text color="WHITE">
              min. {substitution.type === 'in' ? substitution.inMinute : substitution.outMinute}
            </Text>
          </Row>
        }        
      </Box>
    </Layout>
  );
}

type Props = {
  substitution: PersonPlaysGame,
}

export default SubstitutionEvent;