import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

// Function to create custom SVG markers
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="${color}" stroke="white" stroke-width="1.5"/>
        <circle cx="12" cy="9" r="3" fill="white"/>
      </svg>
    `,
    className: 'custom-marker-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const COLORS = {
  GRAY: '#9e9e9e',
  BLUE: '#1976d2',
  GREEN: '#4caf50',
  REGION: '#ff5722'
};

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => onMapClick(e.latlng.lat, e.latlng.lng),
  });
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

// Component to fit bounds to a selected region
const FitRegionBounds = ({ geojson }) => {
  const map = useMap();
  useEffect(() => {
    if (geojson) {
      const layer = L.geoJSON(geojson);
      map.fitBounds(layer.getBounds(), { padding: [50, 50], maxZoom: 12, animate: true });
    }
  }, [geojson, map]);
  return null;
};

const MapView = ({ currentTileUrl, vehicles, selectedVehicleId, onSetTarget, selectedRegion }) => {
  const position = [39.9208, 32.8541];
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  const handleMapClick = (lat, lng) => {
    if (selectedVehicleId) onSetTarget(selectedVehicleId, lat, lng);
  };

  const getVehicleColor = (vehicle) => {
    if (vehicle.status === 'moving') return COLORS.GREEN;
    if (vehicle.id === selectedVehicleId) return COLORS.BLUE;
    return COLORS.GRAY;
  };

  return (
    <MapContainer
      center={position}
      zoom={6}
      scrollWheelZoom={true}
      className="w-full h-full"
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={currentTileUrl}
      />

      <MapClickHandler onMapClick={handleMapClick} />
      {selectedVehicle && <CenterMap position={selectedVehicle.position} selectedVehicleId={selectedVehicleId} />}
      
      {/* Region Boundary Rendering */}
      {selectedRegion?.geojson && (
        <>
          <GeoJSON 
            data={selectedRegion.geojson} 
            style={{
              color: COLORS.REGION,
              weight: 3,
              opacity: 0.7,
              fillColor: COLORS.REGION,
              fillOpacity: 0.1
            }}
          />
          <FitRegionBounds geojson={selectedRegion.geojson} />
        </>
      )}

      {vehicles?.map((vehicle) => {
        const isSelected = vehicle.id === selectedVehicleId;
        const color = getVehicleColor(vehicle);
        return (
          <React.Fragment key={vehicle.id}>
            {vehicle.target && (
              <Polyline 
                positions={[[vehicle.position.lat, vehicle.position.lng], [vehicle.target.lat, vehicle.target.lng]]}
                color={isSelected ? "#1976d2" : "#666"}
                dashArray="5, 10"
                weight={2}
              />
            )}
            <Marker position={[vehicle.position.lat, vehicle.position.lng]} icon={createCustomIcon(color)}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-lg" style={{ color }}>{vehicle.name} {isSelected && "(Selected)"}</h3>
                  <p className="text-sm text-gray-600">Plate: {vehicle.plate}</p>
                  <hr className="my-2" />
                  <div className="flex flex-col gap-1 text-sm">
                    <span><strong>Speed:</strong> {vehicle.speed} km/h</span>
                    <span><strong>Status:</strong> <span className={`font-semibold`} style={{ color }}>{vehicle.status}</span></span>
                  </div>
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
