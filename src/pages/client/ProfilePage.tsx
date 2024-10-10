import React, { useEffect } from 'react';
import '../../css/App.css';
import { useAuth0 } from '@auth0/auth0-react';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

// Agrega 'darkMode' como prop
interface ServicesProps {
  darkMode: boolean;
}

const ProfilePage: React.FC<ServicesProps> = ({ darkMode }) => {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate(); // Hook para navegar entre rutas

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

  // Cambia `false` por `null`
  if (!isAuthenticated) {
    return null; // O podrías redirigir a una página de inicio de sesión
  }

  return (
    <div className="first-div">
      <div className="second-div">
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}> 
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
    </div>
  );
}

export default ProfilePage;
