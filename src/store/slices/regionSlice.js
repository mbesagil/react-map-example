export const createRegionSlice = (set, get) => ({
  searchResults: [],
  selectedRegion: null,
  regionLoading: false,
  setRegionLoading: (loading) => set({ regionLoading: loading }),
  setSearchResults: (results) => set({ searchResults: results }),
  selectRegion: (region) => set({ selectedRegion: { ...region, source: 'search' }, searchResults: [] }),
  setDrawnPolygon: (geojson) => set({
    selectedRegion: { display_name: 'Manually Drawn Area', geojson: geojson, source: 'draw', place_id: 'manual-' + Date.now() },
    searchResults: []
  }),
  clearRegion: () => set({ selectedRegion: null, searchResults: [] }),
});
