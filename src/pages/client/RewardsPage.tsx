import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import '../../css/App.css';
import logo from '../../assets/Logo.png';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import noImage from '../../assets/NoImagen.png';

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

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await fetch('/myRewards', {
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
        console.log('Datos recibidos:', data); // Verifica la respuesta del servidor
    
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
  
  return (
    <div className={`first-div ${darkMode ? 'dark' : 'light'}`}>
      <div className="second-div">
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  {/* Primer div con el ícono y el texto */}
  <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingBottom: '10px' }}>
    <EmojiEventsIcon style={{ marginRight: '4px' }} />
    <span style={{ fontWeight: 'bold' }}>Recompensas</span>
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
    <Typography variant="h6" color="textPrimary">
      Tus Puntos Community
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
          maxHeight: isSmallScreen ? '400px' : '500px', /* Control de altura */
          overflowY: 'auto', /* Scroll vertical */
          overflowX: 'hidden', /* Evitar scroll horizontal */
          padding: '10px',
          boxSizing: 'border-box',
        }}
          >
            {rewards.length === 0 ? (
              <p>Cargando recompensas...</p>
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
                    >
                      {reward.userPoints >= reward.requiredPoints
                        ? 'Canjear'
                        : 'Puntos insuficientes'}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
