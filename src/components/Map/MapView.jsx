import React, { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useStore } from '../../store/useStore';
import { isPointInPolygon } from '../../utils/geo';

const createCustomIcon = (color, isInside) => {
  const halo = isInside ? `<circle cx="12" cy="9" r="10" stroke="${color}" stroke-width="2" stroke-dasharray="2,2" opacity="0.5"><animate attributeName="r" from="8" to="12" dur="1.5s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" /></circle>` : '';
  return L.divIcon({
    html: `<svg width="40" height="40" viewBox="-8 -8 40 40" fill="none">${halo}<path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="${color}" stroke="white" stroke-width="1.5"/><circle cx="12" cy="9" r="3" fill="white"/></svg>`,
    className: 'custom-marker-icon', iconSize: [40, 40], iconAnchor: [20, 30], popupAnchor: [0, -30]
  });
};

const COLORS = { GRAY: '#9e9e9e', BLUE: '#1976d2', GREEN: '#4caf50', REGION: '#ff5722' };

const MapClickHandler = () => {
  const selectedVehicleId = useStore(state => state.selectedVehicleId);
  const setVehicleTarget = useStore(state => state.setVehicleTarget);
  useMapEvents({ click: (e) => { if (selectedVehicleId) setVehicleTarget(selectedVehicleId, e.latlng.lat, e.latlng.lng); } });
  return null;
};

const CenterMap = ({ position, selectedVehicleId }) => {
  const map = useMap();
  const prevIdRef = useRef();
  useEffect(() => {
    if (position && selectedVehicleId && selectedVehicleId !== prevIdRef.current) {
      map.flyTo([position.lat, position.lng], map.getZoom(), { animate: true, duration: 1.5 });
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
    if (selectedRegion?.geojson) {
      const layer = L.geoJSON(selectedRegion.geojson, { style: { color: COLORS.REGION, weight: 2, fillColor: COLORS.REGION, fillOpacity: 0.2 } });
      layer.addTo(layerGroupRef.current);
      map.fitBounds(layer.getBounds(), { padding: [50, 50], maxZoom: 12, animate: true });
    }
    return () => { layerGroupRef.current.clearLayers(); };
  }, [selectedRegion, map]);
  return null;
};

const MapView = () => {
  const tileUrl = useStore(state => state.getTileUrl());
  const vehicles = useStore(state => state.vehicles);
  const selectedVehicleId = useStore(state => state.selectedVehicleId);
  const selectVehicle = useStore(state => state.selectVehicle);
  const selectedRegion = useStore(state => state.selectedRegion);

  const selectedVehicle = useMemo(() => vehicles.find(v => v.id === selectedVehicleId), [vehicles, selectedVehicleId]);
  const insideIds = useMemo(() => {
    if (!selectedRegion?.geojson) return [];
    return vehicles.filter(v => isPointInPolygon(v.position, selectedRegion.geojson)).map(v => v.id);
  }, [vehicles, selectedRegion]);

  return (
    <MapContainer center={[39.9208, 32.8541]} zoom={6} className="w-full h-full" style={{ height: '100%', width: '100%' }}>
      <TileLayer url={tileUrl} />
      <MapClickHandler />
      <RegionLayer />
      {selectedVehicle && <CenterMap position={selectedVehicle.position} selectedVehicleId={selectedVehicleId} />}
      {vehicles.map((v) => {
        const isSelected = v.id === selectedVehicleId;
        const color = v.status === 'moving' ? COLORS.GREEN : (isSelected ? COLORS.BLUE : COLORS.GRAY);
        const isInside = insideIds.includes(v.id);
        return (
          <React.Fragment key={v.id}>
            {v.target && <Polyline positions={[[v.position.lat, v.position.lng], [v.target.lat, v.target.lng]]} color={isSelected ? "#1976d2" : "#666"} dashArray="5, 10" weight={2} />}
            <Marker 
              position={[v.position.lat, v.position.lng]} 
              icon={createCustomIcon(color, isInside)}
              eventHandlers={{ click: () => selectVehicle(v.id) }}
            >
              <Popup>
                <div className="p-1">
                  <strong>{v.name}</strong><br/>Plate: {v.plate}<br/>Status: {v.status}
                  {isInside && <div style={{ color: '#2e7d32', fontWeight: 'bold' }}>📍 Inside Polygon</div>}
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
