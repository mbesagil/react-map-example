import React from 'react';
import { Box, Paper, IconButton, Tooltip, Stack } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const MuiZoomControl = () => {
  const map = useMap();

  const handleZoomIn = (e) => {
    L.DomEvent.stopPropagation(e);
    map.zoomIn();
  };

  const handleZoomOut = (e) => {
    L.DomEvent.stopPropagation(e);
    map.zoomOut();
  };

  return (
    <Box 
      sx={{ 
        position: 'absolute', 
        top: 12, 
        left: 12, 
        zIndex: 1000,
        pointerEvents: 'auto'
      }}
      onMouseDown={(e) => L.DomEvent.stopPropagation(e)}
      onClick={(e) => L.DomEvent.stopPropagation(e)}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden', 
          bgcolor: 'background.paper', 
          border: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        <Stack spacing={0}>
          <Tooltip title="Zoom In" arrow placement="right">
            <IconButton 
              size="small" 
              onClick={handleZoomIn}
              sx={{ 
                borderRadius: 0, 
                width: 30, 
                height: 30, 
                p: 0.5,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out" arrow placement="right">
            <IconButton 
              size="small" 
              onClick={handleZoomOut}
              sx={{ 
                borderRadius: 0, 
                width: 30, 
                height: 30, 
                p: 0.5 
              }}
            >
              <RemoveIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
    </Box>
  );
};

export default MuiZoomControl;
