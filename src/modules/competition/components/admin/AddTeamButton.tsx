import React, { useCallback, useState } from 'react';
import { Button } from '@8base/boost';
import SportTeamSelector from '../../../sport/components/admin/SportTeamSelector';
import { Team } from '../../../../shared/types';
import { addTeamInCompetition } from '../../competition-actions';
import { onError } from '../../../../shared/mixins';
import { toast } from 'react-toastify';

const AddTeamButton: React.FC<Props> = ({ competitionId, sportId, afterMutation }) => {
  const [loading, setLoading] = useState(false);

  const handleSelect = useCallback(async (team: Team) => {
    setLoading(true);
    
    const [err] = await addTeamInCompetition(competitionId, team.id);
    
    setLoading(false);

    if (err) {
      return onError(err);
    }

    afterMutation();

    toast.success('Equipo agregado correctamente');
  }, [competitionId, afterMutation]);

  return (
    <SportTeamSelector id="add" stretch={false} onSelect={handleSelect}>
      {open => (
        <Button color="neutral" loading={loading} onClick={() => open({ sport: sportId })}>
          Agregar Equipo
        </Button>
      )}
    </SportTeamSelector>
  );
}

type Props = {
  competitionId: number,
  sportId: number,
  afterMutation: () => Promise<void>,
}

export default AddTeamButton;