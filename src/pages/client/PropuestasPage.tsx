import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, Stack, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Paper } from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import ShareIcon from '@mui/icons-material/Share';
import BackHandIcon from '@mui/icons-material/BackHand';
import AddIcon from '@mui/icons-material/Add';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';

interface ProposalsProps {
  darkMode: boolean;
}

const ProposalDetail: React.FC<ProposalsProps> = ({ darkMode }) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [open, setOpen] = useState(false);
  const [proposalName, setProposalName] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');

  // Datos de ejemplo para la tabla
  const data = [
    {
      id: 1,
      title: "Propuesta servicios",
      status: "In progress",
      createdBy: "Juan",
      reviewer: "Dueño",
      lastUpdate: "03/02/2024, 1:49 pm",
    },
    {
      id: 2,
      title: "Estacionamiento",
      status: "In progress",
      createdBy: "Pedro",
      reviewer: "Dueño",
      lastUpdate: "03/02/2024, 1:49 pm",
    },
  ];

  // Funciones para abrir y cerrar el modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <Card style={{ maxHeight: isSmallScreen ? '400px' : '500px', overflowY: 'auto' }}>
            <Box position="relative" width="100%" height={isSmallScreen ? '200px' : '300px'}>
              <CardMedia
                component="img"
                height={isSmallScreen ? '200' : '300'}
                image="https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg"
                alt="Nombre de la Propuesta"
                className='image-service'
                style={{ filter: 'brightness(0.7)' }}
              />
              <Typography
                variant={isSmallScreen ? "h5" : "h1"}
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '10px',
                  color: 'white',
                  padding: '5px',
                }}
              >
                Nombre de la Propuesta
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  color: 'white',
                  padding: '5px',
                }}
              >
                <Rating name="read-only" value={4.5} readOnly />
              </Typography>
            </Box>

            <CardContent>
              <Stack spacing={1} direction="row">
                <Button
                  variant="contained"
                  startIcon={<GradeIcon />}
                  style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 8px' : '6px 12px' }}
                >
                  Novedades
                </Button>
                <Button
                  variant="contained"
                  startIcon={<BackHandIcon />}
                  style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 8px' : '6px 12px' }}
                >
                  Reseñas
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 8px' : '6px 12px' }}
                >
                  Compartir
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 8px' : '6px 12px' }}
                >
                  Seguir
                </Button>
              </Stack>
              <Typography variant="body2" color="text.secondary" align='left' paddingBottom={'5px'}>
                Descripción: Descripción breve de la propuesta.
              </Typography>

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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProposalDetail;
