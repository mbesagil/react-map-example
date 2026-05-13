import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet default icon issues
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle map clicks
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapView = ({ currentTileUrl, vehicles, selectedVehicleId, onSetTarget }) => {
  const position = [39.9208, 32.8541]; // Turkey center

  const handleMapClick = (lat, lng) => {
    if (selectedVehicleId) {
      onSetTarget(selectedVehicleId, lat, lng);
    }
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

      {vehicles?.map((vehicle) => {
        const isSelected = vehicle.id === selectedVehicleId;
        
        return (
          <React.Fragment key={vehicle.id}>
            {/* Draw path to target if moving or has target */}
            {vehicle.target && (
              <Polyline 
                positions={[
                  [vehicle.position.lat, vehicle.position.lng],
                  [vehicle.target.lat, vehicle.target.lng]
                ]}
                color={isSelected ? "#1976d2" : "#666"}
                dashArray="5, 10"
                weight={2}
              />
            )}

            <Marker 
              position={[vehicle.position.lat, vehicle.position.lng]}
              opacity={isSelected ? 1 : 0.7}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-lg">{vehicle.name} {isSelected && "(Selected)"}</h3>
                  <p className="text-sm text-gray-600">Plate: {vehicle.plate}</p>
                  <hr className="my-2" />
                  <div className="flex flex-col gap-1 text-sm">
                    <span><strong>Speed:</strong> {vehicle.speed} km/h</span>
                    <span><strong>Status:</strong> <span className={`font-semibold ${vehicle.status === 'moving' ? 'text-green-600' : ''}`}>{vehicle.status}</span></span>
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
