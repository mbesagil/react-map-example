import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GpsOffIcon from '@mui/icons-material/GpsOff';
import { useStore } from '../../store/useStore';
import { isPointInPolygon } from '../../utils/geo';

const StatCard = ({ title, value, icon, color }) => (
  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', borderColor: color }}>
    {icon}
    <Typography variant="h6" sx={{ fontWeight: 'bold', color }}>{value}</Typography>
    <Typography variant="caption" color="text.secondary">{title}</Typography>
  </Paper>
);

const GeoFencePanel = () => {
  const vehicles = useStore(state => state.vehicles);
  const selectedRegion = useStore(state => state.selectedRegion);

  const stats = useMemo(() => {
    if (!selectedRegion?.geojson) return null;
    
    const inside = vehicles.filter(v => isPointInPolygon(v.position, selectedRegion.geojson));
    return {
      total: vehicles.length,
      insideCount: inside.length,
      outsideCount: vehicles.length - inside.length,
      movingInside: inside.filter(v => v.status === 'moving').length,
      idleInside: inside.filter(v => v.status !== 'moving').length
    };
  }, [vehicles, selectedRegion]);

  if (!selectedRegion || !stats) return null;

  return (
    <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f0f4f8', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <AssessmentIcon sx={{ mr: 1, color: '#1976d2', fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Analytics: {selectedRegion.display_name.split(',')[0]}</Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={6}><StatCard title="Inside" value={stats.insideCount} icon={<GpsFixedIcon sx={{ fontSize: 14, color: '#4caf50' }} />} color="#4caf50" /></Grid>
        <Grid item xs={6}><StatCard title="Outside" value={stats.outsideCount} icon={<GpsOffIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />} color="#9e9e9e" /></Grid>
        <Grid item xs={6}><StatCard title="Moving" value={stats.movingInside} color="#2e7d32" /></Grid>
        <Grid item xs={6}><StatCard title="Idle" value={stats.idleInside} color="#ed6c02" /></Grid>
      </Grid>
    </Box>
  );
};

export default GeoFencePanel;
