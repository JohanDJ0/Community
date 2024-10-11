import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { Rating } from '@mui/material'; // Importa el componente Rating
import '../../css/App.css';

// Agrega 'darkMode' como prop
interface ServicesProps {
  darkMode: boolean;
}

const Seguidos: React.FC<ServicesProps> = ({ darkMode }) => {
  // Servicios estáticos
  const serviciosSeguidos = [
    {
      id: 1,
      name: "Ciber1",
      image: "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg", 
      qualification: 4.5,
      description: "Descripción del Servicio A",
    },
    {
      id: 2,
      name: "Cafe Con Pan",
      image: "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg", 
      qualification: 3.8,
      description: "Descripción del Servicio B",
    },
    {
      id: 3,
      name: "Tamales",
      image: "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg", 
      qualification: 5,
      description: "Descripción del Servicio C",
    },
  ];

  return (
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {serviciosSeguidos.map((servicio) => (
              <Card key={servicio.id} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'row' }}>
                <CardMedia
                  component="img"
                  style={{ width: '180px', height: 'auto' }} // Tamaño fijo para la imagen
                  image={servicio.image ? servicio.image : "https://w.wallhaven.cc/full/o5/wallhaven-o5xmv9.jpg"}
                  alt={servicio.name}
                />
                <CardContent style={{ flex: 1, position: 'relative', paddingBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" component="div">
                      {servicio.name}
                    </Typography>
                    <Button 
                      variant="contained" 
                      style={{ backgroundColor: '#2EC6BD', color: 'white' }} 
                    >
                      Dejar de seguir
                    </Button>
                  </div>
                  {/* Usar Rating para mostrar la calificación en estrellas */}
                  <div style={{ marginTop: '10px', textAlign: 'left' }}>
                    <Rating
                      name={`rating-${servicio.id}`} // Asegúrate de que cada Rating tenga un nombre único
                      value={servicio.qualification} // Valor de la calificación
                      precision={0.5} // Precisión para permitir medios puntos
                      readOnly // Para que el Rating sea solo de lectura
                    />
                    <Typography variant="body2" color="text.secondary">
                      Descripción: {servicio.description}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seguidos;
