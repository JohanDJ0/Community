import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import GradeIcon from '@mui/icons-material/Grade';
import ShareIcon from '@mui/icons-material/Share';
import BackHandIcon from '@mui/icons-material/BackHand';
import Rating from '@mui/material/Rating';

interface Novedad {
  name: string;
  description: string;
}

interface ServiceDetailProps {
  id: number;
  name: string;
  image: string | null | false;  // Permitir que la imagen sea null o false
  qualification: number;
  description: string;
  novedades: Novedad[];
}
// Agrega 'darkMode' como prop
interface ServicesProps {
  darkMode: boolean;
}

const ServiceDetail: React.FC<ServicesProps> = ({ darkMode }) =>  {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceDetailProps | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`http://18.117.103.214/services/${id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Error en la respuesta del servidor');
      })
      .then((responseData) => {
        if (isMounted) {
          console.log('Datos recibidos:', responseData);  // Log de los datos

          if (responseData && responseData.length > 0) {
            setService(responseData[0]);  // Acceder al primer elemento en el array "responseData"
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
      <div className='second-div' >
      <div className={`box-div ${darkMode ? 'dark' : 'light'}`}> 
          <Card style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Box position="relative" width="100%" height="300px">
              <CardMedia
                component="img"
                height="300"
                image={service.image ? `data:image/jpg;base64,${atob(service.image)}` : "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg"}
                alt={service.name}
                className='image-service'
                style={{ filter: 'brightness(0.7)' }}
              />
              <Typography
                variant="h1"
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

            {/* Contenido desplazable de la tarjeta */}
            <CardContent>
              <Typography variant="body2" color="text.secondary" align='left' paddingBottom={'5px'}>
                Descripción: {service.description}
              </Typography>

              <Stack spacing={2} direction="row">
                <Button variant="contained" startIcon={<GradeIcon />}>Novedades</Button>
                <Button variant="contained" startIcon={<GradeIcon />}>Reseñas</Button>
                <Button variant="contained" startIcon={<BackHandIcon />}>Propuestas</Button>
                <Button variant="outlined" startIcon={<ShareIcon />}>Compartir</Button>
              </Stack>
              

              <Typography align='left' paddingTop={'10px'}>
                {/* Aquí se muestran las novedades */}
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
