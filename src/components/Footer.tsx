import { Box, Typography, Link, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import '../css/App.css';

interface ServicesProps {
  darkMode: boolean;
}

const Footer: React.FC<ServicesProps> = ({ darkMode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        bgcolor: darkMode ? '#333' : '#f9f9f9',
        borderTop: darkMode ? '1px solid #555' : '1px solid #e0e0e0',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, mb: 2, color: darkMode ? '#aaa' : '#000'  }}>
        <IconButton href="https://twitter.com" color="inherit" sx={{ color: darkMode ? '#fff' : 'inherit' }}>
          <TwitterIcon />
        </IconButton>
        <IconButton href="https://facebook.com" color="inherit" sx={{ color: darkMode ? '#fff' : 'inherit' }}>
          <FacebookIcon />
        </IconButton>
        <IconButton href="https://instagram.com" color="inherit" sx={{ color: darkMode ? '#fff' : 'inherit' }}>
          <InstagramIcon />
        </IconButton>
        <IconButton href="https://pinterest.com" color="inherit" sx={{ color: darkMode ? '#fff' : 'inherit' }}>
          <PinterestIcon />
        </IconButton>
      </Box>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2, color: darkMode ? '#aaa' : '#000' }}>
        © 2024 CommunityWeb
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, color: darkMode ? '#aaa' : '#000'  }}>
        <Link href="#" underline="none" sx={{ color: darkMode ? '#ddd' : 'inherit' }}>Terms</Link>
        <Link href="#" underline="none" sx={{ color: darkMode ? '#ddd' : 'inherit' }}>Privacy</Link>
        <Link href="#" underline="none" sx={{ color: darkMode ? '#ddd' : 'inherit' }}>Cookies</Link>
      </Box>
    </Box>
  );
};

export default Footer;
