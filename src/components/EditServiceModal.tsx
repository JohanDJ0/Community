import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

interface EditServiceModalProps {
  open: boolean;
  onClose: () => void;
  service: {
    name: string;
    description: string;
    image: string | null | false;
  };
  onSave: (updatedService: {
    name: string;
    description: string;
    image: string | null | false;
  }) => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ open, onClose, service, onSave }) => {
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

  const handleSave = () => {
    onSave(updatedService);
    onClose();
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
        <input
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
        />
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
