import { Box, Typography, Link, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';

const Footer = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        bgcolor: '#f9f9f9',
        borderTop: '1px solid #e0e0e0',
      }}
    >


      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <IconButton href="https://twitter.com" color="inherit">
          <TwitterIcon />
        </IconButton>
        <IconButton href="https://facebook.com" color="inherit">
          <FacebookIcon />
        </IconButton>
        <IconButton href="https://instagram.com" color="inherit">
          <InstagramIcon />
        </IconButton>
        <IconButton href="https://pinterest.com" color="inherit">
          <PinterestIcon />
        </IconButton>
      </Box>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        © 2024 CommunityWeb
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Link href="#" underline="none" color="inherit">Terms</Link>
        <Link href="#" underline="none" color="inherit">Privacy</Link>
        <Link href="#" underline="none" color="inherit">Cookies</Link>
      </Box>


    </Box>
  );
};

export default Footer;
