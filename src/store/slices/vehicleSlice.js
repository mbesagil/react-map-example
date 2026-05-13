import { calculateNextPosition } from '../../utils/movement';

export const createVehicleSlice = (set, get) => ({
  vehicles: [],
  vehiclesLoading: true,
  selectedVehicleId: null,
  setVehiclesLoading: (loading) => set({ vehiclesLoading: loading }),
  setVehicles: (vehicles) => set({ vehicles, vehiclesLoading: false }),
  selectVehicle: (id) => set((state) => ({ selectedVehicleId: state.selectedVehicleId === id ? null : id })),
  addVehicle: (vehicleData) => set((state) => ({
    vehicles: [...state.vehicles, {
      id: Date.now(),
      status: 'idle',
      ...vehicleData,
      position: { lat: parseFloat(vehicleData.latitude), lng: parseFloat(vehicleData.longitude) },
      target: null
    }]
  })),
  setVehicleTarget: (id, lat, lng) => set((state) => ({
    vehicles: state.vehicles.map((v) => v.id === id ? { ...v, target: { lat, lng }, status: 'moving' } : v)
  })),
  tick: () => {
    const { vehicles, vehiclesLoading } = get();
    if (vehiclesLoading || !vehicles.some(v => v.status === 'moving')) return;
    set((state) => ({
      vehicles: state.vehicles.map((v) => {
        if (v.status !== 'moving' || !v.target) return v;
        const next = calculateNextPosition(v.position, v.target, parseFloat(v.speed), 1);
        return { ...v, position: { lat: next.lat, lng: next.lng }, status: next.arrived ? 'arrived' : 'moving' };
      })
    }));
  },
});
