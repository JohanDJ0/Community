import React, { useEffect, useState } from 'react';
import '../../css/App.css';
import { useAuth0 } from '@auth0/auth0-react';
import Avatar from '@mui/material/Avatar';
import { Stack, Modal, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

function ProfilePage() {
  const { user, isAuthenticated } = useAuth0();
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Mostrar el modal si el usuario ingresa con el botón de "Sign up"
  useEffect(() => {
    const isSignUp = localStorage.getItem('isSignUp') === 'true';

    if (isSignUp) {
      setOpenModal(true);
      localStorage.removeItem('isSignUp'); // Eliminar la bandera después de mostrar el modal
    }
  }, []);

  // Enviar datos a la base de datos cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      const sendUserData = async () => {
        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              picture: user.picture,
              sub: user.sub, // ID único del usuario proporcionado por Auth0
            }),
          });

          if (!response.ok) {
            throw new Error('Error al enviar los datos');
          }

          console.log('Datos del usuario enviados con éxito');
        } catch (error) {
          console.error('Error al enviar los datos del usuario:', error);
        }
      };

      sendUserData();
    }
  }, [isAuthenticated, user]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleNavigateToCrearService = () => {
    handleCloseModal(); // Cierra el modal antes de redirigir
    navigate('/CrearService'); // Redirigir a la página de Crear Service
  };

  return (
    isAuthenticated && (
      <div className="first-div">
        <div className="second-div">
          <div className="box-div">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={user?.picture} sx={{ width: 200, height: 200 }} />
              <Stack direction="column" spacing={1}>
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
                <p>ID del Usuario: {user?.sub}</p> {/* Mostrar el ID del usuario */}
              </Stack>
            </Stack>
          </div>
        </div>

        {/* Modal para seleccionar rol */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              height: '100vh',
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
              Seleccionar Rol
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleNavigateToCrearService}>
                Dueño de un negocio
              </Button>
              <Button variant="contained" onClick={handleCloseModal}>
                Cliente
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    )
  );
}

export default ProfilePage;
