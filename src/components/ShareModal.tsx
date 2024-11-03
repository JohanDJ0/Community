import React from 'react';
import { Modal, Box, Typography, IconButton, Stack } from '@mui/material';
import { WhatsApp, Facebook, Twitter, Link as LinkIcon } from '@mui/icons-material';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose }) => {
  const urlToShare = window.location.href;

  const handleShare = (platform: string) => {
    let shareUrl = '';
    const text = encodeURIComponent("¡Echa un vistazo a este servicio!");

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${urlToShare}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${urlToShare}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${urlToShare}`;
        break;
      case 'link':
        navigator.clipboard.writeText(urlToShare);
        alert("Enlace copiado al portapapeles");
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
          Compartir en
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center">
          <Stack alignItems="center">
            <IconButton aria-label="whatsapp" onClick={() => handleShare('whatsapp')}>
              <WhatsApp />
            </IconButton>
            <Typography variant="caption" fontWeight="bold">WhatsApp</Typography>
          </Stack>
          <Stack alignItems="center">
            <IconButton aria-label="facebook" onClick={() => handleShare('facebook')}>
              <Facebook />
            </IconButton>
            <Typography variant="caption" fontWeight="bold">Facebook</Typography>
          </Stack>
          <Stack alignItems="center">
            <IconButton aria-label="twitter" onClick={() => handleShare('twitter')}>
              <Twitter />
            </IconButton>
            <Typography variant="caption" fontWeight="bold">X</Typography>
          </Stack>
          <Stack alignItems="center">
            <IconButton aria-label="copy-link" onClick={() => handleShare('link')}>
              <LinkIcon />
            </IconButton>
            <Typography variant="caption" fontWeight="bold">Copiar Link</Typography>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ShareModal;
