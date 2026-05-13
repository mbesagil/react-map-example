import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const MapView = ({ currentTileUrl }) => {
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
    </MapContainer>
  );
};

export default MapView;
