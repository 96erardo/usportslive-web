import React from 'react';
import { Loader, Row, Column as BoostColumn, Text, Link, COLORS } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import { Heading, Column } from '../../../shared/components/globals';
import { usePlayerTeams } from '../../player/hooks/usePlayerTeams';
import { TeamItem } from './TeamItem';
import { Person as Player } from '../../../shared/types';
import sad from '../../../shared/assets/images/sad_error.png';

export const PlayerTeams: React.FC<Props> = ({ player }) => {
  const { items, count, loading, next } = usePlayerTeams(player.id);

  if (loading) {
    return (
      <Paper className="w-100" background={COLORS.GRAY_70}>
        <div className="w-100 p-4 border-bottom">
          <Heading type="h2" weight="bold" color="#fff">
            Equipos
          </Heading>
        </div>
        <Row className="w-100 py-4" justifyContent="center">
          <Loader size="sm" color="PRIMARY" />
        </Row>
      </Paper>
    );
  }

  if (items.length === 0) {
    return (
      <Paper className="w-100" background={COLORS.GRAY_70}>
        <div className="w-100 p-4 border-bottom">
          <Heading type="h2" weight="bold" color="#fff">
            Equipos
          </Heading>
        </div>
        <BoostColumn 
          className="w-100 p-4"
          alignItems="center" 
          justifyContent="center"
          gap="md"
        >
          <Text color="WHITE" weight="bold" align="center">
            Parece que {player.name} no ha participado en ningún equipo
          </Text>
          <img alt="Sad Emoji" src={sad} width={50} />
        </BoostColumn>
      </Paper>
    );
  }

  return (
    <Paper 
      className="w-100" 
      background={COLORS.GRAY_70}
    >
      <div className="w-100 p-4 border-bottom">
        <Heading type="h2" weight="bold" color="#fff">
          Equipos
        </Heading>
      </div>
      {loading ? (
        <Row className="w-100 py-4" justifyContent="center">
          <Loader size="sm" color="PRIMARY" />
        </Row>
      ) : (
        <Column 
          maxHeight={400} 
          className="w-100" 
          gap="none"
        >
          {items.map((team, index) => (
            <TeamItem 
              key={team.id}
              index={index} 
              team={team} 
            />
          ))}
          {items.length < count &&
            <Row className="w-100 p-2" justifyContent="center">
              {loading ? (
                <Loader size="sm" color="PRIMARY" />
              ) : (
                <Link text="Más" onClick={next} />
              )}
            </Row>
          }
        </Column>
      )}
    </Paper>
  );
}

type Props = {
  player: Player
}