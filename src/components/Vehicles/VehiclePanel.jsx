import React, { useState } from 'react';
import { Box, Typography, Button, List, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VehicleItem from './VehicleItem';
import AddVehicleDialog from './AddVehicleDialog';
import { useStore } from '../../store/useStore';

const VehiclePanel = ({ onSelectVehicle, children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const vehicles = useStore(state => state.vehicles);
  const addVehicle = useStore(state => state.addVehicle);
  const selectedVehicleId = useStore(state => state.selectedVehicleId);
  const selectVehicle = useStore(state => state.selectVehicle);

  const handleSelect = (id) => {
    selectVehicle(id);
    if (onSelectVehicle) onSelectVehicle(id);
  };

  return (
    <Box sx={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white', borderRight: '1px solid #ddd' }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: '#f8f9fa' }}>
        <div className="flex justify-between items-center">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Vehicles</Typography>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>Add</Button>
        </div>
        {selectedVehicleId && <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>Click on map to set target</Typography>}
        <Box sx={{ mt: 2 }}>{children}</Box>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {vehicles.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}><Typography variant="body2">No vehicles yet.</Typography></Box>
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
