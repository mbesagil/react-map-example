import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SatelliteIcon from '@mui/icons-material/Satellite';
import MenuIcon from '@mui/icons-material/Menu';
import TranslateIcon from '@mui/icons-material/Translate';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';

const Navbar = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t, i18n } = useTranslation();

  const isSatellite = useStore(state => state.getIsSatellite());
  const toggleTile = useStore(state => state.toggleTile);
  const darkMode = useStore(state => state.darkMode);
  const toggleDarkMode = useStore(state => state.toggleDarkMode);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: darkMode ? '#121212' : '#1a1a1a', borderBottom: '1px solid #333' }}>
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
        <MapIcon sx={{ mr: { xs: 1, sm: 2 }, color: '#1976d2' }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
          {t('app_title')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          {/* Theme Toggle */}
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>

          {/* Language Toggle */}
          <IconButton color="inherit" onClick={toggleLanguage}>
            <TranslateIcon fontSize="small" />
            <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'bold', display: { xs: 'none', sm: 'inline' } }}>
              {i18n.language?.toUpperCase().substring(0, 2)}
            </Typography>
          </IconButton>

          <Button
            variant="outlined"
            size="small"
            startIcon={isSatellite ? <MapIcon /> : <SatelliteIcon />}
            onClick={toggleTile}
            sx={{ color: '#fff', borderColor: '#444', textTransform: 'none' }}
          >
            {isMobile ? '' : (isSatellite ? t('standard') : t('satellite'))}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
