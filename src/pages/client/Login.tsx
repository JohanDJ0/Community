import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from 'components/bdd';

const Login: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params: {
            email: user.email
          }
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json(); // Si necesitas procesar la respuesta como JSON
      })
      .then(data => {
        // Aquí puedes validar los datos de la respuesta
        console.log('Datos recibidos:', data);
        const odooResponse = data.result?.rol;
        const odooToken = data.result?.token;

        // Almacena el rol y el token en el localStorage
        if (odooResponse === 'owner') {
          setUserRole('owner');
          const serviceId = data.result?.owner_service;
          localStorage.setItem('rol', 'owner');
          localStorage.setItem('service', serviceId);
        } else if (odooResponse === 'employee') {
          setUserRole('employee');
          const serviceId = data.result?.employee_service; // Ajusta la clave si es necesario
          localStorage.setItem('rol', 'employee');
          localStorage.setItem('service', serviceId);
        } else {
          setUserRole('client');
          localStorage.setItem('rol', 'client');
        }

        localStorage.setItem('token', odooToken);
        // Redirigir a la página de servicios una vez que se obtenga la respuesta
        navigate('/Services');
      })
      .catch(error => {
        // Manejar cualquier error ocurrido durante la solicitud
        console.error('Error en la petición:', error);
      });
    }
  }, [isAuthenticated, user, navigate]);

  // Estilos en línea para centrar el loader
  const loaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center'
  };

  return (
    <div style={loaderStyle}>
      <h1 style={{ color: 'black' }}>Cargando...</h1>
    </div>
  );
}

export default Login;