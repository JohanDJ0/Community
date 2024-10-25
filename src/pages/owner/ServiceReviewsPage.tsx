import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import GradeIcon from '@mui/icons-material/Grade';
import ShareIcon from '@mui/icons-material/Share';
import BackHandIcon from '@mui/icons-material/BackHand';
import Rating from '@mui/material/Rating';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { useAuth0 } from '@auth0/auth0-react'; // Importar useAuth0
import AddIcon from '@mui/icons-material/Add';

interface Review {
  name: string; // Nombre de la reseña
  description: string; // Comentario
  rating: number; // Calificación
  written_by: string; // Usuario
}

interface ServiceReviewProps {
  id: number;
  name: string; // Nombre del servicio
  image: string | null | false;
  qualification: number;
  reviews: Review[]; // Reseñas
}

interface ServicesProps {
  darkMode: boolean;
}

const ServiceReviewsPage: React.FC<ServicesProps> = ({ darkMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0(); // Obtener el usuario autenticado
  const [service, setService] = useState<ServiceReviewProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState<string | null>(null); // Para almacenar el nombre del servicio
  const [fade, setFade] = useState(false); // Estado para manejar la transición
  const [openModal, setOpenModal] = useState(false);

  const [newReview, setNewReview] = useState<Review>({
    name: '',
    description: '',
    rating: 0,
    written_by: (isAuthenticated && user && user.name) || '',
  });



  const handleCloseModal = () => {
    setOpenModal(false);
    setNewReview({ name: '', description: '', rating: 0, written_by: (isAuthenticated && user && user.name) || '' }); // Resetea el formulario
  };
  const handleOpenModal = () => {
    const token = localStorage.getItem("token"); // Obtener el token del almacenamiento local
    setNewReview({
      name: '',
      description: '',
      rating: 0,
      written_by: token || '', // Asigna el token del usuario autenticado o una cadena vacía
    });
    setOpenModal(true);
  };
  const handleSubmitReview = () => {
    if (!newReview.name || !newReview.description || !newReview.rating) {
      console.error('Todos los campos son obligatorios');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    const reviewData = {
      params: {
        name: newReview.name,
        description: newReview.description,
        rating: newReview.rating,
        written_by: token,
        service_id: id,
      },
    };

    fetch('http://18.117.103.214/reviews/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData), // Cambia esto para reflejar la estructura correcta
    })
      .then(response => response.json())
      .then((data) => {
        if (data.result && data.result.success) {
          console.log("Reseña creada con éxito:", data.result.Message); // Mensaje de éxito
          handleCloseModal(); // Cerrar el modal al crear la reseña con éxito
        } else {
          console.error("Error al crear la reseña:", data.result?.Message || "Error desconocido");
        }
      })
      .catch((error) => {
        console.error("Error al crear la reseña:", error.message || "Error desconocido");
      });
  };





  // Función para obtener reseñas
  const fetchReviews = () => {
    fetch(`http://18.117.103.214/reviews/${id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Error en la respuesta del servidor');
      })
      .then((responseData) => {
        console.log('Datos de la API:', responseData);
        setService(prevService => ({
          ...prevService!,
          reviews: responseData, 
        }));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener las reseñas del servicio:', error);
        setError('No se pudo cargar la información del servicio.');
        setLoading(false);
      });
  };


  // Llama a esta función en el evento correspondiente, por ejemplo, al hacer clic en un botón


  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Obtener las reseñas
    fetch(`http://18.117.103.214/reviews/${id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Error en la respuesta del servidor');
      })
      .then((responseData) => {
        if (isMounted) {
          console.log('Datos de la API:', responseData);
          setService({
            id: Number(id),
            name: serviceName || 'Cargando nombre...', // Asignar un nombre temporal
            image: null, // Imagen temporal
            qualification: 0, // Calificación temporal
            reviews: responseData, // Asignar reseñas directamente
          });
          setLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error('Error al obtener las reseñas del servicio:', error);
          setError('No se pudo cargar la información del servicio.');
          setLoading(false);
        }
      });

    // Obtener los detalles del servicio para obtener el nombre
    fetch(`http://18.117.103.214/services/${id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Error en la respuesta del servidor');
      })
      .then((responseData) => {
        if (isMounted) {
          console.log('Detalles del servicio:', responseData);
          if (responseData && responseData.length > 0) {
            const newServiceName = responseData[0].name; // Asignar el nombre del servicio
            setFade(true); // Activar la transición de desvanecimiento
            setService((prevService) => ({
              id: prevService ? prevService.id : Number(id), // Asegúrate de asignar un id
              name: newServiceName, // Actualiza el nombre del servicio
              image: prevService ? prevService.image : null, // Mantén la imagen anterior o null
              qualification: prevService ? prevService.qualification : 0, // Mantén la calificación anterior o 0
              reviews: prevService ? prevService.reviews : [], // Mantén las reseñas anteriores o un array vacío
            }));
            setServiceName(newServiceName); // Actualiza el estado del nombre del servicio
          } else {
            console.error('Estructura de datos inesperada:', responseData);
          }
        }
      })
      .catch((error) => {
        console.error('Error al obtener los detalles del servicio:', error);
      });

    // Llamar a fetchReviews cada 5 segundos
    const intervalId = setInterval(() => {
      fetchReviews();
    }, 5000);

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleNovedadesClick = () => {
    navigate(`/services/${id}`); // Cambia a una ruta relativa
  };

  const handleCreateReviewClick = () => {
    navigate(`/reviews/create`); // Redirige a la URL para crear una reseña
  };

  // Manejar la transición de desvanecimiento al cargar el nombre
  useEffect(() => {
    if (serviceName) {
      const timer = setTimeout(() => {
        setFade(true); // Cambiar a verdadero cuando hay un nuevo nombre
      }, 0); // Iniciar la transición inmediatamente

      return () => clearTimeout(timer);
    }
  }, [serviceName]);

  if (loading) {
    return <p>Cargando reseñas del servicio...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!service) {
    return <p>No se encontró el servicio.</p>;
  }

  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`} style={{ position: 'relative' }}>
          <Card style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Box position="relative" width="100%" height="300px">
              <CardMedia
                component="img"
                height="300"
                image={service.image ? `data:image/jpg;base64,${atob(service.image)}` : "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg"}
                alt={service.name}
                style={{ filter: 'brightness(0.7)' }}
              />
              <Typography
                variant="h1"
                className={`fade ${fade ? 'fade-in' : ''}`}
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '10px',
                  color: 'white',
                  padding: '5px',
                  transition: 'opacity 1s ease', // Transición para la aparición
                  opacity: fade ? 1 : 0, // Controla la opacidad
                }}
              >
                {serviceName || 'Cargando nombre...'}
              </Typography>
            </Box>

            <CardContent>
              <Stack spacing={2} direction="row">
                <Button variant="contained" startIcon={<GradeIcon />} onClick={handleNovedadesClick}>Novedades</Button>
                <Button variant="contained" startIcon={<GradeIcon />}>Reseñas</Button>
                <Button variant="contained" startIcon={<BackHandIcon />}>Propuestas</Button>
                <Button variant="outlined" startIcon={<ShareIcon />}>Compartir</Button>
                <Button variant="contained" startIcon={<AddIcon />}>Seguir</Button>
              </Stack>

              <Typography variant="h5" align="left" paddingTop="10px">
                Reseñas de usuarios
              </Typography>

              {service.reviews.length > 0 ? (
                service.reviews.map((review, index) => (
                  <Stack key={index} direction="row" alignItems="center" spacing={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review.written_by}
                    </Typography>
                    <Typography variant="body2">
                      {review.description}
                    </Typography>
                    <Rating value={review.rating} readOnly />
                  </Stack>
                ))
              ) : (
                <Typography variant="body2">No hay reseñas disponibles.</Typography>
              )}
            </CardContent>
          </Card>

          {/* Botón Crear Reseña */}
          <Button
            variant="contained"
            onClick={handleOpenModal}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              zIndex: 1,
            }}
          >
            Crear reseña
          </Button>
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Crear Reseña</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Nombre de la reseña"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <TextField
                  label="Descripción"
                  multiline
                  rows={4}
                  value={newReview.description}
                  onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <TextField
                  label="Nombre de Usuario"
          value={user?.name || "Nombre no disponible"} // Mostrar el nombre del usuario
                  disabled // Puedes deshabilitarlo si deseas que el usuario no pueda editarlo
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <Rating
                  name="simple-controlled"
                  value={newReview.rating}
                  onChange={(event, newValue) => {
                    setNewReview({ ...newReview, rating: newValue ?? 0 });
                  }}
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancelar</Button>
              <Button onClick={handleSubmitReview}>Crear Reseña</Button>
            </DialogActions>
          </Dialog>

        </div>
      </div>
    </div>
  );
};

export default ServiceReviewsPage;