import { useState, useEffect, useCallback } from 'react';
import { calculateNextPosition } from '../utils/movement';

const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const addVehicle = (vehicleData) => {
    const newVehicle = {
      id: Date.now(),
      status: 'idle',
      ...vehicleData,
      position: {
        lat: parseFloat(vehicleData.latitude),
        lng: parseFloat(vehicleData.longitude)
      },
      target: null
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  const removeVehicle = (id) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    if (selectedVehicleId === id) setSelectedVehicleId(null);
  };

  const selectVehicle = (id) => {
    setSelectedVehicleId(id);
  };

  const setVehicleTarget = useCallback((id, lat, lng) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, target: { lat, lng }, status: 'moving' }
          : v
      )
    );
  }, []);

  // Simulation Loop
  useEffect(() => {
    const movingVehicles = vehicles.filter(v => v.status === 'moving');
    
    if (movingVehicles.length === 0) return;

    const tickDuration = 1; // 1 second
    const interval = setInterval(() => {
      setVehicles((prevVehicles) => {
        let hasChanges = false;
        const newVehicles = prevVehicles.map((v) => {
          if (v.status !== 'moving' || !v.target) return v;

          const next = calculateNextPosition(v.position, v.target, parseFloat(v.speed), tickDuration);
          
          hasChanges = true;
          return {
            ...v,
            position: { lat: next.lat, lng: next.lng },
            status: next.arrived ? 'arrived' : 'moving'
          };
        });
        
        return hasChanges ? newVehicles : prevVehicles;
      });
    }, tickDuration * 1000);

    return () => clearInterval(interval);
  }, [vehicles.length, vehicles.some(v => v.status === 'moving')]);

  return {
    vehicles,
    selectedVehicleId,
    addVehicle,
    removeVehicle,
    selectVehicle,
    setVehicleTarget,
  };
};

export default useVehicles;
