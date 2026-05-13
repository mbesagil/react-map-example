import React from 'react';
import Navbar from './components/Layout/Navbar';
import MapView from './components/Map/MapView';
import useMapTiles from './hooks/useMapTiles';

function App() {
  const { currentTileUrl, toggleTile, isSatellite } = useMapTiles();

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Navbar isSatellite={isSatellite} onToggle={toggleTile} />
      <main className="flex-grow w-full relative">
        <MapView currentTileUrl={currentTileUrl} />
      </main>
    </div>
  );
}

export default App;
