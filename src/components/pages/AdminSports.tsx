import React from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import SportsTable from '../organisms/SportsTable';
import { useSports } from '../../modules/sport/hooks';
import { PaginatedListState, Sport } from '../../shared/types';

function AdminSports () {
  const {items, count, loading }: PaginatedListState<Sport> = useSports();

  return (
    <Box p={3}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h4">
            Deportes
          </Typography>
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