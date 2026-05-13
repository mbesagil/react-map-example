import { create } from 'zustand';
import { calculateNextPosition } from '../utils/movement';

const TILE_LAYERS = {
  standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
};

const KONYA_COORDS = { lat: 37.8714, lng: 32.4846 };

// --- MAP SLICE ---
const createMapSlice = (set, get) => ({
  tileType: 'standard',
  toggleTile: () => set((state) => ({ 
    tileType: state.tileType === 'standard' ? 'satellite' : 'standard' 
  })),
  getTileUrl: () => TILE_LAYERS[get().tileType],
  getIsSatellite: () => get().tileType === 'satellite',
});

// --- VEHICLE SLICE ---
const createVehicleSlice = (set, get) => ({
  vehicles: [
    { id: 1, name: 'Konya Express', plate: '42 ABC 42', status: 'idle', speed: 60, position: KONYA_COORDS, target: null }
  ],
  selectedVehicleId: null,
  selectVehicle: (id) => set((state) => ({ selectedVehicleId: state.selectedVehicleId === id ? null : id })),
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
    vehicles: state.vehicles.map((v) => v.id === id ? { ...v, target: { lat, lng }, status: 'moving' } : v)
  })),
  tick: () => {
    const { vehicles } = get();
    if (!vehicles.some(v => v.status === 'moving')) return;
    set((state) => ({
      vehicles: state.vehicles.map((v) => {
        if (v.status !== 'moving' || !v.target) return v;
        const next = calculateNextPosition(v.position, v.target, parseFloat(v.speed), 1);
        return { ...v, position: { lat: next.lat, lng: next.lng }, status: next.arrived ? 'arrived' : 'moving' };
      })
    }));
  },
});

// --- REGION/DRAW SLICE ---
const createRegionSlice = (set, get) => ({
  searchResults: [],
  selectedRegion: null,
  regionLoading: false,
  
  // Handlers
  setRegionLoading: (loading) => set({ regionLoading: loading }),
  setSearchResults: (results) => set({ searchResults: results }),
  
  // Select Search Region (replaces everything else)
  selectRegion: (region) => set({ 
    selectedRegion: {
      ...region,
      source: 'search' // Tag the source
    }, 
    searchResults: [] 
  }),

  // Set Manually Drawn Polygon (replaces everything else)
  setDrawnPolygon: (geojson) => set({
    selectedRegion: {
      display_name: 'Manually Drawn Area',
      geojson: geojson,
      source: 'draw',
      place_id: 'manual-' + Date.now()
    },
    searchResults: []
  }),

  clearRegion: () => set({ selectedRegion: null, searchResults: [] }),
});

// --- UNIFIED STORE ---
export const useStore = create((...a) => ({
  ...createMapSlice(...a),
  ...createVehicleSlice(...a),
  ...createRegionSlice(...a),
}));
