import React, { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import MapView from './components/Map/MapView';
import VehiclePanel from './components/Vehicles/VehiclePanel';
import RegionSearchBar from './components/Region/RegionSearchBar';
import GeoFencePanel from './components/Region/GeoFencePanel';
import { useStore } from './store/useStore';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function App() {
  const tick = useStore((state) => state.tick);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const SidebarContent = (
    <VehiclePanel onSelectVehicle={() => isMobile && setMobileOpen(false)}>
      <RegionSearchBar />
      <GeoFencePanel />
    </VehiclePanel>
  );

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Navbar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      
      <div className="flex flex-1 overflow-hidden relative">
        {!isMobile && <aside>{SidebarContent}</aside>}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 320 } }}
        >
          {SidebarContent}
        </Drawer>

        <main className="flex-grow relative">
          <MapView />
        </main>
      </div>
    </div>
  );
}

export default App;
