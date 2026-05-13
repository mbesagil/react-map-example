import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  Typography,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  DirectionsCar as CarIcon,
  Badge as BadgeIcon,
  Speed as SpeedIcon,
  LocationOn as LocationIcon,
  Category as TypeIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const AddVehicleDialog = ({ open, onClose, onAdd }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    name: '',
    plate: '',
    latitude: '',
    longitude: '',
    speed: '',
    type: 'car'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', plate: '', latitude: '', longitude: '', speed: '', type: 'car' });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          boxShadow: theme.shadows[10]
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 3, 
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AddIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>{t('add_vehicle')}</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {/* Araç Bilgileri Pair 1 */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                label={t('vehicle_name')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('vehicle_name_placeholder')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CarIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                label={t('plate')}
                name="plate"
                value={formData.plate}
                onChange={handleChange}
                placeholder={t('plate_placeholder')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Araç Bilgileri Pair 2 */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                select
                label={t('vehicle_type')}
                name="type"
                value={formData.type}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TypeIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="car">{t('car')}</MenuItem>
                <MenuItem value="motorcycle">{t('motorcycle')}</MenuItem>
                <MenuItem value="service">{t('service')}</MenuItem>
                <MenuItem value="truck">{t('truck')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                label={t('speed')}
                name="speed"
                type="number"
                value={formData.speed}
                onChange={handleChange}
                placeholder={t('speed_placeholder')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SpeedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">km/h</InputAdornment>
                }}
              />
            </Grid>
            
            <Grid item size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {t('location')}
                </Typography>
              </Divider>
            </Grid>

            {/* Konum Bilgileri Pair */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                label={t('latitude')}
                name="latitude"
                type="number"
                inputProps={{ step: "any" }}
                value={formData.latitude}
                onChange={handleChange}
                placeholder={t('latitude_placeholder')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                label={t('longitude')}
                name="longitude"
                type="number"
                inputProps={{ step: "any" }}
                value={formData.longitude}
                onChange={handleChange}
                placeholder={t('longitude_placeholder')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={onClose} 
            color="inherit" 
            variant="outlined" 
            sx={{ borderRadius: 2, px: 3 }}
          >
            {t('cancel')}
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
          >
            {t('add')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddVehicleDialog;
