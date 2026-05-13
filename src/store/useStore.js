import { create } from 'zustand';
import { calculateNextPosition } from '../utils/movement';

const TILE_LAYERS = {
  standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
};

const KONYA_COORDS = { lat: 37.8714, lng: 32.4846 };

export const useStore = create((set, get) => ({
  // TILE STATE
  tileType: 'standard',
  toggleTile: () => set((state) => ({ 
    tileType: state.tileType === 'standard' ? 'satellite' : 'standard' 
  })),

  // VEHICLE STATE
  vehicles: [
    { id: 1, name: 'Konya Express', plate: '42 ABC 42', status: 'idle', speed: 60, position: KONYA_COORDS, target: null }
  ],
  selectedVehicleId: null,
  selectVehicle: (id) => set({ selectedVehicleId: id }),
  addVehicle: (vehicleData) => set((state) => ({
    vehicles: [...state.vehicles, {
      id: Date.now(),
      status: 'idle',
      ...vehicleData,
      position: { lat: parseFloat(vehicleData.latitude), lng: parseFloat(vehicleData.longitude) },
      target: null
    }]
  })),
  setVehicleTarget: (id, lat, lng) => set((state) => ({
    vehicles: state.vehicles.map((v) => 
      v.id === id ? { ...v, target: { lat, lng }, status: 'moving' } : v
    )
  })),

  // REGION STATE
  searchResults: [],
  selectedRegion: null,
  regionLoading: false,
  setRegionLoading: (loading) => set({ regionLoading: loading }),
  setSearchResults: (results) => set({ searchResults: results }),
  selectRegion: (region) => set({ selectedRegion: region, searchResults: [] }),
  clearRegion: () => set({ selectedRegion: null, searchResults: [] }),

  // SIMULATION LOGIC
  tick: () => {
    const { vehicles } = get();
    if (!vehicles.some(v => v.status === 'moving')) return;

    set((state) => ({
      vehicles: state.vehicles.map((v) => {
        if (v.status !== 'moving' || !v.target) return v;
        const next = calculateNextPosition(v.position, v.target, parseFloat(v.speed), 1);
        return {
          ...v,
          position: { lat: next.lat, lng: next.lng },
          status: next.arrived ? 'arrived' : 'moving'
        };
      })
    }));
  },

  // Helper actions to get derived data without creating infinite loops
  getTileUrl: () => TILE_LAYERS[get().tileType],
  getIsSatellite: () => get().tileType === 'satellite'
}));
