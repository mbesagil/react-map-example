import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

const createCustomIcon = (color, isInside) => {
  const halo = isInside ? `<circle cx="12" cy="9" r="10" stroke="${color}" stroke-width="2" stroke-dasharray="2,2" opacity="0.5">
    <animate attributeName="r" from="8" to="12" dur="1.5s" repeatCount="indefinite" />
    <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
  </circle>` : '';

  return L.divIcon({
    html: `
      <svg width="40" height="40" viewBox="-8 -8 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${halo}
        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="${color}" stroke="white" stroke-width="1.5"/>
        <circle cx="12" cy="9" r="3" fill="white"/>
      </svg>
    `,
    className: 'custom-marker-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 30],
    popupAnchor: [0, -30],
  });
};

const COLORS = { GRAY: '#9e9e9e', BLUE: '#1976d2', GREEN: '#4caf50', REGION: '#ff5722' };

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({ click: (e) => onMapClick(e.latlng.lat, e.latlng.lng) });
  return null;
};

const CenterMap = ({ position, selectedVehicleId }) => {
  const map = useMap();
  const prevIdRef = useRef();
  useEffect(() => {
    if (position && selectedVehicleId !== prevIdRef.current) {
      map.flyTo([position.lat, position.lng], map.getZoom(), { animate: true, duration: 1.5 });
      prevIdRef.current = selectedVehicleId;
    }
  }, [position, selectedVehicleId, map]);
  return null;
};

const RegionLayer = ({ selectedRegion }) => {
  const map = useMap();
  const layerGroupRef = useRef(L.layerGroup());
  useEffect(() => {
    layerGroupRef.current.addTo(map);
    layerGroupRef.current.clearLayers();
    if (selectedRegion?.geojson) {
      const geoJsonLayer = L.geoJSON(selectedRegion.geojson, {
        style: { color: COLORS.REGION, weight: 2, opacity: 0.8, fillColor: COLORS.REGION, fillOpacity: 0.2 }
      });
      geoJsonLayer.addTo(layerGroupRef.current);
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50], maxZoom: 12, animate: true });
    }
    return () => { layerGroupRef.current.clearLayers(); };
  }, [selectedRegion, map]);
  return null;
};

const MapView = ({ currentTileUrl, vehicles, selectedVehicleId, onSetTarget, selectedRegion, insideVehicles }) => {
  const position = [39.9208, 32.8541];
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const handleMapClick = (lat, lng) => { if (selectedVehicleId) onSetTarget(selectedVehicleId, lat, lng); };

  return (
    <MapContainer center={position} zoom={6} scrollWheelZoom={true} className="w-full h-full" style={{ height: '100%', width: '100%' }}>
      <TileLayer attribution='&copy; OpenStreetMap' url={currentTileUrl} />
      <MapClickHandler onMapClick={handleMapClick} />
      {selectedVehicle && <CenterMap position={selectedVehicle.position} selectedVehicleId={selectedVehicleId} />}
      <RegionLayer selectedRegion={selectedRegion} />

      {vehicles?.map((vehicle) => {
        const isSelected = vehicle.id === selectedVehicleId;
        const isInside = insideVehicles?.includes(vehicle.id);
        const color = vehicle.status === 'moving' ? COLORS.GREEN : (isSelected ? COLORS.BLUE : COLORS.GRAY);
        
        return (
          <React.Fragment key={vehicle.id}>
            {vehicle.target && (
              <Polyline positions={[[vehicle.position.lat, vehicle.position.lng], [vehicle.target.lat, vehicle.target.lng]]} color={isSelected ? "#1976d2" : "#666"} dashArray="5, 10" weight={2} />
            )}
            <Marker position={[vehicle.position.lat, vehicle.position.lng]} icon={createCustomIcon(color, isInside)}>
              <Popup>
                <div className="p-1 text-sm">
                  <h3 className="font-bold text-lg" style={{ color }}>{vehicle.name} {isInside && "📍"}</h3>
                  <p className="text-gray-600">Plate: {vehicle.plate}</p>
                  {isInside && <p className="text-green-600 font-bold">Inside Polygon</p>}
                  <hr className="my-2" />
                  <span><strong>Speed:</strong> {vehicle.speed} km/h</span><br/>
                  <span><strong>Status:</strong> {vehicle.status}</span>
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
