// Propuestas.tsx
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Paper } from '@mui/material';
import { Link } from 'react-router-dom'; // Importa Link

const Propuestas: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [proposalName, setProposalName] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
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
  // Funciones para abrir y cerrar el modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box>
      {/* Botón para abrir el modal */}
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Crear Propuesta
        </Button>
      </Box>
     {/* Modal para crear una propuesta */}
     <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Crear Nueva Propuesta</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la Propuesta"
            fullWidth
            value={proposalName}
            onChange={(e) => setProposalName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            value={proposalDescription}
            onChange={(e) => setProposalDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancelar</Button>
          <Button onClick={handleClose} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>

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
    </Box>

  );
};

export default Propuestas;
