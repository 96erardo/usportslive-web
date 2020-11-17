import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Heading } from '../../../shared/components/globals';
import { Competition } from '../../../shared/types';

export const CompetitionItem: React.FC<Props> = ({ competition }) => {
  const history = useHistory();

  const onClick = useCallback(() => {
    history.push(`/competition/${competition.id}`);
  }, [history, competition]);

  return (
    <div className="w-100 p-3 list-item" onClick={onClick}>
      <Heading type="h4" color="#fff" weight="bold">
        {competition.name}
      </Heading>
    </div>
  );
}

type Props = {
  competition: Competition
}