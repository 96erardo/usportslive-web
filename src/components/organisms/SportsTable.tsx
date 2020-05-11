import React, { useCallback } from 'react';
import { Sport } from '../../shared/types';
import Table from '@material-ui/core/Table';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableItemActions from '../atoms/TableItemActions';
import DecisionDialog from '../molecules/DecisionDialog';
import SportForm from '../organisms/SportForm';
import { useModal } from '../../shared/hooks';
import { deleteSport } from '../../modules/sport/actions';

function SportsTable (props: Props) {
  const { open: onDeleteQuestion } =  useModal('Eliminar deporte', DecisionDialog as React.ComponentType, 'xs');
  const { open: onUpdateClick, close: onCloseUpdate } = useModal('Editar deporte', SportForm as React.ComponentType, 'xs');

  const handleDeleteClick = useCallback((id: number) => {
    onDeleteQuestion({
      text: '¿Está seguro de que desea eliminar este deporte? Una vez realice la operación no podrá deshacerla.',
      onAccept: () => deleteSport(id).then(props.refresh),
    });
  }, [props.refresh, onDeleteQuestion]);

  const handleUpdateClick = useCallback((id: number) => {
    onUpdateClick({
      sport: props.items.find(sport => sport.id === id),
      onDone: () => {
        onCloseUpdate();
        props.refresh();
      },
      onCancel: onCloseUpdate,
    });
  }, [props, onUpdateClick, onCloseUpdate]);

  return (
    <div>
      
      <Table>
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
          {!props.loading &&
            props.items.map((sport, i) => (
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
      {props.loading &&
        <Box p={1}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Box key={value} mb={1}>
              <Skeleton height={50} animation="wave" />
            </Box>
          ))}
        </Box>
      }
    </div>
  );
}

interface Props {
  items: Array<Sport>,
  count: number,
  loading: boolean,
  refresh(): void,
}

export default SportsTable;