import React, { useState, useEffect } from 'react';
import '../../css/App.css';
import ShareModal from '../../components/ShareModal';//compartir 
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Button, Stack, Rating, useMediaQuery, Dialog, DialogActions, DialogContent, DialogTitle, TextField,IconButton
} from '@mui/material';
import { Grade as GradeIcon, Share as ShareIcon, BackHand as BackHandIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';
import noImage from '../../assets/NoImagen.png';
import StoreIcon from '@mui/icons-material/Store';

interface Novedad {
  id:number,
  name: string;
  description: string;
}

interface ServiceReviewProps {
  id: number;
  name: string;
  image: string | null | false;
  qualification: number;
  description: string;
  novedades: Novedad[];
  access_code: string;
}

interface ServicesProps {
  darkMode: boolean;
}

const MyServicePage: React.FC<ServicesProps> = ({ darkMode }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth0();
  const [service, setService] = useState<ServiceReviewProps>({
    id: 0,
    name: '',
    image: null,
    qualification: 0,
    description: '',
    novedades: [],
    access_code: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);// modal
  const [openModal, setOpenModal] = useState(false);
  const [newnovelty, setNewNovelty] = useState({
    name: '',
    description: '',
  });
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [novelties, setNovelties] = useState<Novedad[]>([]);

  useEffect(() => {
    const idservice = localStorage.getItem('service');
    let isMounted = true;

    fetch(`/myService/${idservice}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Error en la respuesta del servidor');
      })
      .then((responseData) => {
        if (isMounted) {
          if (responseData && responseData.length > 0) {
            setService({
              ...responseData[0],
              novedades: Array.isArray(responseData[0].novedades) ? responseData[0].novedades : [],
            });
          } else {
            console.error('Estructura de datos inesperada:', responseData);
            setError('Estructura de datos inesperada.');
          }
        }
      })
      .catch((error) => {
        console.error('Error al obtener los detalles del servicio:', error);
        setError('Error al obtener los detalles del servicio');
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Función para crear una novedad
  const handleCreateNovelty = () => {
    if (!newnovelty.name || !newnovelty.description) {
      setError('Por favor, complete todos los campos');
      return;
    }

    const idservice = localStorage.getItem('service');
    if (!idservice) {
      console.error('ID del servicio no encontrado');
      setError('ID del servicio no encontrado');
      return;
    }

    const requestBody = {
      params: {
        id_service: idservice,
        name: newnovelty.name,
        description: newnovelty.description,
      },
    };

    // Realizar la solicitud POST para agregar la novedad
    fetch(`/news/create/${idservice}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Error al crear la novedad');
        }
      })
      .then((data) => {
        // Actualizar el estado para reflejar la nueva novedad
        setService((prevService) => ({
          ...prevService,
          novedades: [
            ...prevService.novedades,
            {
              id: Date.now(), // Temporary id based on timestamp
              name: newnovelty.name,
              description: newnovelty.description,
            },
          ],
        }));
        
        
        
        setOpenModal(false);
        // Resetear los campos de novedad
        setNewNovelty({ name: '', description: '' });
        setError(null);
      })
      .catch((error) => {
        console.error('Error al crear la novedad:', error);
        setError('Error al crear la novedad');
      });
  };

  const handleDeleteNovelty = async (id: number) => {
    setLoading(true); // Muestra un indicador de carga si es necesario
    fetch(`/news/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', }
    })
      .then((res) => {
        if (res.ok) {
          // Actualiza las novedades dentro del estado del servicio
          setService((prevService) => ({
            ...prevService,
            novedades: prevService.novedades.filter((novelty) => novelty.id !== id),
          }));
        } else {
          console.error("Error al eliminar la novedad");
        }
      })
      .catch((error) => {
        console.error("Error al realizar la eliminación:", error);
      })
      .finally(() => {
        setLoading(false); // Detén el indicador de carga
      });
  };
  
  return (
    <div className="first-div">
      <div className="second-div">
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
            <StoreIcon style={{ marginRight: '4px' }} />
            <span style={{ fontWeight: 'bold' }}>Mi negocio</span>
          </div>
          <Card
            style={{
              /* maxHeight: isSmallScreen ? '500px' : '600px', */
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            <Box position="relative" width="100%" height={isSmallScreen ? '200px' : '300px'}>
              <CardMedia
                component="img"
                height={isSmallScreen ? '200' : '300'}
                image={
                  service?.image
                    ? `data:image/jpg;base64,${atob(service.image)}`
                    : noImage
                }
                alt={service?.name || 'Servicio'}
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
                }}
              >
                {service?.name || 'Nombre del servicio no disponible'}
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
              <Stack
                spacing={1}
                direction={isSmallScreen ? 'column' : 'row'}
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Stack
                    spacing={2}
                    direction={isSmallScreen ? 'column' : 'row'}
                    justifyContent="flex-start"
                    alignItems="center"
                    width="100%"
                  >
                    <Button
                      variant="contained"
                      startIcon={<GradeIcon />}
                      onClick={() => navigate(`/MyService/${service.id}/reviews`)}
                      fullWidth={isSmallScreen}
                    >
                      Reseñas
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<BackHandIcon />}
                      onClick={() => navigate(`/MyProposals/${service.id}`)}
                      fullWidth={isSmallScreen}
                    >
                      Propuestas
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      onClick={() => setIsShareModalOpen(true)}
                      fullWidth={isSmallScreen}
                    >
                      Compartir
                    </Button>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    marginLeft: '20px',
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    width: isSmallScreen ? '100%' : '300px',
                    backgroundColor: darkMode ? '#333' : '#f9f9f9',
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={darkMode ? 'white' : 'text.primary'}
                  >
                    Código de Acceso
                  </Typography>
                  <Typography variant="body1" color={darkMode ? 'white' : 'text.secondary'}>
                    {service?.access_code ?? 'No disponible'}
                  </Typography>
                </Box>
              </Stack>

              {service?.novedades && Array.isArray(service.novedades) && service.novedades.length > 0 ? (
                <Stack spacing={2} style={{ marginTop: '10px' }}>
                  {service.novedades.map((novedad, index) => (
                    <Card
                      key={novedad.id}
                      style={{
                        padding: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold" style={{ textAlign: 'left' }}>
                              {novedad.name}
                            </Typography>
                            <Typography variant="body2" style={{ textAlign: 'justify' }}>
                              {novedad.description}
                            </Typography>
                          </Box>
                          <IconButton color="error" onClick={() => handleDeleteNovelty(novedad.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" style={{ marginTop: '20px' }}>
                  No hay novedades disponibles
                </Typography>
              )}
            </CardContent>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
              Crear Novedad
            </Button>
          </div>
        </div>
      </div>

      <ShareModal open={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="modal-title">
        <DialogTitle id="modal-title">Crear Novedad</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nombre de la novedad"
            fullWidth
            variant="outlined"
            value={newnovelty.name}
            onChange={(e) => setNewNovelty({ ...newnovelty, name: e.target.value })}
          />
          <TextField
            margin="dense"
            id="description"
            label="Descripción de la novedad"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newnovelty.description}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 100) {
                setNewNovelty({ ...newnovelty, description: value });
              }
            }}
            helperText={`${newnovelty.description.length}/100 caracteres`}
            inputProps={{ maxLength: 100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateNovelty} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyServicePage;