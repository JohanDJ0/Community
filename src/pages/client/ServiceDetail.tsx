import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Button, Stack, Rating } from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import ShareIcon from '@mui/icons-material/Share';
import BackHandIcon from '@mui/icons-material/BackHand';
import AddIcon from '@mui/icons-material/Add';
import { useMediaQuery } from '@mui/material';

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
}

interface ServicesProps {
  darkMode: boolean;
}

const ServiceDetail: React.FC<ServicesProps> = ({ darkMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetailProps | null>(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isExtraSmallScreen = useMediaQuery('(max-width:375px)');

  useEffect(() => {
    let isMounted = true;
    fetch(`/services/${id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Error en la respuesta del servidor');
      })
      .then((responseData) => {
        if (isMounted) {
          if (responseData && responseData.length > 0) {
            setService(responseData[0]);
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

  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <Card style={{ maxHeight: isSmallScreen ? '400px' : '500px', overflowY: 'auto' }}>
            <Box position="relative" width="100%" height={isSmallScreen ? '200px' : '300px'}>
              <CardMedia
                component="img"
                height="300"
                image={service.image ? `data:image/jpg;base64,${atob(service.image)}` : "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg"}
                alt={service.name}
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
                <Rating name="read-only" value={service.qualification} readOnly />
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
                  startIcon={<GradeIcon />}
                  onClick={() => navigate(`/services/${id}/reviews`)}
                  style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 4px' : '6px 12px' }}
                >
                  Reseñas
                </Button>
                <Button
                  variant="contained"
                  startIcon={<BackHandIcon />}
                  onClick={() => navigate(`/proposal/${id}`)}

                  style={{ fontSize: isSmallScreen ? '0.7rem' : '0.9rem', padding: isSmallScreen ? '4px 8px' : '6px 12px' }}
                >
                  Propuestas
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
                Descripción: {service.description}
              </Typography>

              <Typography align='left' paddingTop={'10px'}>
                {service.novedades && service.novedades.length > 0 ? (
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
    </div>
  );
}

export default ServiceDetail;
