import React, { useState, useEffect } from 'react';
import Navbar from '../components/Layout/Navbar';
import MapView from '../components/Map/MapView';
import VehiclePanel from '../components/Vehicles/VehiclePanel';
import RegionSearchBar from '../components/Region/RegionSearchBar';
import GeoFencePanel from '../components/Region/GeoFencePanel';
import { useStore } from '../store/useStore';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const INITIAL_VEHICLES = [
  { id: 1, name: 'Siyah Binek', plate: '42 ABC 01', status: 'idle', speed: 85, type: 'car', position: { lat: 37.8714, lng: 32.4846 }, target: null },
  { id: 2, name: 'Hızlı Kurye', plate: '42 MOT 12', status: 'idle', speed: 45, type: 'motorcycle', position: { lat: 37.8800, lng: 32.4900 }, target: null },
  { id: 3, name: 'Okul Servisi', plate: '42 SRV 44', status: 'idle', speed: 40, type: 'service', position: { lat: 37.8600, lng: 32.4700 }, target: null },
  { id: 4, name: 'Ağır Nakliye', plate: '42 KAM 99', status: 'idle', speed: 60, type: 'truck', position: { lat: 37.8500, lng: 32.5000 }, target: null },
  { id: 5, name: 'Mavi Sedan', plate: '42 XYZ 23', status: 'idle', speed: 110, type: 'car', position: { lat: 37.8900, lng: 32.5100 }, target: null },
  { id: 6, name: 'Paket Servis', plate: '42 MOT 55', status: 'idle', speed: 35, type: 'motorcycle', position: { lat: 37.8750, lng: 32.4800 }, target: null },
  { id: 7, name: 'Personel Servis', plate: '42 SRV 08', status: 'idle', speed: 50, type: 'service', position: { lat: 37.8400, lng: 32.4600 }, target: null },
  { id: 8, name: 'Hafriyat Kamyonu', plate: '42 KAM 11', status: 'idle', speed: 45, type: 'truck', position: { lat: 37.8300, lng: 32.4400 }, target: null },
  { id: 9, name: 'Beyaz SUV', plate: '42 SUV 77', status: 'idle', speed: 90, type: 'car', position: { lat: 37.9100, lng: 32.5200 }, target: null },
  { id: 10, name: 'Lojistik Tırı', plate: '42 LOG 01', status: 'idle', speed: 70, type: 'truck', position: { lat: 37.9200, lng: 32.5500 }, target: null },
  { id: 11, name: 'Başkent Lojistik', plate: '06 ANK 01', status: 'idle', speed: 80, type: 'truck', position: { lat: 39.9334, lng: 32.8597 }, target: null },
  { id: 12, name: 'Ankara Kurye', plate: '06 MOT 06', status: 'idle', speed: 50, type: 'motorcycle', position: { lat: 39.9208, lng: 32.8541 }, target: null },
  { id: 13, name: 'Boğaz Hattı', plate: '34 IST 01', status: 'idle', speed: 40, type: 'service', position: { lat: 41.0082, lng: 28.9784 }, target: null },
  { id: 14, name: 'Metropol Taksi', plate: '34 TKS 34', status: 'idle', speed: 90, type: 'car', position: { lat: 41.0500, lng: 29.0000 }, target: null }
];

const DashboardPage = () => {
  const tick = useStore((state) => state.tick);
  const darkMode = useStore((state) => state.darkMode);
  const setVehicles = useStore((state) => state.setVehicles);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const timer = setTimeout(() => {
      setVehicles(INITIAL_VEHICLES);
    }, 1500);
    return () => clearTimeout(timer);
  }, [setVehicles]);

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
    <div className={`flex flex-col h-screen w-full overflow-hidden ${darkMode ? 'dark' : ''}`}>
      <Navbar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        {!isMobile && <aside className="z-10 shadow-xl">{SidebarContent}</aside>}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 340 } }}
        >
          {SidebarContent}
        </Drawer>
        <main className="flex-grow relative">
          <MapView />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
