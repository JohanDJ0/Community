import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import '../../css/App.css'; // Asegúrate de que este archivo tenga los estilos que necesitas.

interface Reward {
  id: number;
  name: string;
  businessName: string;
  requiredPoints: number;
  isActive: boolean; // Estado de activación de la recompensa
  imageUrl: string; // URL de la imagen de la recompensa
}

interface ServicesProps {
  darkMode: boolean;
}

const MyRewardsPage: React.FC<ServicesProps> = ({ darkMode }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const isSmallScreen = window.innerWidth < 600; // Ajusta el tamaño de la pantalla según necesites

  useEffect(() => {
    // Datos de recompensas de ejemplo
    const defaultRewards: Reward[] = [
      {
        id: 1,
        name: 'Descuento del 20%',
        businessName: 'Negocio 1',
        requiredPoints: 100,
        isActive: true,
        imageUrl: 'https://via.placeholder.com/200x150?text=Descuento+20%',
      },
      {
        id: 2,
        name: 'Cupón de regalo',
        businessName: 'Negocio 2',
        requiredPoints: 200,
        isActive: false,
        imageUrl: 'https://via.placeholder.com/200x150?text=Cupón+de+Regalo',
      },
      {
        id: 3,
        name: 'Producto gratis',
        businessName: 'Negocio 3',
        requiredPoints: 150,
        isActive: true,
        imageUrl: 'https://via.placeholder.com/200x150?text=Producto+Gratis',
      },
      {
        id: 4,
        name: 'Acceso VIP',
        businessName: 'Negocio 4',
        requiredPoints: 300,
        isActive: false,
        imageUrl: 'https://via.placeholder.com/200x150?text=Acceso+VIP',
      },
      {
        id: 5,
        name: 'Descuento del 30%',
        businessName: 'Negocio 5',
        requiredPoints: 250,
        isActive: true,
        imageUrl: 'https://via.placeholder.com/200x150?text=Descuento+30%',
      },
      {
        id: 6,
        name: 'Bono de regalo',
        businessName: 'Negocio 6',
        requiredPoints: 150,
        isActive: true,
        imageUrl: 'https://via.placeholder.com/200x150?text=Bono+de+Regalo',
      },
    ];

    setRewards(defaultRewards);
  }, []);

  return (
    <div className={`first-div ${darkMode ? 'dark' : 'light'}`}>
      <div className='second-div'>
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
                      image={reward.imageUrl}
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
          >
            Crear Nueva Recompensa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyRewardsPage;
