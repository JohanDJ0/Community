import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Modal, Box, TextField } from '@mui/material';
import '../../css/App.css'; // Asegúrate de que este archivo tenga los estilos que necesitas.
import noImage from '../../assets/NoImagen.png';

interface Reward {
  id: number;
  name: string;
  businessName: string;
  requiredPoints: number;
  isActive: boolean;
  imageUrl: string;
}

interface ServicesProps {
  darkMode: boolean;
}

const MyRewardsPage: React.FC<ServicesProps> = ({ darkMode }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const id_service = localStorage.getItem('service');
  const [open, setOpen] = useState<boolean>(false); // Controla si el modal está abierto o cerrado
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    points_required: 0,
    service_id: '', // Inicializa service_id como cadena vacía
  });

  const isSmallScreen = window.innerWidth < 600; // Ajusta el tamaño de la pantalla según necesites

  useEffect(() => {
    fetch(`/rewards/get/${id_service}`)
    .then((res) => res.json())
    .then((result) => {
      if (Array.isArray(result)) {
        setRewards(result.map((reward: any) => ({
          id: reward.id,
          name: reward.name,
          businessName: reward.service, // Puedes ajustar este valor según tu lógica
          requiredPoints: reward.points_required,
          isActive: reward.is_active,
          imageUrl: reward.image,
        })));
      } else {
        console.error("Formato de datos inesperado:", result);
      }
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });

  }, []);

  // Función para obtener las recompensas del negocio
  const fetchRewards = async (idservice: string) => {
    try {
      const response = await fetch(`/redeem/get/${idservice}`);
      const data = await response.json();
      console.log('Recompensas obtenidas:', data);

      if (data.result) {
        // Actualizamos el estado de las recompensas
        setRewards(data.result.map((reward: any) => ({
          id: reward.id,
          name: reward.name,
          businessName: 'Negocio Ejemplo', // Puedes ajustar este valor según tu lógica
          requiredPoints: reward.points_required,
          isActive: true,
          imageUrl: 'https://via.placeholder.com/200x150?text=Recompensa', // Imagen placeholder
        })));
      } else {
        alert('No se encontraron recompensas para este negocio.');
      }
    } catch (error) {
      console.error('Error al obtener las recompensas:', error);
      alert('Hubo un problema al intentar obtener las recompensas. Por favor, inténtalo nuevamente.');
    }
  };

  // Función para abrir el modal
  const handleOpen = () => setOpen(true);

  // Función para cerrar el modal
  const handleClose = () => setOpen(false);

  // Función para manejar el cambio de valores en el formulario
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewReward({
      ...newReward,
      [event.target.name]: event.target.value,
    });
  };

  // Función para crear una nueva recompensa
  const handleCreateReward = async () => {
    const { name, description, points_required, service_id } = newReward;
    console.log('Service ID al crear recompensa:', service_id);  // Verifica el ID en el momento de enviar la solicitud
  
    // Verifica que todos los campos estén completos antes de hacer la solicitud
    if (!name || !description || points_required <= 0 || !service_id) {
      alert('Por favor, complete todos los campos.');
      return;
    }
  
    try {
      const response = await fetch('/rewards/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          params: {
            name,
            description,
            points_required,
            active: true,
            service_id,  // Enviamos el id del servicio aquí
          },
        }),
      });
  
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
  
      if (data.result && data.result.success) {
        // Si la recompensa es creada correctamente, actualizamos la lista de recompensas
        setRewards((prevRewards) => [
          ...prevRewards,
          {
            id: data.result.id,
            name,
            businessName: 'Negocio nuevo',
            requiredPoints: points_required,
            isActive: true,
            imageUrl: 'https://via.placeholder.com/200x150?text=Nuevo+Producto',
          },
        ]);
        alert(data.result.message);
        handleClose();
      } else {
        console.error('Error en la creación de la recompensa:', data.result.message || 'Mensaje no disponible');
        alert(`Error: ${data.result.message || 'Mensaje no disponible'}`);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Hubo un problema al intentar crear la recompensa. Por favor, inténtalo nuevamente.');
    }
  };

  return (
    <div className={`first-div ${darkMode ? 'dark' : 'light'}`}>
      <div className="second-div">
        <div
          className={`box-div ${darkMode ? 'dark' : 'light'}`}
          style={{ position: 'relative', paddingBottom: '60px', overflow: 'hidden' }}
        >
          <div
            style={{
              maxHeight: isSmallScreen ? '400px' : '500px',
              overflowY: 'auto',
              marginBottom: '20px',
            }}
          >
            {rewards.length === 0 ? (
              <p>Cargando recompensas...</p>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-around',
                }}
              >
                {rewards.map((reward) => (
                  <Card
                    key={reward.id}
                    style={{
                      margin: '10px',
                      width: '200px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="120"
                      image={reward.imageUrl ? `data:image/jpeg;base64,${atob(reward.imageUrl)}` : noImage}
                      alt={reward.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{reward.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Negocio: {reward.businessName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Puntos necesarios: {reward.requiredPoints}
                      </Typography>
                      <Button
                        variant="contained"
                        color={reward.isActive ? 'primary' : 'secondary'}
                        style={{ marginTop: '10px' }}
                      >
                        {reward.isActive ? 'Activo' : 'No Activo'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Botón Crear Nueva Recompensa */}
          <Button
            variant="contained"
            color="primary"
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
            }}
            onClick={handleOpen}
          >
            Crear Nueva Recompensa
          </Button>
        </div>
      </div>

      {/* Modal para crear nueva recompensa */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 400,
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Crear Nueva Recompensa
          </Typography>
          <TextField
            label="Nombre"
            name="name"
            fullWidth
            value={newReward.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Descripción"
            name="description"
            fullWidth
            value={newReward.description}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Puntos Requeridos"
            name="points_required"
            type="number"
            fullWidth
            value={newReward.points_required}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateReward}
            fullWidth
            style={{ marginTop: '20px' }}
          >
            Crear Recompensa
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default MyRewardsPage;
