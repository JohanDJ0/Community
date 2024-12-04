import React, { useState } from 'react'; // Importamos React y el hook useState para manejar el estado del componente
import { TextField, Button, Box } from '@mui/material'; // Importamos componentes de Material UI
import '../../css/App.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

// Agrega 'darkMode' como prop
interface ServicesProps {
  darkMode: boolean;
}

// Definimos el componente funcional JoinBusinessPage
const JoinBusinessPage:  React.FC<ServicesProps> = ({ darkMode }) =>  {
  // Definimos dos variables de estado:
  // - businessName para almacenar el valor del input (nombre del negocio)
  // - isValid para controlar la clase de validación (si es válido o no)
  const [businessName, setBusinessName] = useState(''); 
  const [isValid, setIsValid] = useState(true); 
  const token = localStorage.getItem('token');
  const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para abrir el Snackbar
  const [message, setMessage] = useState(''); // Estado para el mensaje a mostrar
  const navigate = useNavigate();

  // Función que se ejecuta cuando se hace clic en el botón "Unirse"
  const handleJoinClick = (businessName: string) => {
    //console.log('Código de acceso ingresado:', businessName);
    fetch(`/search_service`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ params: { access_code: businessName, token: token } })
    })
    .then(response => response.json())
    .then((data) => {
      if (data.result) {
        const serviceId = data.result.service;
        setMessage('¡Éxito! Se cambiará tu menú al tipo empleado.');
        setOpenSnackbar(true);

        // Retrasar la navegación para que el Snackbar se muestre
        setTimeout(() => {
          localStorage.removeItem('rol');
          localStorage.removeItem('service');
          localStorage.setItem('rol', 'employee');
          localStorage.setItem('service', serviceId);
          navigate("/Services");
        }, 3000); // Retraso de 3 segundos
      } else {
        console.error("Error al cambiar de rol al usuario:", data.result?.Message || "Error desconocido");
      }
    })
    .catch((error) => {
      console.error("Error al cambiar de rol al usuario: ", error.message || "Error desconocido");
    });
  };

  return (
    // Estructura principal del componente:
    <div className='first-div'>
      <div className='second-div'>
        <div className={`box-div ${darkMode ? 'dark' : 'light'}`}> 
          <h2>Unirse a un negocio</h2> {/* Título de la página */}

          {/* Caja de texto para ingresar el código de acceso del negocio */}
          <Box mt={2}>
          <TextField
            label="Código de acceso"
            variant="filled"
            fullWidth
            style={{ marginBottom: '10px' }}
            value={businessName}
            error={businessName.length > 6}
            helperText={businessName.length > 6 ? "El código no puede superar los 6 caracteres" : ""}
            onChange={(e) => setBusinessName(e.target.value.slice(0, 6))}
          />
          </Box>

          {/* Botón para unirse al negocio */}
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant='contained' // Estilo de botón con relleno
              sx={{
                backgroundColor: '#2EC6BD', // Color del botón
                '&:hover': {
                  backgroundColor: '#2EC6BD', // Color al hacer hover
                },
              }}
              onClick={() => handleJoinClick(businessName)} // Pasamos el valor del input a la función
            >
              Unirse
            </Button>
          </Box>
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
    </div>
  );
}

export default JoinBusinessPage; // Exportamos el componente para que pueda ser usado en otras partes de la aplicación