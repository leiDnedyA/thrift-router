import { useContext, useEffect, useRef, useState } from 'react';
import { LatLngTuple, LeafletKeyboardEvent, LeafletMouseEvent } from 'leaflet';
import { LocationContext } from '../context/LocationContext';
import { calculateDistance } from '../util/GeoUtils';
import { Marker, Tooltip, useMapEvents } from 'react-leaflet';
import { IoPaperPlane } from 'react-icons/io5';

import './UserLocationTracker.css'

export function UserLocationTracker() {
    const locationContext = useContext(LocationContext);
    const { location, updateLocation } = locationContext;
    const [isFollowing, setIsFollowing] = useState(true);
    const isFollowingRef = useRef<boolean>();

    isFollowingRef.current = isFollowing;

    const watchUserLocation = () => {
        navigator.geolocation.watchPosition(
            (position) => {
                const newLocation: LatLngTuple = [position.coords.latitude, position.coords.longitude];
                // const newLocation: LatLngTuple = [42.3680891432082, -71.09465827268468]; // Test coords (cambridge, ma)
                const distance = calculateDistance(location, newLocation);
                const MIN_MOVE_DISTANCE = 50;
                if (distance > MIN_MOVE_DISTANCE) {
                    updateLocation([newLocation[0], newLocation[1]]);
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


    const stopFollowingUser = (e: LeafletMouseEvent | LeafletKeyboardEvent | undefined) => {
        if (e) { // Return if target is not the leaflet container
            const target = e.originalEvent.target;
            if (target instanceof Element) {
                if (!target.classList.contains("leaflet-container")) {
                    return;
                }
            }
        }
        if (isFollowingRef.current) {
            setIsFollowing(false);
        }
    }

    const fixZoomCenter = () => {
        if (isFollowingRef.current) {
            startFollowingUser();
        }
    }
    
    const startFollowingUser = () => {
        map.setView(location);
    }

    const map = useMapEvents({
        mousedown: stopFollowingUser,
        keydown: stopFollowingUser,
        zoomend: fixZoomCenter
    });


    useEffect(watchUserLocation, []);

    return <>
        <Marker position={location}><Tooltip>You are here.</Tooltip></Marker>
        <button id="auto-center-toggle" className={'icon-button ' + (isFollowing ? 'icon-button-active' : '')}
            onClick={() => {
                if (!isFollowing) {
                    startFollowingUser();
                }
                setIsFollowing(!isFollowing);
            }}><IoPaperPlane /></button>
    </>
}