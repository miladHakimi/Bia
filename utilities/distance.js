import { getDistance, getPreciseDistance } from 'geolib';

export function isInside(currentLocation, destination, radious=300){
    return getDistance(currentLocation, destination) < radious;
}