import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MapIcon from '@mui/icons-material/Map';
import SatelliteIcon from '@mui/icons-material/Satellite';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Navbar = ({ isSatellite, onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a1a1a', boxShadow: 'none', borderBottom: '1px solid #333' }}>
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        <MapIcon sx={{ mr: { xs: 1, sm: 2 }, color: '#1976d2' }} />
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold', 
            letterSpacing: '0.5px',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          {isMobile ? 'Map Explorer' : 'React Map Explorer'}
        </Typography>

        <Box>
          {isMobile ? (
            <IconButton 
              onClick={onToggle}
              sx={{ 
                color: '#ffffff',
                border: '1px solid #444',
                borderRadius: '8px',
                '&:hover': { borderColor: '#1976d2' }
              }}
            >
              {isSatellite ? <MapIcon /> : <SatelliteIcon />}
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              startIcon={isSatellite ? <MapIcon /> : <SatelliteIcon />}
              onClick={onToggle}
              sx={{
                color: '#ffffff',
                borderColor: '#444',
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                },
                textTransform: 'none',
                borderRadius: '8px',
                px: 2,
              }}
            >
              {isSatellite ? 'Standard' : 'Satellite'}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
