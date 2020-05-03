import React from 'react';
import { Sport } from '../../shared/types';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

function SportsTable (props: Props) {

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nro</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Icono</TableCell>
          <TableCell>Color</TableCell>
          <TableCell>Creado</TableCell>
          <TableCell>Actualizado</TableCell>
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
            <TableCell>{sport.createdAt}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
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