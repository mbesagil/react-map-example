import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Typography from '@mui/material/Typography';

const RegionSearchBar = ({ onSearch, results, onSelect, loading, selectedRegion, onClear }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search city/region..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  (query || selectedRegion) && (
                    <IconButton size="small" onClick={handleClear}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )
                )}
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: 'white', borderRadius: 1 }}
        />
      </form>

      {results.length > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'absolute', 
            top: '100%', 
            left: 0, 
            right: 0, 
            zIndex: 1100, 
            mt: 0.5,
            maxHeight: 300,
            overflowY: 'auto'
          }}
        >
          <List dense>
            {results.map((result) => (
              <ListItem 
                button 
                key={result.place_id} 
                onClick={() => {
                  onSelect(result);
                  setQuery(result.display_name);
                }}
              >
                <ListItemText 
                  primary={result.display_name} 
                  secondary={result.type}
                  primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {selectedRegion && !results.length && (
        <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5, px: 1 }}>
          Selected: {selectedRegion.display_name.split(',')[0]}
        </Typography>
      )}
    </Box>
  );
};

export default RegionSearchBar;
