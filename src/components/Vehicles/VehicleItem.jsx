import React, { useState } from 'react';
import { 
  ListItem, ListItemText, ListItemAvatar, Avatar, Typography, 
  ListItemButton, Box, IconButton, Tooltip, Slider, Stack, Collapse 
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SpeedIcon from '@mui/icons-material/Speed';
import ConfirmDialog from '../Common/ConfirmDialog';
import { useTranslation } from 'react-i18next';

const VehicleItem = ({ 
  vehicle, 
  isSelected, 
  onSelect, 
  onStart, 
  onStop, 
  onDelete, 
  onSpeedChange 
}) => {
  const { t } = useTranslation();
  const [showActions, setShowActions] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'moving': return '#4caf50';
      case 'stopped': return '#ed6c02';
      case 'arrived': return '#1976d2';
      default: return '#9e9e9e';
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'motorcycle': return <TwoWheelerIcon />;
      case 'service': return <DirectionsBusIcon />;
      case 'truck': return <LocalShippingIcon />;
      default: return <DirectionsCarIcon />;
    }
  };

  const handleToggleActions = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    action(vehicle.id);
  };

  const handleSpeedSliderChange = (e, newValue) => {
    onSpeedChange(vehicle.id, newValue);
  };

  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <ListItem disablePadding>
        <ListItemButton 
          selected={isSelected} 
          onClick={() => onSelect(vehicle.id)}
          sx={{
            py: 1.5,
            '&.Mui-selected': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              borderLeft: '4px solid #1976d2',
            }
          }}
        >
          <ListItemAvatar>
            <Avatar sx={{ 
              bgcolor: isSelected ? '#1976d2' : 'action.selected', 
              color: isSelected ? '#fff' : 'text.secondary',
              width: 36,
              height: 36
            }}>
              {getVehicleIcon(vehicle.type)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{vehicle.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                  {vehicle.speed} km/h
                </Typography>
              </Box>
            }
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                <Typography variant="caption" color="text.secondary">{vehicle.plate}</Typography>
                <FiberManualRecordIcon sx={{ fontSize: 8, color: getStatusColor(vehicle.status) }} />
                <Typography variant="caption" sx={{ color: getStatusColor(vehicle.status), fontWeight: 500 }}>
                  {t(vehicle.status)}
                </Typography>
              </Box>
            }
          />
          <IconButton size="small" onClick={handleToggleActions} sx={{ ml: 1 }}>
            {showActions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </ListItemButton>
      </ListItem>

      <Collapse in={showActions} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2, pb: 2, pt: 1, bgcolor: 'action.hover' }}>
          <Stack spacing={2}>
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={t('start')}>
                  <span>
                    <IconButton 
                      size="small" 
                      color="success" 
                      onClick={(e) => handleAction(e, onStart)}
                      disabled={vehicle.status === 'moving' || !vehicle.target}
                      sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'success.light' }}
                    >
                      <PlayArrowIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={t('stop')}>
                  <span>
                    <IconButton 
                      size="small" 
                      color="warning" 
                      onClick={(e) => handleAction(e, onStop)}
                      disabled={vehicle.status !== 'moving'}
                      sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'warning.light' }}
                    >
                      <StopIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
              <Tooltip title={t('delete')}>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={(e) => { e.stopPropagation(); setIsConfirmOpen(true); }}
                  sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'error.light' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Speed Slider */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <SpeedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{t('speed')}</Typography>
                <Typography variant="caption" sx={{ ml: 'auto', fontWeight: 'bold' }}>{vehicle.speed} km/h</Typography>
              </Box>
              <Slider
                size="small"
                value={vehicle.speed}
                min={0}
                max={200}
                onChange={handleSpeedSliderChange}
                valueLabelDisplay="auto"
                sx={{ ml: 1, width: '95%' }}
              />
            </Box>
          </Stack>
        </Box>
      </Collapse>

      <ConfirmDialog 
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => onDelete(vehicle.id)}
        title={t('delete')}
        message={t('confirm_delete_vehicle')}
      />
    </Box>
  );
};

export default VehicleItem;
