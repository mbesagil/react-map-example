import * as turf from '@turf/turf';

/**
 * Checks if a point {lat, lng} is inside a GeoJSON polygon/multipolygon
 * @param {Object} point - { lat, lng }
 * @param {Object} geojson - GeoJSON object from Nominatim
 * @returns {boolean}
 */
export const isPointInPolygon = (point, geojson) => {
  if (!point || !geojson) return false;

  try {
    const turfPoint = turf.point([point.lng, point.lat]); // Turf uses [lng, lat]
    
    // Nominatim geojson can be Polygon or MultiPolygon
    if (geojson.type === 'Polygon' || geojson.type === 'MultiPolygon') {
      const turfPolygon = turf.feature(geojson);
      return turf.booleanPointInPolygon(turfPoint, turfPolygon);
    }
  } catch (error) {
    console.error('Geofencing calculation error:', error);
  }
  
  return false;
};
