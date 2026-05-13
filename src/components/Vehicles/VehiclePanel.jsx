import React, { useState } from 'react';
import { 
  Box, Typography, Button, List, Divider, useTheme, Skeleton, 
  ButtonGroup, Tooltip, TextField, InputAdornment 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SpeedIcon from '@mui/icons-material/Speed';
import VehicleItem from './VehicleItem';
import AddVehicleDialog from './AddVehicleDialog';
import ConfirmDialog from '../Common/ConfirmDialog';
import useVehicles from '../../hooks/useVehicles';
import { useTranslation } from 'react-i18next';

const VehiclePanel = ({ onSelectVehicle, children }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmAllOpen, setIsConfirmAllOpen] = useState(false);
  const [bulkSpeed, setBulkSpeed] = useState(80);
  
  const {
    vehicles,
    vehiclesLoading,
    selectedVehicleId,
    addVehicle,
    startAllVehicles,
    stopAllVehicles,
    deleteAllVehicles,
    updateAllSpeeds,
    selectVehicle,
    startVehicle,
    stopVehicle,
    deleteVehicle,
    updateVehicleSpeed
  } = useVehicles();

  const handleSelect = (id) => {
    selectVehicle(id);
    if (onSelectVehicle) onSelectVehicle(id);
  };

  return (
    <Box sx={{ 
      width: 340, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.divider}`
    }}>
      {/* Header & Bulk Actions */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
        <div className="flex justify-between items-center">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{t('vehicles')}</Typography>
          <Button variant="contained" size="small" disabled={vehiclesLoading} startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>{t('add')}</Button>
        </div>

        {/* Bulk Control System */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <ButtonGroup fullWidth variant="outlined" size="small">
            <Tooltip title={t('start_all')}>
              <Button color="success" onClick={startAllVehicles}><PlayArrowIcon /></Button>
            </Tooltip>
            <Tooltip title={t('stop_all')}>
              <Button color="warning" onClick={stopAllVehicles}><StopIcon /></Button>
            </Tooltip>
            <Tooltip title={t('delete_all')}>
              <Button color="error" onClick={() => setIsConfirmAllOpen(true)}><DeleteSweepIcon /></Button>
            </Tooltip>
          </ButtonGroup>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              type="number"
              value={bulkSpeed}
              onChange={(e) => setBulkSpeed(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SpeedIcon fontSize="small" /></InputAdornment>,
                endAdornment: <InputAdornment position="end">km/h</InputAdornment>,
              }}
              sx={{ flex: 1 }}
            />
            <Button variant="outlined" size="small" onClick={() => updateAllSpeeds(bulkSpeed)}>{t('apply')}</Button>
          </Box>
        </Box>

        {selectedVehicleId && <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>{t('click_map_target')}</Typography>}
        <Box sx={{ mt: 1 }}>{children}</Box>
      </Box>

      <Divider />

      {/* Vehicle List */}
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
              <VehicleItem 
                key={v.id} 
                vehicle={v} 
                isSelected={v.id === selectedVehicleId} 
                onSelect={handleSelect}
                onStart={startVehicle}
                onStop={stopVehicle}
                onDelete={deleteVehicle}
                onSpeedChange={updateVehicleSpeed}
              />
            ))}
          </List>
        )}
      </Box>

      <AddVehicleDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} onAdd={addVehicle} />
      
      <ConfirmDialog 
        open={isConfirmAllOpen} 
        onClose={() => setIsConfirmAllOpen(false)}
        onConfirm={deleteAllVehicles}
        title={t('delete_all')}
        message={t('confirm_delete_all')}
      />
    </Box>
  );
};

export default VehiclePanel;
