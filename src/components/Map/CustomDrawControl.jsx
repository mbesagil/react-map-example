import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, ButtonGroup, Tooltip, Zoom, Paper, IconButton } from '@mui/material';
import {
  Check as FinishIcon,
  Undo as UndoIcon,
  Close as CancelIcon,
  Hexagon as PolygonIcon
} from '@mui/icons-material';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { useTranslation } from 'react-i18next';

const CustomDrawControl = ({ onCreated, color }) => {
  const { t } = useTranslation();
  const map = useMap();
  const [isDrawing, setIsDrawing] = useState(false);
  const drawHandlerRef = useRef(null);
  const containerRef = useRef(null);

  // Prevent click propagation to map
  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
      L.DomEvent.disableScrollPropagation(containerRef.current);
    }
  }, []);

  useEffect(() => {
    const onDrawCreated = (e) => {
      onCreated(e);
      setIsDrawing(false);
      drawHandlerRef.current = null;
    };

    map.on(L.Draw.Event.CREATED, onDrawCreated);

    // Listen for escape key to cancel drawing
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawing) {
        cancelDrawing();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      map.off(L.Draw.Event.CREATED, onDrawCreated);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [map, onCreated, isDrawing]);

  const startDrawing = () => {
    if (drawHandlerRef.current) return;

    const handler = new L.Draw.Polygon(map, {
      allowIntersection: false,
      showArea: false,
      shapeOptions: { color: color || '#ff5722', weight: 3, fillOpacity: 0.2 }
    });

    drawHandlerRef.current = handler;
    handler.enable();
    setIsDrawing(true);
  };

  const cancelDrawing = () => {
    if (drawHandlerRef.current) {
      drawHandlerRef.current.disable();
      drawHandlerRef.current = null;
      setIsDrawing(false);
    }
  };

  const deleteLastPoint = () => {
    if (drawHandlerRef.current && drawHandlerRef.current.deleteLastVertex) {
      drawHandlerRef.current.deleteLastVertex();
    }
  };

  const finishDrawing = () => {
    if (drawHandlerRef.current && drawHandlerRef.current.completeShape) {
      drawHandlerRef.current.completeShape();
      // The CREATED event will handle setting isDrawing to false
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'absolute', top: 80, left: 12, zIndex: 1000 }}
    >
      <Zoom in={true}>
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
          {!isDrawing ? (
            <Tooltip title={t('draw_area')} arrow placement="right">
              <IconButton
                color="primary"
                onClick={startDrawing}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' },
                  borderRadius: 1,
                  width: 30,
                  height: 30,
                  p: 0.5
                }}
              >
                <PolygonIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
              <Tooltip title={t('finish')} arrow placement="right">
                <IconButton color="success" onClick={finishDrawing} sx={{ borderRadius: 1, width: 30, height: 30, p: 0.5 }}>
                  <FinishIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('delete_last_point')} arrow placement="right">
                <IconButton color="inherit" onClick={deleteLastPoint} sx={{ color: 'text.secondary', borderRadius: 1, width: 30, height: 30, p: 0.5 }}>
                  <UndoIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('cancel')} arrow placement="right">
                <IconButton color="error" onClick={cancelDrawing} sx={{ borderRadius: 1, width: 30, height: 30, p: 0.5 }}>
                  <CancelIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Paper>
      </Zoom>
    </Box >
  );
};

export default CustomDrawControl;
