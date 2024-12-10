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
import StoreIcon from '@mui/icons-material/Store';

interface ServiceDetail {
  id: number;
  name: string;
  image: string | null | false;
  qualification: number;
  description: string;
  is_following: boolean;
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
  const [isFollowing, setIsFollowing] = useState(false); // Hook para el follow del servicio

  // Llamar a la API cada 5 segundos
  useEffect(() => {
    const fetchServiceAndProposals = async () => {
      try {
        if (id) {
          const dataToken = {
            params: {
              token: token
            }
          }
          const serviceResponse = await fetch(`/services/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToken),
          });
          const serviceData = await serviceResponse.json();
          if (serviceData.result) {
            setService(serviceData.result);
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
    navigate(`/MyService`); // Cambia a una ruta relativa
  };


  const handleRowClick = (proposalId: number) => {
    navigate(`/ProposalDetail/${id}/${proposalId}/${service.name}`); // Incluye el serviceId y el proposalId en la URL
  };
  return (
  <div className='first-div'>
    <div className='second-div'>
      <div className={`box-div ${darkMode ? 'dark' : 'light'}`} style={{ position: 'relative' }}>
        {/* Encabezado */}
        <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
          <StoreIcon style={{ marginRight: '4px' }} />
          <span onClick={() => navigate(`/MyService`)} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>Mi negocio</span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>{service.name}</span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ fontWeight: 'bold' }}>Propuestas</span>
        </div>

        <Card style={{ overflowY: 'auto' }}>
          {/* Imagen con texto sobrepuesto */}
          <Box position="relative" width="100%" height={isSmallScreen ? '200px' : '300px'}>
            <CardMedia
              component="img"
              height={isSmallScreen ? '200' : '300'}
              image={service.image ? `data:image/jpg;base64,${atob(service.image)}` : noImage}
              alt={service.name}
              className="image-service"
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
                transition: 'opacity 1s ease',
                fontSize: isSmallScreen ? '1.5rem' : '3rem',
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
                color: 'white',
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
                style={{ marginLeft: '10px', fontWeight: 'bold', color: 'white' }}
              >
                {service.qualification ? service.qualification.toFixed(1) : '0.0'}
              </Typography>
            </div>
          </Box>

          <CardContent>
            {/* Botones debajo de la imagen */}
            <Stack spacing={2} direction={isSmallScreen ? 'column' : 'row'} alignItems={isSmallScreen ? 'stretch' : 'center'} sx={{ marginTop: '10px', padding: '10px 0' }}>
              <Button variant="contained" startIcon={<AutoModeSharpIcon />} onClick={handleNovedadesClick} fullWidth={isSmallScreen}>
                Novedades
              </Button>
              <Button variant="contained" startIcon={<GradeIcon />} onClick={() => navigate(`/MyService/${service.id}/reviews`)} fullWidth={isSmallScreen}>
                Reseñas
              </Button>
              <Button variant="outlined" startIcon={<ShareIcon />} onClick={() => setIsShareModalOpen(true)} fullWidth={isSmallScreen}>
                Compartir
              </Button>
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
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={debateEndDate}
                  onChange={(e) => setDebateEndDate(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Fin Deliberación"
                  type="datetime-local"
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
                        style={{ backgroundColor: proposal.status === "Completo" ? '#2EC6BD' : '#fdd835',}}
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
            <Box display="flex" justifyContent="flex-end" alignItems="flex-end" p={0} style={{ overflow: 'hidden' }}>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>Crear Propuesta</Button>
        </Box>
        <ShareModal open={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
        </Card>

        
      </div>
    </div>
  </div>
);

};

export default ProposalDetail;