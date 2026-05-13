const TILE_LAYERS = {
  standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
};

export const createMapSlice = (set, get) => ({
  tileType: 'standard',
  darkMode: false, 
  toggleTile: () => set((state) => ({ tileType: state.tileType === 'standard' ? 'satellite' : 'standard' })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  getTileUrl: () => TILE_LAYERS[get().tileType],
  getIsSatellite: () => get().tileType === 'satellite',
});
