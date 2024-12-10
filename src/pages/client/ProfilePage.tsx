import React, { useEffect, useState } from 'react';
import '../../css/App.css';
import { useAuth0 } from '@auth0/auth0-react';
import Avatar from '@mui/material/Avatar';
import { Stack, Box, useMediaQuery, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from 'components/bdd';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';

interface ServicesProps {
  darkMode: boolean;
}

const ProfilePage: React.FC<ServicesProps> = ({ darkMode }) => {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const { t, i18n } = useTranslation("MiPerfil");
  const [roleMessage, setRoleMessage] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('rol') || ''; // Garantiza que role sea siempre una cadena
    const roleMessages: Record<string, string> = {
        employee: t("employee"),
        client: t("user"),
        owner: t("owner"),
    };

    setRoleMessage(roleMessages[role] || t("desconocido"));

    if (isAuthenticated && user) {
      const sendUserData = async () => {                       
        try {
          const response = await fetch(`${API_BASE_URL}/api/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              picture: user.picture,
              sub: user.sub,
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="first-div" >
      <div className="second-div-2">
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`} style={{ textAlign: 'center', padding: isSmallScreen ? '10px' : '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
            <PersonIcon style={{ marginRight: '4px' }} />
            <span style={{ fontWeight: 'bold' }}>{t("bradCrumb")}</span>
            {/* <span style={{ margin: '0 8px' }}>/</span>
            <span>Sección</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span>Subsección</span> */}
          </div>
          <Stack direction="column" spacing={2} alignItems="center">
            <Avatar
              src={user?.picture}
              sx={{
                width: isSmallScreen ? 100 : 200,
                height: isSmallScreen ? 100 : 200,
              }}
            />
            <Box>
              <h2 style={{ fontSize: isSmallScreen ? '1.5rem' : '2rem' }}>{user?.name}</h2>
              <p style={{ fontSize: isSmallScreen ? '1rem' : '1.25rem' }}>{user?.email}</p>
              {/* <p style={{ fontSize: isSmallScreen ? '0.9rem' : '1rem' }}>ID del Usuario: {user?.sub}</p> */}
            </Box>

            <Typography variant="h6" color="text.primary">
              {roleMessage}
            </Typography>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
