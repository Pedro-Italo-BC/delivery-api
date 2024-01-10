interface Coordinates {
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS = 6371000; // Earth radius in meters

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function getAddressDistance(
  coord1: Coordinates,
  coord2: Coordinates,
): number {
  const { latitude: lat1, longitude: lon1 } = coord1;
  const { latitude: lat2, longitude: lon2 } = coord2;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS * c;

  return distance;
}
