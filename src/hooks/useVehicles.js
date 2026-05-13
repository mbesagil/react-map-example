import { useState } from 'react';

const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);

  const addVehicle = (vehicleData) => {
    const newVehicle = {
      id: Date.now(),
      status: 'idle', // Default status
      ...vehicleData,
      position: {
        lat: parseFloat(vehicleData.latitude),
        lng: parseFloat(vehicleData.longitude)
      }
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  const removeVehicle = (id) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const updateVehicle = (id, updatedData) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedData } : v))
    );
  };

  return {
    vehicles,
    addVehicle,
    removeVehicle,
    updateVehicle,
  };
};

export default useVehicles;
