import { useState, useCallback } from 'react';

const useRegionSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRegion = useCallback(async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('Failed to fetch regions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectRegion = (region) => {
    setSelectedRegion(region);
    setSearchResults([]); // Clear list after selection
  };

  const clearRegion = () => {
    setSelectedRegion(null);
  };

  return {
    searchResults,
    selectedRegion,
    loading,
    error,
    searchRegion,
    selectRegion,
    clearRegion,
  };
};

export default useRegionSearch;
