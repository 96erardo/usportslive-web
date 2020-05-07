import React, { useCallback } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import SportForm from '../organisms/SportForm';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Typography } from '@material-ui/core';
import SportsTable from '../organisms/SportsTable';
import { useSports } from '../../modules/sport/hooks';
import { PaginatedListState, Sport, AppDispatch } from '../../shared/types';
import { openAppModal, closeAppModal } from '../../redux/actions/app';
import { useDispatch } from 'react-redux';

function AdminSports () {
  const {items, count, loading }: PaginatedListState<Sport> = useSports();
  const dispatch: AppDispatch = useDispatch();

  const handleDone = useCallback(() => {
    dispatch(closeAppModal());
  }, [dispatch]);

  const openForm = useCallback(() => {
    dispatch(openAppModal("Crear deporte", SportForm as React.ComponentType, {
      onDone: handleDone,
      onCancel: () => dispatch(closeAppModal())
    }, 'xs'));
  }, [dispatch, handleDone]);

  return (
    <Box p={3}>
      <Card variant="outlined">
        <CardContent>
          <Grid container alignItems="center" justify="space-between">
            <Typography variant="h4">
              Deportes
            </Typography>
            <IconButton onClick={openForm} aria-label="add sport" color="primary">
              <AddBoxIcon />
            </IconButton>
          </Grid>
        </CardContent>
        <SportsTable 
          items={items}
          count={count}
          loading={loading}
        />
      </Card>
    </Box>
  );
}

export default AdminSports;