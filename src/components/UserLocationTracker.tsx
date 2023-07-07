import { useContext, useEffect } from 'react';
import { LatLngTuple } from 'leaflet';
import { LocationContext } from '../context/LocationContext';
import { calculateDistance } from '../util/GeoUtils';
import { useMapEvents, Marker, Tooltip } from 'react-leaflet';

export function UserLocationTracker() {
    const locationContext = useContext(LocationContext);

    const { location, updateLocation } = locationContext;

    const watchUserLocation = () => {
        navigator.geolocation.watchPosition(
            (position) => {
                console.log('new position...')
                const newLocation: LatLngTuple = [position.coords.latitude, position.coords.longitude];
                // const newLocation: LatLngTuple = [42.3680891432082, -71.09465827268468]; // Test coords (cambridge, ma)
                const distance = calculateDistance(location, newLocation);
                const MIN_MOVE_DISTANCE = 50;
                if (distance > MIN_MOVE_DISTANCE) {
                    updateLocation([newLocation[0], newLocation[1]]);
                    map.setView(newLocation);
                }
            },
            (error) => {
                console.error(error);
            }
        );
    };

    const map = useMapEvents({
        'load': watchUserLocation
    });
    useEffect(watchUserLocation);

    return <>
        <Marker position={location}><Tooltip>You are here.</Tooltip></Marker>
    </>
}