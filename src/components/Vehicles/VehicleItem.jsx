import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Chip from '@mui/material/Chip';

const statusColors = {
  idle: 'default',
  moving: 'success',
  arrived: 'primary'
};

const VehicleItem = ({ vehicle, isSelected, onSelect }) => {
  return (
    <ListItem 
      button
      onClick={() => onSelect(vehicle.id)}
      alignItems="flex-start" 
      sx={{ 
        borderBottom: '1px solid #eee',
        backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
        borderLeft: isSelected ? '4px solid #1976d2' : '4px solid transparent',
        '&:hover': { backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.12)' : '#f9f9f9' }
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: vehicle.status === 'moving' ? '#4caf50' : (isSelected ? '#1976d2' : '#9e9e9e') }}>
          <DirectionsCarIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <div className="flex justify-between items-center">
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: isSelected ? '#1976d2' : 'inherit' }}>
              {vehicle.name}
            </Typography>
            <Chip 
              label={vehicle.status} 
              size="small" 
              color={statusColors[vehicle.status]} 
              variant={isSelected ? "filled" : "outlined"}
            />
          </div>
        }
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {vehicle.plate}
            </Typography>
            {" — Speed: " + vehicle.speed + " km/h"}
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

export default VehicleItem;
