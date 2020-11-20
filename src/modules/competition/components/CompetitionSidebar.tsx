import React, { useEffect } from 'react';
import { Card, Loader, Row, Link, COLORS } from '@8base/boost';
import { useCompetitionStatus } from '../hooks/useCompetitionStatus';
import { Paper } from '../../../shared/components/globals/Paper';
import { Column, Heading } from '../../../shared/components/globals';
import { CompetitionItem } from '../../competition/components/CompetitionItem';
import { onError } from '../../../shared/mixins';

export const CompetitionSidebar: React.FC<Props> = ({ title, type }) => {
  const { items, count, loading, error, next } = useCompetitionStatus(type);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error]);

  return (
    <Paper maxHeight={350} className="w-100 py-3" background={COLORS.GRAY_70}>  
      <div className="px-4 mb-3">
        <Heading type="h2" fontWeight="600" color="#fff">
          {title}
        </Heading>
      </div>
      <Card.Body padding="none">
        <Column className="w-100" gap="none">
          {items.map(competition => (
            <CompetitionItem key={competition.id} competition={competition} />
          ))}
        </Column>
        {loading &&
          <Row className="w-100 p-3" alignItems="center" justifyContent="center">
            <Loader size="sm" color="PRIMARY" />
          </Row>
        }
        {!loading && items.length < count &&
          <Row className="w-100 p-3" alignItems="center" justifyContent="center">
            <Link color="PRIMARY" onClick={next}>
              Cargar más
            </Link>
          </Row>
        }
      </Card.Body>
    </Paper>
  );
}

type Props = {
  title: string,
  type: 'SOON' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELED'
}