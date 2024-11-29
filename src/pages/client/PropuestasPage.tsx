import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Button, Stack, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar, Chip } from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import ShareIcon from '@mui/icons-material/Share';
import BackHandIcon from '@mui/icons-material/BackHand';
import AddIcon from '@mui/icons-material/Add';
import AutoModeSharpIcon from '@mui/icons-material/AutoModeSharp'; // Importa el ícono
import ShareModal from '../../components/ShareModal';// modal de compartir 
import noImage from '../../assets/NoImagen.png';
import { useMediaQuery } from '@mui/material';

interface ServiceDetail {
  id: number;
  name: string;
  image: string | null | false;
  qualification: number;
  description: string;
}

interface Proposal {
  id: number;
  create_date: string;
  name: string;
  written_by: string | false;
  status: string;
  description: string | false;
  close_date: string | null;
}

interface ProposalDetailProps {
  darkMode: boolean;
}

const ProposalDetail: React.FC<ProposalDetailProps> = ({ darkMode }) => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [open, setOpen] = useState(false);
  const [proposalName, setProposalName] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [debateEndDate, setDebateEndDate] = useState('');
  const [deliberationEndDate, setDeliberationEndDate] = useState('');
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);//Modal
  const token = localStorage.getItem('token');


  // Llamar a la API cada 5 segundos
  useEffect(() => {
    const fetchServiceAndProposals = async () => {
      try {
        if (id) {
          const serviceResponse = await fetch(`/services/${id}`);
          const serviceData = await serviceResponse.json();
          if (serviceData.length > 0) {
            setService(serviceData[0]);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error al obtener los detalles del servicio:', error.message);
        } else {
          console.error('Error desconocido al obtener los detalles del servicio:', error);
        }
      }

      try {
        if (id) {
          const proposalsResponse = await fetch(`/proposals/${id}`);
          const proposalsData = await proposalsResponse.json();
          setProposals(proposalsData);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error al obtener propuestas:', error.message);
        } else {
          console.error('Error desconocido al obtener propuestas:', error);
        }
      }
    };

    fetchServiceAndProposals(); // Llamada inicial
    const intervalId = setInterval(fetchServiceAndProposals, 5000); // Llamada cada 5 segundos

    // Limpiar el intervalo al desmontarse
    return () => clearInterval(intervalId);
  }, [id]);

  if (!service) {
    return <p>Cargando detalles del servicio...</p>;
  }



  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
    
  const handleSave = async () => {
    // Verifica que los campos obligatorios no estén vacíos
    if (!proposalName || !proposalDescription || !debateEndDate || !deliberationEndDate) {
      alert('Todos los campos son obligatorios. Por favor, completa toda la información.');
      return; // Detiene el envío de la propuesta si los campos están vacíos
    }
  
    const serviceId = id ? parseInt(id) : null; // Obtén el service_id desde la URL
  
    if (!serviceId) {
      console.error("ID del servicio no encontrado.");
      return;
    }
  
    const newProposalData = {
      params: {
        name: proposalName,
        written_by: token || "", // Token obtenido del localStorage
        description: proposalDescription,
        service_id: serviceId,
        debateEndDate,
        deliberationEndDate,
      },
    };
  
    try {
      const response = await fetch("/proposals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProposalData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Propuesta creada exitosamente:", data);
        // Aquí puedes actualizar la lista de propuestas o mostrar un mensaje de éxito
      } else {
        console.error("Error al crear la propuesta:", response.status, response.statusText);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al realizar la solicitud:", error.message);
      } else {
        console.error("Error al realizar la solicitud:", error);
      }
  
    } finally {
      handleClose(); // Siempre cierra el modal
    }
  };
  

  

  const handleNovedadesClick = () => {
    navigate(`/services/${id}`); // Cambia a una ruta relativa
  };


  const handleRowClick = (proposalId: number) => {
    navigate(`/ProposalDetail/${id}/${proposalId}`); // Incluye el serviceId y el proposalId en la URL
  };


  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <Card style={{ maxHeight: isSmallScreen ? '400px' : '500px', overflowY: 'auto' }}>
            <Box position="relative" width="100%" height="300px">
              <CardMedia
                component="img"
                height={isSmallScreen ? '200' : '300'}
                image={service.image ? `data:image/jpg;base64,${atob(service.image)}` :noImage}
                alt={service.name}
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
                {service.name}
              </Typography>
              <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white', // Asegura que el texto y estrellas sean visibles
                    padding: '5px',
                  }}
                >
                  <Rating
                    name="read-only"
                    value={service.qualification || 0}
                    precision={0.5}
                    readOnly
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ marginLeft: '10px' ,}}
                  >
                    {service.qualification ? service.qualification.toFixed(1) : '0.0'}
                  </Typography>
                </div>

            </Box>

            <CardContent>
              <Typography variant="body2" color="text.secondary" align='left' paddingBottom={'5px'} style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                {service.description || "Sin descripción disponible"}
              </Typography>
            </CardContent>

            <CardContent>
              <Stack spacing={1} direction="row">
                <Button variant="contained" startIcon={<AutoModeSharpIcon/>} style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 8px' : '6px 12px' }}  onClick={handleNovedadesClick}>Novedades</Button>
                <Button variant="contained" startIcon={<GradeIcon />} style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 4px' : '6px 12px' }}onClick={() => navigate(`/services/${id}/reviews`)}>Reseñas</Button>
                <Button variant="contained" startIcon={<BackHandIcon />} style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 8px' : '6px 12px' }}>Propuestas</Button>
                <Button variant="outlined" startIcon={<ShareIcon />} onClick={() => setIsShareModalOpen(true)}> Compartir</Button>
                <Button variant="contained" startIcon={<AddIcon />} style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 8px' : '6px 12px' }}>Seguir</Button>
              </Stack>



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
                  <TextField
                    margin="dense"
                    label="Fin Debate"
                    type="datetime-local"  // Cambiado a "datetime-local"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={debateEndDate}
                    onChange={(e) => setDebateEndDate(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    label="Fin Deliberación"
                    type="datetime-local"  // Cambiado a "datetime-local"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={deliberationEndDate}
                    onChange={(e) => setDeliberationEndDate(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">Cancelar</Button>
                  <Button onClick={handleSave} color="primary">Guardar</Button>
                </DialogActions>
              </Dialog>

            </CardContent>

            <CardContent>
              {proposals.length > 0 && proposals.some((proposal) => proposal.name) ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography variant="subtitle2">Título</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2">Estado</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2">Creado por</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2">Fecha de cierre</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                {proposals.map((proposal) => (
                  <TableRow
                    key={proposal.id}
                    onClick={() => handleRowClick(proposal.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{proposal.name || "Sin título"}</TableCell>
                    <TableCell>
                      <Chip
                        label={proposal.status || "No disponible"}
                        style={{ backgroundColor: '#fdd835', color: '#000' }}
                      />
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar style={{ width: 24, height: 24, marginRight: 8 }} />
                        <span>{proposal.written_by || "Desconocido"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{proposal.close_date || "Sin fecha"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" color="text.secondary" align="center" style={{ padding: '20px' }}>
                  No hay propuestas aún.
                </Typography>
              )}
            </CardContent>

          </Card>
          <Box display="flex" justifyContent="flex-end" alignItems="flex-end" p={0} style={{ overflow: 'hidden' }}>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>Crear Propuesta</Button>
          </Box>

          <ShareModal open={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default ProposalDetail;
