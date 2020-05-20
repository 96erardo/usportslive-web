import React, { useCallback } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import SportForm from './SportForm';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Typography } from '@material-ui/core';
import SportsTable from './SportsTable';
import { useModal, useSubscription } from '../../../shared/hooks';
import { Sport } from '../../../shared/types';

function AdminSports () {
  const { open, close } = useModal("Crear deporte", SportForm as React.ComponentType, 'xs');

  const handleOpen = useCallback(() => open({ onCancel: close }), [open, close]);
  
  useSubscription<Sport>('sport', 'createSport', 'success', close);

  return (
    <Box p={3}>
      <Card variant="outlined">
        <CardContent>
          <Grid container alignItems="center" justify="space-between">
            <Typography variant="h4">
              Deportes
            </Typography>
            <IconButton onClick={handleOpen} aria-label="add sport" color="primary">
              <AddBoxIcon />
            </IconButton>
          </Grid>
        </CardContent>
        <SportsTable />
      </Card>
    </Box>
  );
}

export default AdminSports;