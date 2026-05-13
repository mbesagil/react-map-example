import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMapSlice } from './slices/mapSlice';
import { createVehicleSlice } from './slices/vehicleSlice';
import { createRegionSlice } from './slices/regionSlice';

// --- UNIFIED STORE WITH PERSISTENCE ---
export const useStore = create(
  persist(
    (set, get, api) => ({
      ...createMapSlice(set, get),
      ...createVehicleSlice(set, get),
      ...createRegionSlice(set, get),
    }),
    {
      name: 'vehicle-tracker-settings',
      storage: createJSONStorage(() => localStorage),
      // PERSIST both darkMode AND tileType
      partialize: (state) => ({ 
        darkMode: state.darkMode,
        tileType: state.tileType 
      }), 
    }
  )
);
