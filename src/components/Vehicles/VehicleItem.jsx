import React from 'react';
import { ListItem, ListItemText, ListItemAvatar, Avatar, Typography, ListItemButton, Box } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useTranslation } from 'react-i18next';

const VehicleItem = ({ vehicle, isSelected, onSelect }) => {
  const { t } = useTranslation();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'moving': return '#4caf50';
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

  return (
    <ListItem disablePadding divider>
      <ListItemButton 
        selected={isSelected} 
        onClick={() => onSelect(vehicle.id)}
        sx={{
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            borderLeft: '4px solid #1976d2',
          }
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: isSelected ? '#1976d2' : '#f5f5f5', color: isSelected ? '#fff' : '#666' }}>
            {getVehicleIcon(vehicle.type)}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" variant="body1" sx={{ fontWeight: 'bold', display: 'block' }}>
              {vehicle.name}
            </Typography>
          }
          secondary={
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <Typography component="span" variant="body2" color="text.secondary">
                {vehicle.plate}
              </Typography>
              <FiberManualRecordIcon sx={{ fontSize: 10, color: getStatusColor(vehicle.status) }} />
              <Typography component="span" variant="caption" sx={{ textTransform: 'capitalize' }}>
                {t(vehicle.status)}
              </Typography>
            </Box>
          }
          slotProps={{ secondary: { component: 'span' } }}
        />
        <Typography component="span" variant="caption" sx={{ color: '#666', fontWeight: 'bold', ml: 'auto' }}>
          {vehicle.speed} km/h
        </Typography>
      </ListItemButton>
    </ListItem>
  );
};

export default VehicleItem;
