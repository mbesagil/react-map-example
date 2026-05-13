import { useState } from 'react';

const TILE_LAYERS = {
  standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
};

const useMapTiles = () => {
  const [tileType, setTileType] = useState('standard');

  const toggleTile = () => {
    setTileType((prev) => (prev === 'standard' ? 'satellite' : 'standard'));
  };

  return {
    currentTileUrl: TILE_LAYERS[tileType],
    toggleTile,
    isSatellite: tileType === 'satellite',
  };
};

export default useMapTiles;
