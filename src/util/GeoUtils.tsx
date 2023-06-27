import { LatLngTuple } from "leaflet";

/**
 * Distance between a set of coords in meters
 * 
 * @param coord1 
 * @param coord2 
 * @returns {number} distance [meters]
 */
function calculateDistance(coord1: LatLngTuple, coord2: LatLngTuple): number {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;

    const earthRadius = 6371; // Radius of the Earth in kilometers
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const latDiffRad = toRadians(lat2 - lat1);
    const lonDiffRad = toRadians(lon2 - lon1);

    const a =
        Math.sin(latDiffRad / 2) * Math.sin(latDiffRad / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiffRad / 2) * Math.sin(lonDiffRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c * 1000; // Convert to meters

    return distance;
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export { calculateDistance }