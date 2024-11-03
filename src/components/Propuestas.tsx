// Propuestas.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom'; // Importa Link

const Propuestas: React.FC = () => {
  // Datos de ejemplo para la tabla
  const data = [
    {
      id: 1, // Agregar un identificador único
      title: "Propuesta servicios",
      status: "In progress",
      createdBy: "Juan",
      reviewer: "Dueño",
      lastUpdate: "03/02/2024, 1:49 pm",
    },
    {
      id: 2, // Agregar un identificador único
      title: "Estacionamiento",
      status: "In progress",
      createdBy: "Pedro",
      reviewer: "Dueño",
      lastUpdate: "03/02/2024, 1:49 pm",
    },
    // Puedes agregar más elementos si es necesario
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="subtitle2">Título</Typography></TableCell>
            <TableCell><Typography variant="subtitle2">Estado</Typography></TableCell>
            <TableCell><Typography variant="subtitle2">Creado por</Typography></TableCell>
            <TableCell><Typography variant="subtitle2">Revisores</Typography></TableCell>
            <TableCell><Typography variant="subtitle2">Actualizado</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} component={Link} to={`/proposal/${row.id}`} style={{ textDecoration: 'none' }}>
              <TableCell>{row.title}</TableCell>
              <TableCell>
                <Chip label={row.status} style={{ backgroundColor: '#fdd835', color: '#000' }} />
              </TableCell>
              <TableCell>
                <Avatar style={{ width: 24, height: 24, marginRight: 8 }} />
                {row.createdBy}
              </TableCell>
              <TableCell>
                <Chip label={row.reviewer} variant="outlined" />
              </TableCell>
              <TableCell>{row.lastUpdate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Propuestas;
