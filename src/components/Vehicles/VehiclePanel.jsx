import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import VehicleItem from './VehicleItem';
import AddVehicleDialog from './AddVehicleDialog';

const VehiclePanel = ({ vehicles, onAddVehicle }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Box sx={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white', borderRight: '1px solid #ddd' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Vehicles</Typography>
        <Button 
          variant="contained" 
          size="small" 
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
        >
          Add
        </Button>
      </Box>
      <Divider />
      
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {vehicles.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">No vehicles added yet.</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {vehicles.map((vehicle) => (
              <VehicleItem key={vehicle.id} vehicle={vehicle} />
            ))}
          </List>
        )}
      </Box>

      <AddVehicleDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onAdd={onAddVehicle} 
      />
    </Box>
  );
};

export default VehiclePanel;
