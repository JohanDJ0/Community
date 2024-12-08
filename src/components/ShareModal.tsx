import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton, Stack } from '@mui/material';
import { WhatsApp, Facebook, Twitter, Link as LinkIcon } from '@mui/icons-material';
import { Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose }) => {
  const urlToShare = window.location.href;
  const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para abrir el Snackbar
  const [message, setMessage] = useState(''); // Estado para el mensaje a mostrar
  const { t, i18n } = useTranslation("shareModal");

  const handleShare = (platform: string) => {
    let shareUrl = '';
    const text = encodeURIComponent("¡Echa un vistazo a este servicio!");

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${urlToShare}`;
        onClose(); // Cierra el modal
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${urlToShare}`;
        onClose(); // Cierra el modal
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${urlToShare}`;
        onClose(); // Cierra el modal
        break;
      case 'link':
        navigator.clipboard.writeText(urlToShare); // Copia el enlace al portapapeles
        setMessage(t("successMessage")); // Establece el mensaje del Snackbar
        setOpenSnackbar(true); // Muestra el Snackbar

        // Espera 2 segundos antes de cerrar el modal
        setTimeout(() => {
            onClose(); // Cierra el modal
            setOpenSnackbar(false); // Cierra el Snackbar
        }, 2000); // 2000 milisegundos = 2 segundos
        return;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="share-modal-title" aria-describedby="share-modal-description">
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        <Typography id="share-modal-title" variant="h5" component="h2" textAlign="center" marginBottom={3}>
          {t("shareModalTitle")}
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center">
          <Stack alignItems="center">
            <IconButton aria-label="whatsapp" onClick={() => handleShare('whatsapp')}>
              <WhatsApp />
            </IconButton>
            <Typography variant="caption">WhatsApp</Typography>
          </Stack>
          <Stack alignItems="center">
            <IconButton aria-label="facebook" onClick={() => handleShare('facebook')}>
              <Facebook />
            </IconButton>
            <Typography variant="caption">Facebook</Typography>
          </Stack>
          <Stack alignItems="center">
            <IconButton aria-label="twitter" onClick={() => handleShare('twitter')}>
              <Twitter />
            </IconButton>
            <Typography variant="caption">X</Typography>
          </Stack>
          <Stack alignItems="center">
            <IconButton aria-label="copy-link" onClick={() => handleShare('link')}>
              <LinkIcon />
            </IconButton>
            <Typography variant="caption">{t("copyLink")}</Typography>
          </Stack>
        </Stack>
        <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Tiempo que durará visible el Snackbar
        onClose={() => setOpenSnackbar(false)} // Cierra el Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Centra el Snackbar en la parte superior
        >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
            {message}
        </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default ShareModal;
