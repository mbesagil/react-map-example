import React from 'react';
import { Box, Typography, Paper, Grid, useTheme } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GpsOffIcon from '@mui/icons-material/GpsOff';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import { useStore } from '../../store/useStore';
import { useMemo } from 'react';
import { isPointInPolygon } from '../../utils/geo';
import { useTranslation } from 'react-i18next';

const StatCard = ({ title, value, icon, color }) => (
  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', borderColor: color }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
      {icon}
      <Typography variant="h6" sx={{ fontWeight: 'bold', color, lineHeight: 1 }}>{value}</Typography>
    </Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{title}</Typography>
  </Paper>
);

const GeoFencePanel = () => {
  const { t } = useTranslation();
  const theme = useTheme();
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
    <Box sx={{ 
      mt: 1, 
      p: 1.5, 
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.1)' : '#f0f4f8', 
      borderRadius: 2 
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <AssessmentIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{t('analytics')}: {selectedRegion.display_name.split(',')[0]}</Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item="true" xs={6}>
          <StatCard title={t('inside')} value={stats.insideCount} icon={<GpsFixedIcon sx={{ fontSize: 16, color: '#4caf50' }} />} color="#4caf50" />
        </Grid>
        <Grid item="true" xs={6}>
          <StatCard title={t('outside')} value={stats.outsideCount} icon={<GpsOffIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />} color="#9e9e9e" />
        </Grid>
        <Grid item="true" xs={6}>
          <StatCard title={t('moving')} value={stats.movingInside} icon={<PlayCircleFilledIcon sx={{ fontSize: 16, color: '#4caf50' }} />} color="#4caf50" />
        </Grid>
        <Grid item="true" xs={6}>
          <StatCard title={t('idle')} value={stats.idleInside} icon={<PauseCircleFilledIcon sx={{ fontSize: 16, color: '#ed6c02' }} />} color="#ed6c02" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeoFencePanel;
