import React from 'react';
import { Loader, Row, Link, COLORS } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import { Heading, Column } from '../../../shared/components/globals';
import { usePlayerTeams } from '../../player/hooks/usePlayerTeams';
import { TeamItem } from './TeamItem';

export const PlayerTeams: React.FC<Props> = ({ playerId }) => {
  const { items, count, loading, next } = usePlayerTeams(playerId);

  if (loading && items.length === 0) {
    return (
      <Paper className="w-100" background={COLORS.BLACK}>
        <Row className="w-100" justifyContent="center">
          <Loader size="md" color="primary" />
        </Row>
      </Paper>
    );
  }

  return (
    <Paper 
      className="w-100" 
      background={COLORS.BLACK}
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
  playerId: number
}