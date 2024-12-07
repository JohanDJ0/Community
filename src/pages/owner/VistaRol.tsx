import React, { useState } from 'react';
import { RadioGroup, FormControlLabel, Radio, Button, Typography, TextField, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import PayPalButtonsComponent from '../../components/paypal';
import { API_BASE_URL } from 'components/bdd';
// Define the props interface including darkMode
interface ServicesProps {
  darkMode: boolean;
}

// Modify the component to accept darkMode as a prop
const VistaRol: React.FC<ServicesProps> = ({ darkMode }) => {
  const [rol, setRol] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [businessDescription, setBusinessDescription] = useState<string>('');
  const [businessImage, setBusinessImage] = useState<File | null>(null);
  const [businessDirection, setBusinessDirection] = useState<string>('');
  const [businessPhone, setBusinessPhone] = useState<string>('');
  const [businessEmail, setBusinessEmail] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isPaymentApproved, setIsPaymentApproved] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  const handlePaymentSuccess = () => {
    setIsPaymentApproved(true);
  };

  const validateFields = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!businessName.trim()) newErrors.businessName = 'El nombre del negocio es obligatorio.';
    if (!businessDirection.trim()) newErrors.businessDirection = 'La dirección es obligatoria.';
    if (!businessPhone.trim() || !/^\d{10,15}$/.test(businessPhone)) newErrors.businessPhone = 'El número de teléfono debe contener entre 10 y 15 dígitos.';
    if (!businessEmail.trim() || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(businessEmail)) newErrors.businessEmail = 'El correo debe ser válido.';
    if (!businessDescription.trim()) newErrors.businessDescription = 'La descripción es obligatoria.';
    if (businessDescription.length > 500) newErrors.businessDescription = 'La descripción no puede superar los 500 caracteres.';
    if (!businessImage) newErrors.businessImage = 'La imagen es obligatoria.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedRole = event.target.value;
    setRol(selectedRole);

    if (selectedRole === 'user') {
      resetBusinessFields();
    }
  };

  const resetBusinessFields = () => {
    setBusinessName('');
    setBusinessDescription('');
    setBusinessImage(null);
    setBusinessDirection('');
    setBusinessPhone('');
    setBusinessEmail('');
  };

  const convertImageToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleUserSignup = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`,{        
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params: {
            name: user?.name,
            email: user?.email,
            user_type: 'user',
          },
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.message || 'Error al enviar los datos al servidor');
  
      const tokenUser = data.result?.token;
  
      if (tokenUser) {
        localStorage.setItem('rol', 'user');
        localStorage.setItem('token', tokenUser); // Guardar el token
        console.log('Token guardado:', tokenUser);
      } else {
        throw new Error('No se recibió el token del usuario.');
      }
  
      console.log('Usuario registrado:', data);
      navigate('/services');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

  const handleOwnerSignup = async () => {
    try {
      const responseUser = await fetch(`${API_BASE_URL}/signup`,{        
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params: {
            name: user?.name,
            email: user?.email,
            user_type: 'owner',
          },
        }),
      });
  
      const userData = await responseUser.json();
  
      if (!responseUser.ok) throw new Error(userData.message || 'Error al registrar usuario como dueño');
  
      const tokenUser = userData.result?.token;
      const ownerId = userData.result?.id;
  
      if (!tokenUser) {
        throw new Error('No se recibió el token del usuario.');
      }
  
      if (!businessName || !businessDirection || !businessPhone || !businessEmail) {
        setIsValid(false);
        return;
      }
  
      setIsValid(true);
  
      localStorage.setItem('rol', 'owner');
      localStorage.setItem('token', tokenUser); // Guardar el token
      console.log('Token guardado:', tokenUser);
  
      let base64Image = null;
      if (businessImage) {
        base64Image = await convertImageToBase64(businessImage);
      }
  
      const businessData = {
        params: {
          name: businessName,
          direction: businessDirection,
          number_phone: businessPhone,
          email: businessEmail,
          image: base64Image,
          owner: ownerId,
          description: businessDescription,
        },
      };
  
      const responseBusiness = await fetch(`${API_BASE_URL}/services/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData),
      });
  
      const result = await responseBusiness.json();
  
      if (!responseBusiness.ok) throw new Error(result.message || 'Error al registrar negocio');
  
      const serviceId = result.result?.id;
  
      console.log('Negocio registrado:', result);
      localStorage.setItem('service', serviceId);
      navigate('/MyService');
    } catch (error) {
      console.error('Error al registrar negocio:', error);
    }
  };

  const handleSubmit = () => {
    if (!rol) {
      console.log('Por favor, selecciona un rol.');
      return;
    }

    if (rol === 'user') {
      if (isAuthenticated && user) {
        handleUserSignup();
      }
    } else if (rol === 'owner') {
      if (isAuthenticated && user && validateFields()) {
        handleOwnerSignup();
      }
    }
  };

  return (
    <div
      className="first-div"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: darkMode ? '#333' : '#fff',
      }}
    >
      <div className="second-div">
        <div
          className="box-div"
          style={{
            backgroundColor: darkMode ? '#444' : '#f5f5f5',
            color: darkMode ? '#fff' : '#000',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Ya casi acabamos...
          </Typography>

          <RadioGroup value={rol} onChange={(e) => setRol(e.target.value)} row style={{ justifyContent: 'center' }}>
            <FormControlLabel value="user" control={<Radio />} label="Cliente" />
            <FormControlLabel value="owner" control={<Radio />} label="Dueño" />
          </RadioGroup>

          {rol !== 'owner' && (
            <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
              Submit
            </Button>
          )}

          <Fade in={rol === 'owner'} timeout={500}>
            <div style={{ marginTop: '20px', display: rol === 'owner' ? 'block' : 'none' }}>
              <Typography variant="h6">Registro de negocio</Typography>

              <TextField
                label="Nombre del Negocio"
                variant="outlined"
                fullWidth
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{ marginBottom: '10px' }}
                error={!!errors.businessName}
                helperText={errors.businessName}
              />

              <TextField
                label="Dirección"
                variant="outlined"
                fullWidth
                value={businessDirection}
                onChange={(e) => setBusinessDirection(e.target.value)}
                style={{ marginBottom: '10px' }}
                error={!!errors.businessDirection}
                helperText={errors.businessDirection}
              />

              <TextField
                label="Número de Teléfono"
                variant="outlined"
                fullWidth
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                style={{ marginBottom: '10px' }}
                error={!!errors.businessPhone}
                helperText={errors.businessPhone}
              />

              <TextField
                label="Correo"
                variant="outlined"
                fullWidth
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                style={{ marginBottom: '10px' }}
                error={!!errors.businessEmail}
                helperText={errors.businessEmail}
              />

              <TextField
                label="Descripción del Negocio"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                style={{ marginBottom: '10px' }}
                error={!!errors.businessDescription}
                helperText={errors.businessDescription}
              />

              <div style={{ marginBottom: '10px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBusinessImage(e.target.files?.[0] || null)}
                  style={{ display: 'block', margin: '10px 0' }}
                />
                {errors.businessImage && <Typography color="error">{errors.businessImage}</Typography>}
              </div>

              <div>
                <p style={{ textAlign: 'left', marginLeft: '10px', fontSize: '18px' }}>Forma de Pago</p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <div style={{ width: '300px', height: 'auto' }}>
                    <PayPalButtonsComponent onPaymentSuccess={handlePaymentSuccess} />
                  </div>
                </div>
              </div>

              {isPaymentApproved && (
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Registrar negocio
                </Button>
              )}
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default VistaRol;