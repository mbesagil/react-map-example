import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SatelliteIcon from '@mui/icons-material/Satellite';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useStore } from '../../store/useStore';

const Navbar = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const isSatellite = useStore(state => state.getIsSatellite());
  const toggleTile = useStore(state => state.toggleTile);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
        <MapIcon sx={{ mr: { xs: 1, sm: 2 }, color: '#1976d2' }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
          {isMobile ? 'Vehicle Tracker' : 'React Vehicle Management System'}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={isSatellite ? <MapIcon /> : <SatelliteIcon />}
            onClick={toggleTile}
            sx={{ color: '#fff', borderColor: '#444', textTransform: 'none' }}
          >
            {isMobile ? '' : (isSatellite ? 'Standard' : 'Satellite')}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
