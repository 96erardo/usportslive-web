import React, { useState, useMemo, useCallback } from 'react';
import { Dropdown, Button, Paper, SelectField, Grid, DateInputField, Icon, Link, Row } from '@8base/boost';
import { FilterData } from '../../competition-actions';
import { useAppStore } from '../../../app/app-store';

const CompetitionFilter: React.FC<Props> = ({ initialValues = {}, onFilter }) => {
  const sports = useAppStore(state => state.sports);
  const [isOpen, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterData>(initialValues);

  const options = useMemo(() => sports.map(sport => ({
    label: sport.name,
    value: sport.id.toString(),
  })), [sports])

  const icon = isOpen ? 'BlueFilter' : 'BlackFilter';

  const onSportChange = useCallback((value) => {
    setFilters(state => ({
      ...state,
      sport: value ? value : undefined,
    }))
  }, []);

  const onStartAfterChange = useCallback((value) => {
    setFilters(state => ({
      ...state,
      startsAfter: value ? value : undefined,
    }))
  }, []);
  
  const onStartBeforeChange = useCallback((value) => {
    setFilters(state => ({
      ...state,
      startsBefore: value ? value : undefined,
    }))
  }, []);

  const applyFilters = useCallback(() => {
    onFilter(filters);

    setOpen(false);
  }, [filters, onFilter]);

  return (
    <Dropdown isOpen={isOpen}>
      <Dropdown.Head>
        <Button squared color="neutral" size="sm" onClick={() => setOpen(state => !state)}>
          <Icon name={icon} size="md"/>
        </Button>
      </Dropdown.Head>
      <Dropdown.Body background="white" closeOnClickOutside={true}>
        <Paper padding="md">
          <Grid.Layout 
            columns="auto"
            gap="md"
            areas={[
              ['sport', 'sport'],
              ['starts-after', 'starts-before'],
              ['actions', 'actions']
            ]}
          >
            <Grid.Box area="sport">
              <SelectField
                stretch
                label="Deporte"
                placeholder="Elige un deporte"
                options={options}
                input={{
                  name: 'sport',
                  value: filters?.sport,
                  onChange: onSportChange,
                }}
                clearable={true}
              />
            </Grid.Box>
            <Grid.Box area="starts-after">
              <DateInputField 
                label="Empieza despues de"
                name="startsAfter"
                input={{
                  value: filters.startsAfter,
                  onChange: onStartAfterChange,
                  placeholder: 'Elige una fecha'
                }}
              />
            </Grid.Box>
            <Grid.Box area="starts-before">
              <DateInputField 
                label="Empieza despues de"
                name="startsBefore"
                input={{
                  value: filters.startsBefore,
                  onChange: onStartBeforeChange,
                  placeholder: 'Elige una fecha'
                }}
              />
            </Grid.Box>
            <Grid.Box area="actions">
              <Row stretch gap="md" alignItems="center" justifyContent="end">
                <Link color="BLACK" onClick={() => setOpen(false)}>
                  Cancelar
                </Link>
                <Link onClick={applyFilters}>
                  Aplicar filtros
                </Link>
              </Row>
            </Grid.Box>
          </Grid.Layout>
        </Paper>
      </Dropdown.Body>
    </Dropdown>
  );
};

type Props = {
  initialValues: FilterData,
  onFilter: (filters: FilterData) => void
}

export default CompetitionFilter;