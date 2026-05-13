/**
 * Calculates the distance between two points in kilometers using the Haversine formula
 */
export const calculateDistance = (pos1, pos2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180;
  const dLon = ((pos2.lng - pos1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1.lat * Math.PI) / 180) *
      Math.cos((pos2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculates the next position of a vehicle moving toward a target
 * @param {Object} current - { lat, lng }
 * @param {Object} target - { lat, lng }
 * @param {number} speed - speed in km/h
 * @param {number} deltaTimeInSeconds - time elapsed since last update
 */
export const calculateNextPosition = (current, target, speed, deltaTimeInSeconds) => {
  const distanceToTarget = calculateDistance(current, target);
  
  // Distance the vehicle can travel in this time tick
  const travelDistance = (speed * deltaTimeInSeconds) / 3600;

  if (travelDistance >= distanceToTarget) {
    return { ...target, arrived: true };
  }

  // Calculate the fraction of the total distance to move
  const ratio = travelDistance / distanceToTarget;

  return {
    lat: current.lat + (target.lat - current.lat) * ratio,
    lng: current.lng + (target.lng - current.lng) * ratio,
    arrived: false
  };
};
