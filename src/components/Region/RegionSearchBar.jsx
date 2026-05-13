import React, { useState } from 'react';
import { Box, TextField, List, ListItem, ListItemText, Paper, CircularProgress, InputAdornment, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useStore } from '../../store/useStore';

const RegionSearchBar = () => {
  const [query, setQuery] = useState('');
  const { searchResults, selectedRegion, regionLoading, setSearchResults, setRegionLoading, selectRegion, clearRegion } = useStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setRegionLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&addressdetails=1&q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRegionLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    clearRegion();
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', mb: 1 }}>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth size="small" placeholder="Search region..."
          value={query} onChange={(e) => setQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              endAdornment: <InputAdornment position="end">
                {regionLoading ? <CircularProgress size={20} /> : (query && <IconButton size="small" onClick={handleClear}><ClearIcon fontSize="small" /></IconButton>)}
              </InputAdornment>
            }
          }}
        />
      </form>
      {searchResults.length > 0 && (
        <Paper elevation={3} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1100, mt: 0.5, maxHeight: 200, overflowY: 'auto' }}>
          <List dense>
            {searchResults.map((r) => (
              <ListItem 
                key={r.place_id} 
                disablePadding
              >
                <Box 
                  component="div" 
                  onClick={() => { selectRegion(r); setQuery(r.display_name); }}
                  sx={{ 
                    width: '100%', 
                    px: 2, 
                    py: 1, 
                    cursor: 'pointer', 
                    '&:hover': { bgcolor: 'action.hover' } 
                  }}
                >
                  <ListItemText 
                    primary={r.display_name} 
                    secondary={r.type} 
                    slotProps={{ primary: { noWrap: true, variant: 'body2' } }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      {selectedRegion && <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>Selected: {selectedRegion.display_name.split(',')[0]}</Typography>}
    </Box>
  );
};

export default RegionSearchBar;
