import React, { useState } from 'react';
import { Box, Typography, Button, List, Divider, useTheme, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VehicleItem from './VehicleItem';
import AddVehicleDialog from './AddVehicleDialog';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';

const VehiclePanel = ({ onSelectVehicle, children }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const vehicles = useStore(state => state.vehicles);
  const vehiclesLoading = useStore(state => state.vehiclesLoading);
  const addVehicle = useStore(state => state.addVehicle);
  const selectedVehicleId = useStore(state => state.selectedVehicleId);
  const selectVehicle = useStore(state => state.selectVehicle);

  const handleSelect = (id) => {
    selectVehicle(id);
    if (onSelectVehicle) onSelectVehicle(id);
  };

  return (
    <Box sx={{ 
      width: 320, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.divider}`
    }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
        <div className="flex justify-between items-center">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{t('vehicles')}</Typography>
          <Button variant="contained" size="small" disabled={vehiclesLoading} startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>{t('add')}</Button>
        </div>
        {selectedVehicleId && <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>{t('click_map_target')}</Typography>}
        <Box sx={{ mt: 2 }}>{children}</Box>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {vehiclesLoading ? (
          <Box sx={{ p: 2 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            ))}
          </Box>
        ) : vehicles.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}><Typography variant="body2">{t('no_vehicles')}</Typography></Box>
        ) : (
          <List sx={{ p: 0 }}>
            {vehicles.map((v) => (
              <VehicleItem key={v.id} vehicle={v} isSelected={v.id === selectedVehicleId} onSelect={handleSelect} />
            ))}
          </List>
        )}
      </Box>
      <AddVehicleDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} onAdd={addVehicle} />
    </Box>
  );
};

export default VehiclePanel;
