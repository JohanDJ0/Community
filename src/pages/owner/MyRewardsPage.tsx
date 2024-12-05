import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Modal, Box, TextField, Switch, FormControlLabel } from '@mui/material';
import '../../css/App.css'; // Asegúrate de que este archivo tenga los estilos que necesitas.
import noImage from '../../assets/NoImagen.png';
import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import { Snackbar } from '@mui/material';

interface Reward {
  id: number;
  name: string;
  businessName: string;
  requiredPoints: number;
  imageUrl: string;
}

interface ServicesProps {
  darkMode: boolean;
}

const MyRewardsPage: React.FC<ServicesProps> = ({ darkMode }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const id_service = localStorage.getItem('service');
  const [open, setOpen] = useState<boolean>(false); // Controla si el modal está abierto o cerrado
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para el mensaje de éxito

  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    points_required: 0,
    service_id: id_service || '', // Inicializa con el valor de localStorage
    image: '',
  });


  const isSmallScreen = window.innerWidth < 600; // Ajusta el tamaño de la pantalla según necesites

  useEffect(() => {
    fetch(`/rewards/get/${id_service}`)
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result)) {
          if (result[0].message) {
            console.log("No debería aparecer nada")
          } else {
            console.log("Res: ", result[0].message);
            setRewards(result.map((reward: any) => ({
              id: reward.id,
              name: reward.name,
              businessName: reward.service, // Puedes ajustar este valor según tu lógica
              requiredPoints: reward.points_required,
              imageUrl: reward.image,
            })));
          }
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
    const { name, description, points_required, service_id, image } = newReward;
    console.log("Valores actuales:", { name, description, points_required, service_id, image });
  
    // Verifica que los campos obligatorios estén completos
    if (!name || !description || points_required <= 0 || !service_id) {
      alert('Por favor, complete todos los campos obligatorios.');
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
            active: "True", // El valor se pasa como string "True"
            service_id,
            image: image || null,
          }
        }),
      });
  
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
  
      // Procesa la respuesta
      if (data.result && data.result.success) {
        // Si se crea exitosamente, agrega un placeholder si no hay imagen
        setRewards((prevRewards) => [
          ...prevRewards,
          {
            id: data.result.id,
            name,
            businessName: 'Negocio nuevo',
            requiredPoints: points_required,
            imageUrl: image || noImage, // Usa la imagen cargada o un placeholder
          },
        ]);
        setSuccessMessage(data.result.message || 'Recompensa creada exitosamente.');
        handleClose(); // Cierra el modal
      } else {
        console.error('Error al crear la recompensa:', data.result?.message);
        alert(`Error: ${data.result?.message}`);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Hubo un problema al intentar crear la recompensa. Por favor, inténtalo nuevamente.');
    }
  };
  
  


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert('Por favor selecciona un archivo válido.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      setNewReward((prevState) => ({
        ...prevState,
        image: base64Image, // Actualiza la imagen en Base64
      }));
    };
    reader.readAsDataURL(file);
  };



  const handleDelete = (id: number) => {
    console.log(`Eliminando recompensa con ID: ${id}`);
    fetch(`/rewards/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data)
        if (data.success == true) {
          console.log("Se eliminó la recompensa con éxito"); // Mensaje de éxito
          setRewards((prev) => prev.filter((reward) => reward.id !== id));
        } else {
          console.error("Error al eliminar la recompensa");
        }
      })
      .catch((error) => {
        console.error("Error al eliminar la recompensa:", error.message || "Error desconocido");
      });
  };

  return (
    <div className={`first-div ${darkMode ? 'dark' : 'light'}`}>
      <div className="second-div">
        <div
          className={`box-div ${darkMode ? 'dark' : 'light'}`}
          style={{ position: 'relative', paddingBottom: '60px', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
            <FiberSmartRecordIcon style={{ marginRight: '4px' }} />
            <span style={{ fontWeight: 'bold' }}>Mis recompensas</span>
            {/* <span style={{ margin: '0 8px' }}>/</span>
            <span>Sección</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span>Subsección</span> */}
          </div>
          <div
            style={{
              maxHeight: isSmallScreen ? '400px' : '500px',
              overflowY: 'auto',
              marginBottom: '20px',
            }}
          >
            {rewards.length === 0 ? (
              <p>No tienes recompensas, ¡empieza creando una!</p>
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
                      image={reward.imageUrl || noImage} // Usa la URL de la imagen o un placeholder
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
                        onClick={() => handleDelete(reward.id)} // Reemplaza `reward.id` con el valor que necesitas pasar
                        variant="contained"
                        color="error"
                        style={{ marginTop: '10px' }}
                      >
                        Eliminar
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
            value={newReward.points_required || ''}
            onChange={(e) => {
              const value = parseInt(e.target.value.replace(/^0+/, ''), 10) || 0;
              setNewReward({ ...newReward, points_required: value });
            }}

            margin="normal"
          />

          <div style={{ marginBottom: '10px' }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'block', margin: '10px 0' }}
              onChange={handleImageUpload} // Asegúrate de llamar a la función aquí
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center', // Centra horizontalmente
              alignItems: 'center', // Centra verticalmente dentro del contenedor
              margin: '20px 0', // Espaciado alrededor del Switch
            }}
          >
          </div>
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
      <Snackbar
  open={!!successMessage}  // Solo se muestra si hay un mensaje
  autoHideDuration={3000}  // Duración de 3 segundos
  onClose={() => setSuccessMessage(null)} // Cuando se cierra, limpia el mensaje
  message={successMessage}
/>

    </div>
  );
};

export default MyRewardsPage;
