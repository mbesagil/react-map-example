import { useStore } from '../store/useStore';

/**
 * useVehicles Hook
 * Wraps the Zustand store to provide a clean interface for vehicle management.
 */
const useVehicles = () => {
  const vehicles = useStore(state => state.vehicles);
  const vehiclesLoading = useStore(state => state.vehiclesLoading);
  const selectedVehicleId = useStore(state => state.selectedVehicleId);
  
  // Single Actions
  const addVehicle = useStore(state => state.addVehicle);
  const deleteVehicle = useStore(state => state.deleteVehicle);
  const selectVehicle = useStore(state => state.selectVehicle);
  const startVehicle = useStore(state => state.startVehicle);
  const stopVehicle = useStore(state => state.stopVehicle);
  const updateVehicleSpeed = useStore(state => state.updateVehicleSpeed);
  const setVehicleTarget = useStore(state => state.setVehicleTarget);
  
  // Bulk Actions
  const startAllVehicles = useStore(state => state.startAllVehicles);
  const stopAllVehicles = useStore(state => state.stopAllVehicles);
  const deleteAllVehicles = useStore(state => state.deleteAllVehicles);
  const updateAllSpeeds = useStore(state => state.updateAllSpeeds);

  return {
    // State
    vehicles,
    vehiclesLoading,
    selectedVehicleId,
    
    // Single Actions
    addVehicle,
    deleteVehicle,
    selectVehicle,
    startVehicle,
    stopVehicle,
    updateVehicleSpeed,
    setVehicleTarget,
    
    // Bulk Actions
    startAllVehicles,
    stopAllVehicles,
    deleteAllVehicles,
    updateAllSpeeds,
  };
};

export default useVehicles;
