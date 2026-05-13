import React, { useState } from 'react';
import Navbar from './components/Layout/Navbar';
import MapView from './components/Map/MapView';
import VehiclePanel from './components/Vehicles/VehiclePanel';
import RegionSearchBar from './components/Region/RegionSearchBar';
import useMapTiles from './hooks/useMapTiles';
import useVehicles from './hooks/useVehicles';
import useRegionSearch from './hooks/useRegionSearch';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function App() {
  const { currentTileUrl, toggleTile, isSatellite } = useMapTiles();
  const { 
    vehicles, 
    addVehicle, 
    selectedVehicleId, 
    selectVehicle, 
    setVehicleTarget 
  } = useVehicles();

  const {
    searchResults,
    selectedRegion,
    loading: regionLoading,
    searchRegion,
    selectRegion,
    clearRegion
  } = useRegionSearch();

  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleSelectVehicle = (id) => {
    selectVehicle(id);
    if (isMobile) setMobileOpen(false);
  };

  const SidebarContent = (
    <VehiclePanel 
      vehicles={vehicles} 
      onAddVehicle={addVehicle} 
      selectedVehicleId={selectedVehicleId}
      onSelectVehicle={isMobile ? handleSelectVehicle : selectVehicle}
    >
      <RegionSearchBar 
        onSearch={searchRegion}
        results={searchResults}
        onSelect={selectRegion}
        loading={regionLoading}
        selectedRegion={selectedRegion}
        onClear={clearRegion}
      />
    </VehiclePanel>
  );

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Navbar 
        isSatellite={isSatellite} 
        onToggle={toggleTile} 
        onMenuClick={handleDrawerToggle}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        {!isMobile && <aside>{SidebarContent}</aside>}

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 320 },
          }}
        >
          {SidebarContent}
        </Drawer>

        {/* Main Map Content */}
        <main className="flex-grow relative">
          <MapView 
            currentTileUrl={currentTileUrl} 
            vehicles={vehicles} 
            selectedVehicleId={selectedVehicleId}
            onSetTarget={setVehicleTarget}
            selectedRegion={selectedRegion}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
