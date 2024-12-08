import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { API_BASE_URL } from './bdd';
import { Description } from '@mui/icons-material';

interface EditServiceModalProps {
  open: boolean;
  onClose: () => void;
  service: {
    id: number;
    name: string;
    description: string;
    image: string;
  };
  onSave: (updatedService: {
    id: number;
    name: string;
    description: string;
    image: string;
  }) => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ open, onClose, service, onSave }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [updatedService, setUpdatedService] = useState(service);

  // Efecto para actualizar el estado interno cuando el modal se abre y recibe nuevos datos
  useEffect(() => {
    if (open) {
      setUpdatedService(service);
    }
  }, [open, service]);

  const handleInputChange = (field: string, value: string) => {
    setUpdatedService((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      // Cuando se completa la lectura del archivo
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result.toString()); // Convertir el resultado en cadena
        } else {
          reject(new Error("No se pudo leer el archivo"));
        }
      };
  
      // Manejo de errores al leer el archivo
      reader.onerror = (error) => reject(error);
  
      // Lee el archivo como una URL de datos
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    try {
      // Validar si tienes el archivo seleccionado
      if (!imageFile) {
        console.error("No se ha seleccionado una imagen.");
        return;
      }
  
      // Convertir la imagen a Base64
      const base64Image = await convertImageToBase64(imageFile);
  
      // Crear el objeto JSON para enviar
      const jsonService = {
        params: {
          name: updatedService.name,
          description: updatedService.description,
          image: base64Image
        },
      };
  
      // Realizar la llamada a la API
      const response = await fetch(`${API_BASE_URL}/services/update/${updatedService.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonService),
      });
  
      const result = await response.json();
      //console.log("Respuesta del servidor:", result);
  
      // Llamar a los callbacks si la operación fue exitosa
      onSave(updatedService);
      onClose();
    } catch (error) {
      //console.error("Error al procesar o guardar la imagen:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Servicio</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Nombre"
          value={updatedService.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Descripción"
          multiline
          rows={4}
          value={updatedService.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
        {/* Campo de archivo para la imagen */}
        {/* <input
          type="file"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null;
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                handleInputChange('image', reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
          style={{ marginBottom: '16px' }}
        /> */}
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImageFile(file); // Guarda el archivo en el estado
            }
          }}
          style={{ marginBottom: '16px' }}
        />;
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditServiceModal;
