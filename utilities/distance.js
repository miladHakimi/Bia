import { getDistance } from 'geolib';

export function isInside(currentLocation, destination, radious){
    const defaultDistance = 300;
    const distance = radious? parseInt(radious, 10): defaultDistance;
    if (currentLocation && destination && currentLocation != {} && destination != {})
        return getDistance(currentLocation, destination) < distance;
    return false
}

export function getElapsedTime(currentLocation, destination, fetch_time, portion=0.33, speed=10){
    const randInt = Math.round(Math.random() * 1000);
    if (currentLocation && destination && currentLocation != {} && destination != {}){
        return Math.round(Math.max(fetch_time, getDistance(currentLocation, destination) * portion / speed * 1000)) + randInt;

    }
    return fetch_time
}