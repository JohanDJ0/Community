import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Button, Stack, Rating } from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import ShareIcon from '@mui/icons-material/Share';
import BackHandIcon from '@mui/icons-material/BackHand';
import AddIcon from '@mui/icons-material/Add';
import { useMediaQuery } from '@mui/material';
import AutoModeSharpIcon from '@mui/icons-material/AutoModeSharp';
import ShareModal from '../../components/ShareModal'; // modal
import noImage from '../../assets/NoImagen.png';
import { followService } from 'components/followService'; // componente que se encarga de seguir a un servicio
import HomeIcon from '@mui/icons-material/Home';
import CheckIcon from '@mui/icons-material/Check';
import { API_BASE_URL } from 'components/bdd';

interface Novedad {
  name: string;
  description: string;
}

interface ServiceDetailProps {
  id: number;
  name: string;
  image: string | null | false;
  qualification: number;
  description: string;
  novedades: Novedad[];
  is_following: boolean;
}

interface ServicesProps {
  darkMode: boolean;
}

const ServiceDetail: React.FC<ServicesProps> = ({ darkMode }) => {
  const token = localStorage.getItem('token');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetailProps | null>(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // modal
  const [isFollowing, setIsFollowing] = useState(false); // Hook para el follow del servicio

  useEffect(() => {
    const dataToken = {
      params: {
        token: token
      }
    }

    let isMounted = true;
    fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToken),
    })
    .then(response => response.json())
    .then((responseData) => {
      if (isMounted) {
        if (responseData.result) {
          console.log(responseData.result)
          setService(responseData.result);
          setIsFollowing(responseData.result.is_following);
        } else {
          console.error('Estructura de datos inesperada:', responseData);
        }
      }
    })
    .catch((error) => {
      console.error('Error al obtener los detalles del servicio:', error);
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!service) {
    return <p>Cargando detalles del servicio...</p>;
  }

  const handleFollow = async () => {
    if (!service) return; // Evita errores si service no está cargado
    // Se creó un nuevo componente que recibe dos parametros, el id y el token
    const success = await followService(service.id, token || '');
    if (success) {
      setIsFollowing(true);
    }
  };

  return (
    <div className="first-div">
      <div className="second-div">
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`} style={{ padding: '16px' }}>
          
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
            <HomeIcon style={{ marginRight: '4px' }} />
            <a onClick={() => navigate("/Services")} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>Inicio</a>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ fontWeight: 'bold' }}>{service.name}</span>
          </div>
  
          {/* Card with Image and Title */}
          <Card style={{ overflowY: 'auto', padding: '0' }}>
            <Box position="relative" width="100%" height={isSmallScreen ? '200px' : '300px'}>
              <CardMedia
                component="img"
                height={isSmallScreen ? '200' : '300'}
                image={service.image ? `data:image/jpg;base64,${atob(service.image)}` : noImage}
                alt={service.name}
                style={{ filter: 'brightness(0.7)' }}
              />
              <Typography
                variant={isSmallScreen ? 'h5' : 'h1'}
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '10px',
                  color: 'white',
                  padding: '5px',
                  fontSize: isSmallScreen ? '1.5rem' : '3rem',
                }}
              >
                {service.name}
              </Typography>
  
              {/* Rating */}
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
  
            {/* Card Content */}
            <CardContent>
              {/* Buttons Layout */}
              <Stack
                spacing={2}
                direction={isSmallScreen ? 'column' : 'row'}
                alignItems="stretch"
                style={{ marginTop: '10px' }}
              >
                <Button
                  variant="contained"
                  startIcon={<GradeIcon />}
                  onClick={() => navigate(`/services/${id}/reviews`)}
                  fullWidth={isSmallScreen}
                >
                  Reseñas
                </Button>
                <Button
                  variant="contained"
                  startIcon={<BackHandIcon />}
                  onClick={() => navigate(`/proposal/${id}`)}
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
                {!isFollowing && (
                  <Button
                    onClick={() => handleFollow()}
                    variant="contained"
                    startIcon={<AddIcon />}
                    fullWidth={isSmallScreen}
                  >
                    Seguir
                  </Button>
                )}
                {isFollowing && (
                  <Typography
                    variant="body1"
                    color="primary"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 600,
                      fontSize: '1rem',
                      marginTop: '8px',
                    }}
                  >
                    <CheckIcon sx={{ marginRight: '8px', fontSize: '1.2rem' }} />
                    Siguiendo
                  </Typography>
                )}
              </Stack>
  
              {/* Description */}
              <Typography
                variant="body2"
                color="text.secondary"
                align="left"
                style={{
                  paddingTop: '15px',
                  paddingBottom: '15px',
                  textAlign: 'justify',
                }}
              >
                {service.description}
              </Typography>
  
              {/* Novedades */}
              {service.novedades && service.novedades.length > 0 ? (
                <Stack spacing={2}>
                  {service.novedades.map((novedad, index) => (
                    <Card key={index} style={{ padding: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
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
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Typography variant="h6" color="text.secondary" align="center" style={{ marginTop: '20px' }}>
                  No hay novedades disponibles en este momento.
                </Typography>
              )}
            </CardContent>
          </Card>
  
          <ShareModal open={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
        </div>
      </div>
    </div>
  );
  
};

export default ServiceDetail;