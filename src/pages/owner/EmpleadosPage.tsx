import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

interface Employee {
  id: number;
  name: string;
  age: number;
  email: string;
  photo: string; // Suponiendo que la foto es una URL o una cadena base64
}

interface ServicesProps {
  darkMode: boolean;
}

const EmpleadosPage: React.FC<ServicesProps> = ({ darkMode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Datos de empleados de ejemplo
    const defaultEmployees: Employee[] = [
      {
        id: 1,
        name: 'Juan Pérez',
        age: 30,
        email: 'juan.perez@example.com',
        photo: 'https://w.wallhaven.cc/full/3k/wallhaven-3kg1wd.jpg', 
      },
      {
        id: 2,
        name: 'María López',
        age: 25,
        email: 'maria.lopez@example.com',
        photo: 'https://w.wallhaven.cc/full/vg/wallhaven-vgk1l3.png', 
      },
      {
        id: 3,
        name: 'Carlos García',
        age: 35,
        email: 'carlos.garcia@example.com',
        photo: 'https://w.wallhaven.cc/full/rd/wallhaven-rdqk5j.jpg', 
      },
      {
        id: 4,
        name: 'Ana Torres',
        age: 28,
        email: 'ana.torres@example.com',
        photo: 'https://w.wallhaven.cc/full/47/wallhaven-472zgo.png', 
      },
    ];

    setEmployees(defaultEmployees);
  }, []);

  return (
    <div className={`first-div ${darkMode ? 'dark' : 'light'}`}>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}>
          <h2>Vista de Empleados</h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            margin: '10px 0',
          }}>
            {employees.length === 0 ? (
              <p>Cargando empleados...</p>
            ) : (
              employees.map((employee) => (
                <Card
                  key={employee.id}
                  style={{
                    margin: '10px',
                    width: '300px',
                    borderRadius: '12px', // Añadir border-radius
                    overflow: 'hidden', // Para que el border-radius funcione correctamente
                  }}
                >
                  <CardMedia
                    component="img"
                    style={{ height: '150px' }}
                    image={employee.photo || 'https://via.placeholder.com/150'}
                    alt={employee.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{employee.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Edad: {employee.age}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Correo: {employee.email}
                    </Typography>
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

export default EmpleadosPage;
