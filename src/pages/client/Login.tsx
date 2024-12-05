import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from 'components/bdd';
import { Snackbar, Alert } from '@mui/material';

const Login: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para abrir el Snackbar
  const [message, setMessage] = useState(''); // Estado para el mensaje a mostrar
  const [loadingMessage, setLoadingMessage] = useState("Cargando...");
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
        if (data.result.status == false) {
          // Muestra el mensaje de error en el Snackbar
          setMessage('ERROR: Usuario no encontrado');
          setOpenSnackbar(true);
          setLoadingMessage("¡Ups! No encontramos tu usuario, pero no te preocupes. Te redirigiremos al inicio para que puedas registrarte y comenzar.");
          // Redirige después de un tiempo para que el usuario pueda leer el mensaje
          setTimeout(() => {
            navigate('/'); // Redirige a la página principal
          }, 5000);
        }else{
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

          setLoadingMessage("Cargando...");
          localStorage.setItem('token', odooToken);
          // Redirigir a la página de servicios una vez que se obtenga la respuesta
          navigate('/Services');
        }
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
      <h2 style={{ color: "black" }}>{loadingMessage}</h2>
      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="error" // Cambia la severidad a "error"
          sx={{ width: '100%' }} // Ajusta el ancho del Alert
        >
          {message} {/* Muestra el mensaje de error */}
        </Alert>
      </Snackbar>

    </div>
  );
}

export default Login;