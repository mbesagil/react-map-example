import { useMemo } from 'react';
import { isPointInPolygon } from '../utils/geo';

const useGeoFencing = (vehicles, selectedRegion) => {
  const analysis = useMemo(() => {
    if (!selectedRegion || !selectedRegion.geojson) {
      return {
        inside: [],
        outside: vehicles,
        stats: {
          total: vehicles.length,
          insideCount: 0,
          outsideCount: vehicles.length,
          movingInside: 0,
          idleInside: 0
        }
      };
    }

    const inside = [];
    const outside = [];
    let movingInside = 0;
    let idleInside = 0;

    vehicles.forEach((vehicle) => {
      const isInside = isPointInPolygon(vehicle.position, selectedRegion.geojson);
      
      if (isInside) {
        inside.push(vehicle.id);
        if (vehicle.status === 'moving') movingInside++;
        else idleInside++;
      } else {
        outside.push(vehicle.id);
      }
    });

    return {
      inside, // Array of IDs
      outside, // Array of IDs
      stats: {
        total: vehicles.length,
        insideCount: inside.length,
        outsideCount: outside.length,
        movingInside,
        idleInside
      }
    };
  }, [vehicles, selectedRegion]);

  return analysis;
};

export default useGeoFencing;
