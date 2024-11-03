import React, { useState, useEffect } from 'react';
import '../../css/App.css';
import ShareModal from '../../components/ShareModal'; // Importa el componente

import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Button, Stack, Rating, useMediaQuery } from '@mui/material';
import { Grade as GradeIcon, Share as ShareIcon, BackHand as BackHandIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';

interface Review {
  name: string;
  description: string;
  rating: number;
  written_by: string;
}

interface ServiceReviewProps {
  id: number;
  name: string;
  image: string | null | false;
  qualification: number;
  reviews: Review[];
  description?: string;
  novedades?: { name: string; description: string }[];
}

interface ServicesProps {
  darkMode: boolean;
}

const MyServicePage: React.FC<ServicesProps> = ({ darkMode }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth0();
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [service, setService] = useState<ServiceReviewProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // Estado para el modal
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const serviceCode = localStorage.getItem('service');
    setAccessCode(serviceCode);
    // Simular la carga del servicio
    setService({
      id: parseInt(id || '0'),
      name: 'Nombre del Servicio',
      image: null,
      qualification: 4,
      reviews: [],
      description: 'Descripción del servicio aquí.',
      novedades: [{ name: 'Novedad 1', description: 'Detalles de la novedad 1.' }]
    });
    setLoading(false);
  }, [id]);

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <Card style={{ maxHeight: isSmallScreen ? '400px' : '500px', overflowY: 'auto' }}>
            <Box position="relative" width="100%" height={isSmallScreen ? '200px' : '300px'}>
              {service && (
                <CardMedia
                  component="img"
                  height={isSmallScreen ? '200' : '300'}
                  image={service.image ? `data:image/jpg;base64,${service.image}` : "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg"}
                  alt={service.name}
                  className='image-service'
                  style={{ filter: 'brightness(0.7)' }}
                />
              )}
              <Typography
                variant={isSmallScreen ? "h5" : "h4"}
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '10px',
                  color: 'white',
                  padding: '5px',
                }}
              >
                {service ? service.name : "Cargando..."}
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
                {service && <Rating name="read-only" value={service.qualification} readOnly />}
              </Typography>
            </Box>

            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Stack spacing={1} direction="row">
                  <Button 
                    variant="contained" 
                    startIcon={<GradeIcon />} 
                    style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem' }}
                  >
                    Novedades
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<GradeIcon />}
                    onClick={() => navigate(`/services/${id}/reviews`)}
                    style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem' }}
                  >
                    Reseñas
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<BackHandIcon />} 
                    style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem' }}
                  >
                    Propuestas
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<ShareIcon />} 
                    onClick={() => setIsShareModalOpen(true)} // Abre el modal al hacer clic
                    style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem' }}
                  >
                    Compartir
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem' }}
                  >
                    Seguir
                  </Button>
                </Stack>
                <Box marginLeft="20px">
                  <Card style={{ padding: '50px', minWidth: '150px', width: '250px' }}>
                    <Typography variant="h6" fontWeight="bold">Código de Acceso</Typography>
                    <Typography variant="body1">{accessCode ?? 'No disponible'}</Typography>
                  </Card>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" align='left' paddingBottom={'5px'}>
                Descripción: {service?.description ?? "No hay descripción disponible."}
              </Typography>

              <Typography align='left' paddingTop={'10px'}>
                {service?.novedades && service.novedades.length > 0 ? (
                  service.novedades.map((novedad, index) => (
                    <div key={index}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {novedad.name}
                      </Typography>
                      <Typography variant="body2">
                        {novedad.description}
                      </Typography>
                    </div>
                  ))
                ) : (
                  <Typography variant="body2">No hay novedades disponibles.</Typography>
                )}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Modal para compartir */}
      <ShareModal open={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
};

export default MyServicePage;
