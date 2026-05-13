import React from 'react';
import { Box, Typography, Button, Container, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MapIcon from '@mui/icons-material/Map';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #115293 100%)',
        color: 'white'
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={24} 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: 6,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Stack spacing={4} alignItems="center">
            <Box 
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: 'primary.main', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)'
              }}
            >
              <MapIcon sx={{ fontSize: 60, color: 'white' }} />
            </Box>
            
            <Box>
              <Typography 
                variant="overline" 
                sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold', 
                  letterSpacing: 2,
                  display: 'block',
                  mb: 0.5
                }}
              >
                Vehicle Management
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: '900', color: 'primary.main', mb: 1 }}>
                {t('welcome_title')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                {t('welcome_subtitle')}
              </Typography>
            </Box>

            <Button 
              variant="contained" 
              size="large" 
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/demo')}
              sx={{ 
                px: 6, 
                py: 2, 
                borderRadius: 4, 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 12px 24px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  boxShadow: '0 16px 32px rgba(25, 118, 210, 0.5)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {t('start_demo')}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default LandingPage;
