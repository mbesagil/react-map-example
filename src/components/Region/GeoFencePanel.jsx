import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GpsOffIcon from '@mui/icons-material/GpsOff';

const StatCard = ({ title, value, icon, color }) => (
  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', borderColor: color }}>
    {icon}
    <Typography variant="h6" sx={{ fontWeight: 'bold', color }}>{value}</Typography>
    <Typography variant="caption" color="text.secondary">{title}</Typography>
  </Paper>
);

const GeoFencePanel = ({ stats, regionName }) => {
  if (!regionName) return null;

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f4f8', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AssessmentIcon sx={{ mr: 1, color: '#1976d2' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Zone Analytics: {regionName.split(',')[0]}
        </Typography>
      </Box>
      
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <StatCard 
            title="Inside" 
            value={stats.insideCount} 
            icon={<GpsFixedIcon sx={{ fontSize: 16, color: '#4caf50' }} />} 
            color="#4caf50" 
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard 
            title="Outside" 
            value={stats.outsideCount} 
            icon={<GpsOffIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />} 
            color="#9e9e9e" 
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard 
            title="Moving In" 
            value={stats.movingInside} 
            color="#2e7d32" 
          />
        </Grid>
        <Grid item xs={6}>
          <StatCard 
            title="Idle In" 
            value={stats.idleInside} 
            color="#ed6c02" 
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeoFencePanel;
