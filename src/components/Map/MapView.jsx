import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet default icon issues in React/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapView = ({ currentTileUrl, vehicles }) => {
  const position = [39.9208, 32.8541]; // Turkey center

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

      {vehicles?.map((vehicle) => (
        <Marker 
          key={vehicle.id} 
          position={[vehicle.position.lat, vehicle.position.lng]}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-lg">{vehicle.name}</h3>
              <p className="text-sm text-gray-600">Plate: {vehicle.plate}</p>
              <hr className="my-2" />
              <div className="flex flex-col gap-1 text-sm">
                <span><strong>Speed:</strong> {vehicle.speed} km/h</span>
                <span><strong>Status:</strong> {vehicle.status}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
