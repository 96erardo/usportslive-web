import React from 'react';
import { Card, Row, Loader, Link, COLORS } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import { Column } from '../../../shared/components/globals';
import { Heading } from '../../../shared/components/globals';
import { useCompetitionTeams } from '../../team/hooks/useCompetitionTeams';
import { TeamItem } from '../../team/components/TeamItem';

export const CompetitionTeams: React.FC<Props> = ({ id }) => {
  const { items, count, loading, next } = useCompetitionTeams(id);

  return (
    <Paper className="w-100" background={COLORS.GRAY_70}>
      <Card.Header>
        <Heading type="h2" color="#fff">Equipos</Heading>
      </Card.Header>
      <Card.Body padding="none">
        <Column className="w-100" gap="none" maxHeight={350}>
          {items.map((team, i) => (
            <TeamItem 
              key={team.id}
              index={i}
              team={team}
            />
          ))}
          {loading && 
            <Row className="w-100 py-3" alignItems="center" justifyContent="center">
              <Loader color="PRIMARY" size="sm" />
            </Row>
          }
          {!loading && count === 0 &&
            <Row className="w-100 py-5" alignItems="center" justifyContent="center">
              <Column>
                <Heading align="center" type="h4" color={COLORS.GRAY_50}>
                  Aún no se han agregado equipos en esta competición
                </Heading>
              </Column>
            </Row>
          }
          {!loading && items.length < count &&
            <Row className="w-100 py-3" alignItems="center" justifyContent="center">
              <Link onClick={next}>Cargar más</Link>
            </Row>
          }
        </Column>
      </Card.Body>
    </Paper>
  );
}

type Props = {
  id: number
}