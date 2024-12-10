import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import '../../css/App.css';
import logo from '../../assets/Logo.png';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import noImage from '../../assets/NoImagen.png';
import { Snackbar, Alert } from '@mui/material';
import { API_BASE_URL } from 'components/bdd';
import { useTranslation } from 'react-i18next';

interface Reward {
  id: number;
  name: string;
  description: string;
  businessName: string;
  requiredPoints: number;
  userPoints: number;
  imageUrl: string;
}

interface ServicesProps {
  darkMode: boolean;
}

const Rewards: React.FC<ServicesProps> = ({ darkMode }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [availablePoints, setAvailablePoints] = useState(0);
  const token = localStorage.getItem('token');
  const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para abrir el Snackbar
  const [message, setMessage] = useState(''); // Estado para el mensaje a mostrar
  const { t, i18n } = useTranslation("Rewards");

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/myRewards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            params: {
              token,
            },
          }),
        });
    
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`);
        }
    
        const data = await response.json();
        //console.log('Datos recibidos:', data); // Verifica la respuesta del servidor
    
        if (data.result && Array.isArray(data.result.data)) {
          const mappedRewards = data.result.data.map((reward: any) => ({
            id: reward.id,
            name: reward.name,
            description: reward.description || 'Negocio desconocido',
            businessName: reward.service,
            requiredPoints: reward.points_required,
            userPoints: availablePoints, // Sustituir con los puntos reales del usuario
            imageUrl: reward.image, // URL genérica
          }));
    
          setRewards(mappedRewards);
          setAvailablePoints(data.result.community_points); // Asignar puntos disponibles
        } else {
          console.error('La estructura de los datos no es la esperada:', data.result);
        }
      } catch (error) {
        console.error('Error al obtener recompensas:', error);
      }
    };
    
  
    fetchRewards();
  }, [token, availablePoints]);

  const handleCanjear = (id: number) => {
    console.log(`Canjeando recompensa con ID: ${id}`);
    fetch(`${API_BASE_URL}/myRewards/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ params: { token: token, reward_id: id } }),
    })
    .then(response => response.json())
    .then((data) => {
      if (data.result) {
        //console.log("Se canjeó con exito la recompensa:", data.result);
        setRewards((prev) => prev.filter((reward) => reward.id !== id));
        setAvailablePoints(prevPoints => prevPoints - data.result.community_points);
        setMessage('¡Recompensa canjeada con éxito! Se notificará al dueño del negocio.');
        setOpenSnackbar(true);
      } else {
        console.error("Error al canjear la recompensa:", data.result || "Error desconocido");
      }
    })
    .catch((error) => {
      console.error("Error al canjear la recompensa:", error.message || "Error desconocido");
    });
  };
  
  return (
    <div className={`first-div ${darkMode ? 'dark' : 'light'}`}>
      <div className="second-div">
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Primer div con el ícono y el texto */}
              <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
                <EmojiEventsIcon style={{ marginRight: '4px' }} />
                <span style={{ fontWeight: 'bold' }}>{t("Rewards")}</span>
              </div>

              {/* Segundo div con el logo y puntos */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  overflowY: 'auto', // Solo scroll vertical
                }}
              >
                <Typography 
                    variant="h6" 
                    color="textPrimary"
                    sx={{ 
                      display: { xs: 'none', sm: 'block' } // Oculta en pantallas pequeñas (xs), muestra en pantallas mayores (sm en adelante)
                    }}
                  >
                    {t("CommunityPoints")}
                </Typography>
                <img
                  src={logo}
                  alt="logo"
                  style={{
                    width: '30px',
                    height: '30px',
                  }}
                />
                <Typography variant="h6" color="textSecondary">
                  {availablePoints}
                </Typography>
              </div>
            </div>


          <div
         style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          gap: '10px',
          
          overflowY: 'auto', /* Scroll vertical */
          overflowX: 'hidden', /* Evitar scroll horizontal */
          padding: '10px',
          boxSizing: 'border-box',
        }}
          >
            {rewards.length === 0 ? (
              <p> {t("Message")}.</p>
            ) : (
              rewards.map((reward) => (
                <Card
                  key={reward.id}
                  style={{
                    margin: '5px',
                    width: '250px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="150"
                    image={reward.imageUrl ? `data:image/jpeg;base64,${atob(reward.imageUrl)}`: noImage}
                    alt={reward.name}
                  />
                  
                  <CardContent>
                    <Typography variant="h6">{reward.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reward.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      De: {reward.businessName}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                      Puntos requeridos: {reward.requiredPoints}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tus puntos: {reward.userPoints}
                    </Typography> */}
                    <Typography variant="body2" color="text.secondary">
                      {reward.userPoints} / {reward.requiredPoints}
                    </Typography>
                    <Button
                      variant="contained"
                      color={reward.userPoints >= reward.requiredPoints ? 'primary' : 'secondary'}
                      style={{ marginTop: '10px' }}
                      disabled={reward.userPoints < reward.requiredPoints} // Desactiva el botón si los puntos son insuficientes
                      onClick={() => {
                        if (reward.userPoints >= reward.requiredPoints) {
                          handleCanjear(reward.id); // Llama al método con el parámetro (por ejemplo, reward.id)
                        }
                      }}
                    >
                      {reward.userPoints >= reward.requiredPoints
                        ? t("Redeem")
                        : t("Insufficientpoints")}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      <Snackbar
      open={openSnackbar}
      autoHideDuration={6000} // Tiempo que durará visible el Snackbar
      onClose={() => setOpenSnackbar(false)} // Cierra el Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Centra el Snackbar en la parte superior
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Rewards;
