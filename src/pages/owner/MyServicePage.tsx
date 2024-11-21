import React, { useState, useEffect } from 'react';
import '../../css/App.css';
import ShareModal from '../../components/ShareModal';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardMedia, CardContent, Typography, Box, Button, Stack, Rating, 
  useMediaQuery, Dialog, DialogActions, DialogContent, DialogTitle, TextField 
} from '@mui/material';
import { Grade as GradeIcon, Share as ShareIcon, BackHand as BackHandIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';

interface Novedad {
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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [newnovelty, setNewNovelty] = useState({
    name: '',
    description: '',
  });
  const isSmallScreen = useMediaQuery('(max-width:600px)');

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
          novedades: [...prevService.novedades, { name: newnovelty.name, description: newnovelty.description }],
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

  return (
    <div className="first-div">
    <div className="second-div">
      <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
        <Card
          style={{
            maxHeight: isSmallScreen ? '400px' : '500px',
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
                  : "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg"
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
              <Rating name="read-only" value={service?.qualification || 0} readOnly size={isSmallScreen ? 'small' : 'large'} />
            </Typography>
          </Box>
  
          <CardContent>
            <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
                  <Button variant="contained" startIcon={<GradeIcon />} onClick={() => navigate(`/services/${id}/reviews`)}>
                    Reseñas
                  </Button>
                  <Button variant="contained" startIcon={<BackHandIcon />} onClick={() => navigate(`/propuestas`)}>
                    Propuestas
                  </Button>
                  <Button variant="outlined" startIcon={<ShareIcon />} onClick={() => setIsShareModalOpen(true)}>
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
                  width: '300px',
                  backgroundColor: darkMode ? '#333' : '#f9f9f9',
                }}
              >
                <Typography variant="h6" fontWeight="bold" color={darkMode ? 'white' : 'text.primary'}>
                  Código de Acceso
                </Typography>
                <Typography variant="body1" color={darkMode ? 'white' : 'text.secondary'}>
                  {service?.access_code ?? 'No disponible'}
                </Typography>
              </Box>
            </Stack>
  
            {service?.novedades && Array.isArray(service.novedades) && service.novedades.length > 0 ? (
              <Stack spacing={2} style={{ marginTop: '20px' }}>
                <Typography variant="h6">Novedades</Typography>
                {service.novedades.map((novedad, index) => (
                  <Box key={index} style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
                    <Typography variant="body1" fontWeight="bold" style={{ textAlign: 'left' }}>
                      {novedad.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ textAlign: 'left' }}>
                      {novedad.description}
                    </Typography>
                  </Box>
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
          onChange={(e) => setNewNovelty({ ...newnovelty, description: e.target.value })}
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