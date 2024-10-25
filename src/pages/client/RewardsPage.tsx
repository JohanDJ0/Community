import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useMediaQuery } from '@mui/material'; // Importar el hook useMediaQuery
import '../../css/App.css'; // Asegúrate de que este archivo tenga los estilos que necesitas.

interface Reward {
  id: number;
  name: string;
  businessName: string;
  requiredPoints: number;
  userPoints: number; // Puntos que tiene el usuario
  imageUrl: string; // URL de la imagen de la recompensa
}

interface ServicesProps {
  darkMode: boolean;
}

const Rewards: React.FC<ServicesProps> = ({ darkMode }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Verificar si la pantalla es menor a 600px

  useEffect(() => {
    // Datos de recompensas de ejemplo
    const defaultRewards: Reward[] = [
      {
        id: 1,
        name: 'Descuento del 20%',
        businessName: 'Negocio 1',
        requiredPoints: 100,
        userPoints: 120, // Cambia esto para probar diferentes estados
        imageUrl: 'https://juegosmoda2049.neocities.org/images.jpg', // URL de la imagen
      },
      {
        id: 2,
        name: 'Cupón de regalo',
        businessName: 'Negocio 2',
        requiredPoints: 200,
        userPoints: 80, // Cambia esto para probar diferentes estados
        imageUrl: 'https://juegosmoda2049.neocities.org/images.jpg', // URL de la imagen
      },
      {
        id: 3,
        name: 'Producto gratis',
        businessName: 'Negocio 3',
        requiredPoints: 150,
        userPoints: 150, // Cambia esto para probar diferentes estados
        imageUrl: 'https://juegosmoda2049.neocities.org/images.jpg', // URL de la imagen
      },
      {
        id: 4,
        name: 'Acceso VIP',
        businessName: 'Negocio 4',
        requiredPoints: 300,
        userPoints: 250, // Cambia esto para probar diferentes estados
        imageUrl: 'https://juegosmoda2049.neocities.org/images.jpg', // URL de la imagen
      },
    ];

    setRewards(defaultRewards);
  }, []);

  return (
    <div className={`first-div ${darkMode ? 'dark' : 'light'}`}>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            margin: '10px 0',
            maxHeight: isSmallScreen ? '400px' : '500px', // Ajusta maxHeight según el tamaño de la pantalla
            overflowY: 'auto' // Asegúrate de permitir el desplazamiento si el contenido excede el maxHeight
          }}>
            {rewards.length === 0 ? (
              <p>Cargando recompensas...</p>
            ) : (
              rewards.map((reward) => (
                <Card
                  key={reward.id}
                  style={{
                    margin: '10px',
                    width: '250px', // Reducido el ancho
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="150" // Reducido el alto de la imagen
                    image={reward.imageUrl}
                    alt={reward.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{reward.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Negocio: {reward.businessName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Puntos requeridos: {reward.requiredPoints}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tus puntos: {reward.userPoints}
                    </Typography>
                    <Button
                      variant="contained"
                      color={reward.userPoints >= reward.requiredPoints ? 'primary' : 'secondary'}
                      style={{ marginTop: '10px' }}
                    >
                      {reward.userPoints >= reward.requiredPoints ? 'Canjear' : 'Puntos insuficientes'}
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
