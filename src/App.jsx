import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Layout/Navbar';
import MapView from './components/Map/MapView';
import VehiclePanel from './components/Vehicles/VehiclePanel';
import RegionSearchBar from './components/Region/RegionSearchBar';
import GeoFencePanel from './components/Region/GeoFencePanel';
import { useStore } from './store/useStore';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const INITIAL_VEHICLES = [
  { id: 1, name: 'Konya Express', plate: '42 ABC 42', status: 'idle', speed: 60, position: { lat: 37.8714, lng: 32.4846 }, target: null }
];

function App() {
  const tick = useStore((state) => state.tick);
  const darkMode = useStore((state) => state.darkMode);
  const setVehicles = useStore((state) => state.setVehicles);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: { fontFamily: 'Inter, Roboto, sans-serif' },
  }), [darkMode]);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Simulation API Call
  useEffect(() => {
    const timer = setTimeout(() => {
      setVehicles(INITIAL_VEHICLES);
    }, 2000); // 2 second fake loading
    return () => clearTimeout(timer);
  }, [setVehicles]);

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`flex flex-col h-screen w-full overflow-hidden ${darkMode ? 'dark' : ''}`}>
        <Navbar onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <div className="flex flex-1 overflow-hidden relative">
          {!isMobile && <aside className="z-10 shadow-xl">{SidebarContent}</aside>}
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
    </ThemeProvider>
  );
}

export default App;
