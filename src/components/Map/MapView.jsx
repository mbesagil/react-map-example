import React, { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { useStore } from '../../store/useStore';
import { isPointInPolygon } from '../../utils/geo';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography, useTheme, Button } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SatelliteIcon from '@mui/icons-material/Satellite';
import CustomDrawControl from './CustomDrawControl';
import MuiZoomControl from './MuiZoomControl';

const VEHICLE_PATHS = {
  car: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.27-3.82c.07-.21.27-.38.52-.38h10.42c.25 0 .45.17.52.38L19 11H5z',
  motorcycle: 'M18 10h-1.07l-3.37-5.05c-.32-.47-.85-.75-1.42-.75H7.5c-.83 0-1.5.67-1.5 1.5S6.67 6.5 7.5 6.5h3.9l2.33 3.5H7c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3v-2c0-1.66-1.34-3-3-3zM7 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
  service: 'M12 2c-4.42 0-8 3.58-8 8v10c0 1.1.9 2 2 2h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c1.1 0 2-.9 2-2V10c0-4.42-3.58-8-8-8zm-4 15c-.83 0-1.5-.67-1.5-1.5S7.17 14 8 14s1.5.67 1.5 1.5S8.83 17 8 17zm8 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 11H6V7h12v4z',
  truck: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-1h-1.18C18.42 16.2 17.78 15.6 17 15.6c-.78 0-1.42.6-1.82 1.4H9.82C9.42 16.2 8.78 15.6 8 15.6c-.78 0-1.42.6-1.82 1.4H3V6h12v5h5v6z'
};

const COLORS = { 
  GRAY: '#9e9e9e', 
  BLUE: '#1976d2', 
  GREEN: '#4caf50', 
  ORANGE: '#ed6c02',
  REGION: '#ff5722' 
};

const createCustomIcon = (color, isInside, type = 'car', status = 'idle') => {
  const isMoving = status === 'moving';
  const halo = isInside ? `<circle cx="12" cy="9" r="10" stroke="${color}" stroke-width="2" stroke-dasharray="2,2" opacity="0.5"><animate attributeName="r" from="8" to="12" dur="1.5s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" /></circle>` : '';
  
  // Moving indicator (pulsating background circle)
  const movingPulse = isMoving ? `<circle cx="12" cy="9" r="6" fill="${color}" opacity="0.3"><animate attributeName="r" from="4" to="14" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" /></circle>` : '';

  const innerIconPath = VEHICLE_PATHS[type] || VEHICLE_PATHS.car;
  
  return L.divIcon({
    html: `<svg width="40" height="40" viewBox="-8 -8 40 40" fill="none">
      ${halo}
      ${movingPulse}
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="${color}" stroke="white" stroke-width="1.5"/>
      <g transform="translate(8.5, 5.5) scale(0.3)">
        <path d="${innerIconPath}" fill="white"/>
      </g>
    </svg>`,
    className: 'custom-marker-icon', iconSize: [40, 40], iconAnchor: [20, 30], popupAnchor: [0, -30]
  });
};

const MapClickHandler = () => {
  const selectedVehicleId = useStore(state => state.selectedVehicleId);
  const setVehicleTarget = useStore(state => state.setVehicleTarget);
  useMapEvents({ 
    click: (e) => { 
      if (e.originalEvent.target.closest('.mui-map-control') || e.originalEvent.target.closest('.leaflet-control')) {
        return;
      }
      if (selectedVehicleId) setVehicleTarget(selectedVehicleId, e.latlng.lat, e.latlng.lng); 
    } 
  });
  return null;
};

const CenterMap = ({ position, selectedVehicleId }) => {
  const map = useMap();
  const prevIdRef = useRef();
  useEffect(() => {
    if (position && selectedVehicleId && selectedVehicleId !== prevIdRef.current) {
      map.flyTo([position.lat, position.lng], 14, { animate: true, duration: 1.5 });
      prevIdRef.current = selectedVehicleId;
    }
    if (!selectedVehicleId) prevIdRef.current = null;
  }, [position, selectedVehicleId, map]);
  return null;
};

const RegionLayer = () => {
  const map = useMap();
  const selectedRegion = useStore(state => state.selectedRegion);
  const layerGroupRef = useRef(L.layerGroup());

  useEffect(() => {
    layerGroupRef.current.addTo(map);
    layerGroupRef.current.clearLayers();

    if (selectedRegion && selectedRegion.geojson) {
      const layer = L.geoJSON(selectedRegion.geojson, { 
        style: { 
          color: COLORS.REGION, 
          weight: 3, 
          fillColor: COLORS.REGION, 
          fillOpacity: 0.2,
          dashArray: selectedRegion.source === 'draw' ? '5, 5' : '0'
        } 
      });
      layer.addTo(layerGroupRef.current);
      
      if (selectedRegion.source === 'search') {
        map.fitBounds(layer.getBounds(), { padding: [50, 50], maxZoom: 12, animate: true });
      }
    }
    
    return () => { layerGroupRef.current.clearLayers(); };
  }, [selectedRegion, map]);

  return null;
};

const MapView = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const tileUrl = useStore(state => state.getTileUrl());
  const isSatellite = useStore(state => state.getIsSatellite());
  const toggleTile = useStore(state => state.toggleTile);
  const vehicles = useStore(state => state.vehicles);
  const vehiclesLoading = useStore(state => state.vehiclesLoading);
  const selectedVehicleId = useStore(state => state.selectedVehicleId);
  const selectVehicle = useStore(state => state.selectVehicle);
  const selectedRegion = useStore(state => state.selectedRegion);
  const setDrawnPolygon = useStore(state => state.setDrawnPolygon);

  const selectedVehicle = useMemo(() => vehicles.find(v => v.id === selectedVehicleId), [vehicles, selectedVehicleId]);
  const insideIds = useMemo(() => {
    if (!selectedRegion?.geojson) return [];
    return vehicles.filter(v => isPointInPolygon(v.position, selectedRegion.geojson)).map(v => v.id);
  }, [vehicles, selectedRegion]);

  const getVehicleColor = (vehicle, isSelected) => {
    if (isSelected) return COLORS.BLUE;
    switch (vehicle.status) {
      case 'moving': return COLORS.GREEN;
      case 'stopped': return COLORS.ORANGE;
      case 'arrived': return COLORS.BLUE;
      default: return COLORS.GRAY;
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Map Type Switcher Floating Button */}
      <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={isSatellite ? <MapIcon /> : <SatelliteIcon />}
          onClick={toggleTile}
          sx={{ 
            bgcolor: theme.palette.background.paper, 
            color: theme.palette.text.primary,
            '&:hover': { bgcolor: theme.palette.action.hover },
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: 3
          }}
        >
          {isSatellite ? t('standard') : t('satellite')}
        </Button>
      </Box>

      {vehiclesLoading && (
        <Box sx={{ 
          position: 'absolute', inset: 0, zIndex: 10000, 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)', 
          backdropFilter: 'blur(4px)'
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography sx={{ mt: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>{t('loading_data')}</Typography>
        </Box>
      )}
      <MapContainer 
        center={[39.9208, 32.8541]} 
        zoom={6} 
        className="w-full h-full" 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer url={tileUrl} />
        {!vehiclesLoading && (
          <>
            <MuiZoomControl />
            <MapClickHandler />
            <RegionLayer />
            <CustomDrawControl onCreated={(e) => setDrawnPolygon(e.layer.toGeoJSON().geometry)} color={COLORS.REGION} />
            {selectedVehicle && <CenterMap position={selectedVehicle.position} selectedVehicleId={selectedVehicleId} />}
            {vehicles.map((v) => {
              const isSelected = v.id === selectedVehicleId;
              const color = getVehicleColor(v, isSelected);
              const isInside = insideIds.includes(v.id);
              return (
                <React.Fragment key={v.id}>
                  {v.target && v.status !== 'arrived' && (
                    <Polyline 
                      positions={[[v.position.lat, v.position.lng], [v.target.lat, v.target.lng]]} 
                      color={isSelected ? COLORS.BLUE : COLORS.GRAY} 
                      dashArray="5, 10" 
                      weight={2} 
                      opacity={0.6}
                    />
                  )}
                  <Marker position={[v.position.lat, v.position.lng]} icon={createCustomIcon(color, isInside, v.type, v.status)} eventHandlers={{ click: () => selectVehicle(v.id) }}>
                    <Popup>
                      <div className="p-1 text-sm">
                        <h3 className="font-bold text-lg" style={{ color }}>{v.name}</h3>
                        <p>{t('plate')}: {v.plate}</p>
                        <p>{t('speed')}: {v.speed} km/h</p>
                        <p>{t('status')}: <span style={{ color, fontWeight: 'bold' }}>{t(v.status)}</span></p>
                        {isInside && <p className="text-green-600 font-bold">{t('inside_polygon')}</p>}
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
          </>
        )}
      </MapContainer>
    </Box>
  );
};

export default MapView;
