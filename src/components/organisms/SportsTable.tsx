import React, { useCallback } from 'react';
import { Sport } from '../../shared/types';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableItemActions from '../atoms/TableItemActions';
import DecisionDialog from '../molecules/DecisionDialog';
import { useModal } from '../../shared/hooks';
import { deleteSport } from '../../modules/sport/actions';

function SportsTable (props: Props) {
  const [onDeleteQuestion] =  useModal('Eliminar deporte', DecisionDialog as React.ComponentType, 'xs');
  
  const handleDeleteClick = useCallback((id: number) => {
    onDeleteQuestion({
      text: '¿Está seguro de que desea eliminar este deporte? Una vez realice la operación no podrá deshacerla.',
      onAccept: () => deleteSport(id),
    });
  }, [onDeleteQuestion]);


  return (
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
        {props.items.map((sport, i) => (
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
                onDelete={handleDeleteClick}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface Props {
  items: Array<Sport>,
  count: number,
  loading: boolean
}

export default SportsTable;