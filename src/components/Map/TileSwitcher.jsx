import React from 'react';
import Button from '@mui/material/Button';

const TileSwitcher = ({ isSatellite, onToggle }) => {
  return (
    <div className="absolute top-4 right-4 z-[9999]">
      <Button
        variant="contained"
        color="primary"
        onClick={onToggle}
        className="shadow-lg"
        sx={{
          backgroundColor: isSatellite ? '#ffffff' : '#1976d2',
          color: isSatellite ? '#000000' : '#ffffff',
          '&:hover': {
            backgroundColor: isSatellite ? '#f0f0f0' : '#1565c0',
          },
          textTransform: 'none',
          fontWeight: 'bold',
        }}
      >
        {isSatellite ? 'Standard Map' : 'Satellite Map'}
      </Button>
    </div>
  );
};

export default TileSwitcher;
