import React from 'react';
import Navbar from './components/Layout/Navbar';
import MapView from './components/Map/MapView';
import VehiclePanel from './components/Vehicles/VehiclePanel';
import useMapTiles from './hooks/useMapTiles';
import useVehicles from './hooks/useVehicles';

function App() {
  const { currentTileUrl, toggleTile, isSatellite } = useMapTiles();
  const { 
    vehicles, 
    addVehicle, 
    selectedVehicleId, 
    selectVehicle, 
    setVehicleTarget 
  } = useVehicles();

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Navbar isSatellite={isSatellite} onToggle={toggleTile} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side Panel */}
        <aside>
          <VehiclePanel 
            vehicles={vehicles} 
            onAddVehicle={addVehicle} 
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={selectVehicle}
          />
        </aside>

        {/* Main Map Content */}
        <main className="flex-grow relative">
          <MapView 
            currentTileUrl={currentTileUrl} 
            vehicles={vehicles} 
            selectedVehicleId={selectedVehicleId}
            onSetTarget={setVehicleTarget}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
