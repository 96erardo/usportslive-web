import React, { useState, useCallback } from 'react';
import { ITEMS_PER_PAGE } from '../../../shared/constants';
import { useDispatch } from 'react-redux';
import { Sport, PaginatedListState, AppDispatch } from '../../../shared/types';
import Table from '@material-ui/core/Table';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableItemActions from '../../../shared/components/utilities/TableItemActions';
import DeleteDialog from '../../../shared/components/globals/DeleteDialog';
import SportForm from './SportForm';
import Pagination from '../../../shared/components/utilities/Pagination';
import { useModal, useSubscription } from '../../../shared/hooks';
import { onErrorMixin } from '../../../shared/mixins';
import { useSports } from '../sport-hooks';
import { deleteSport } from '../sport-actions';
import { useSnackbar } from 'notistack';

function SportsTable (props: Props) {
  const [page, setPage] = useState(1);
  const dispatch: AppDispatch = useDispatch();
  const { items, count, loading, refresh }: PaginatedListState<Sport> = useSports(page);
  const { enqueueSnackbar: pushSnack } = useSnackbar();
  const { open: openDelete, close: closeDelete } =  useModal('Eliminar deporte', DeleteDialog as React.ComponentType, 'xs');
  const { open: openUpdate, close: closeUpdate } = useModal('Editar deporte', SportForm as React.ComponentType, 'xs');

  const refreshTable = useCallback(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      refresh();
    }
  }, [page, refresh]);

  useSubscription('sport', 'createSport', 'success', () => {
    refreshTable();
  });

  useSubscription('sport', 'updateSport', 'success', () => {
    closeUpdate();
    refreshTable();
  });

  useSubscription('sport', 'deleteSport', 'success', () => {
    refreshTable();
    closeDelete();
    pushSnack('Deporte eliminado correctamente', { variant: 'success' });
  });

  useSubscription('sport', 'deleteSport', 'error', onErrorMixin);

  const handleDeleteClick = useCallback((id: number) => {
    openDelete({
      text: '¿Está seguro de que desea eliminar este deporte? Una vez realice la operación no podrá deshacerla.',
      onAccept: () => dispatch(deleteSport(id))
    });
  }, [dispatch, openDelete]);

  const handleUpdateClick = useCallback((id: number) => {
    openUpdate({
      sport: items.find(sport => sport.id === id),
      onCancel: closeUpdate,
    });
  }, [items, openUpdate, closeUpdate]);

  return (
    <div>      
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nro</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Icono</TableCell>
            <TableCell>Color</TableCell>
            <TableCell>Equipo Oficial</TableCell>
            <TableCell>Creado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading &&
            items.map((sport, i) => (
              <TableRow key={sport.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{sport.name}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  {sport.team ? sport.team.id : 'No asignado'}
                </TableCell>
                <TableCell>{sport.createdAt}</TableCell>
                <TableCell>
                  <TableItemActions 
                    id={sport.id}
                    onUpdate={handleUpdateClick}
                    onDelete={handleDeleteClick}
                  />
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      {loading &&
        <Box p={1}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <Box key={value} mb={1}>
              <Skeleton height={52} animation="wave" />
            </Box>
          ))}
        </Box>
      }
      <Box py={2}>
        <Pagination
          page={page}
          defaultPage={1}
          disabled={loading}
          onChange={(_, number) => setPage(number)}
          count={Math.ceil(count/ITEMS_PER_PAGE)}
          color="primary"
        />
      </Box>
    </div>
  );
}

type Props = {};

export default SportsTable;