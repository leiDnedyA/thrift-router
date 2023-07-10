import { useContext, useEffect, useRef, useState } from 'react';
import { LatLngTuple } from 'leaflet';
import { LocationContext } from '../context/LocationContext';
import { calculateDistance } from '../util/GeoUtils';
import { Marker, Tooltip, useMap } from 'react-leaflet';
import { IoPaperPlane } from 'react-icons/io5';

import './UserLocationTracker.css'

export function UserLocationTracker() {
    const locationContext = useContext(LocationContext);
    const { location, updateLocation } = locationContext;
    const [isFollowing, setIsFollowing] = useState(true);
    const isFollowingRef = useRef<boolean>();

    isFollowingRef.current = isFollowing;

    const watchUserLocation = () => {
        console.log('new position...');
        navigator.geolocation.watchPosition(
            (position) => {
                const newLocation: LatLngTuple = [position.coords.latitude, position.coords.longitude];
                // const newLocation: LatLngTuple = [42.3680891432082, -71.09465827268468]; // Test coords (cambridge, ma)
                const distance = calculateDistance(location, newLocation);
                const MIN_MOVE_DISTANCE = 50;
                if (distance > MIN_MOVE_DISTANCE) {
                    updateLocation([newLocation[0], newLocation[1]]);
                    console.log(`mapFollowUser: ${isFollowingRef.current}`)
                    if (isFollowingRef.current) {
                        map.setView(newLocation);
                    }
                }
            },
            (error) => {
                console.error(error);
            }
        );
    };

    const map = useMap();

    useEffect(watchUserLocation, []);

    return <>
        <Marker position={location}><Tooltip>You are here.</Tooltip></Marker>
        <button id="auto-center-toggle" className={'icon-button ' + (isFollowing ? 'icon-button-active' : '')}
        onClick={()=>{setIsFollowing(!isFollowing); console.log(isFollowing)}}><IoPaperPlane/></button>
    </>
}