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

    function watchUserLocation() {
        navigator.geolocation.watchPosition(
            (position) => {
                const newLocation: LatLngTuple = [position.coords.latitude, position.coords.longitude];
                const distance = calculateDistance(location, newLocation);
                const MIN_MOVE_DISTANCE = 10;
                if (distance > MIN_MOVE_DISTANCE) {
                    updateLocation([newLocation[0], newLocation[1]]);
                    if (isFollowingRef.current) {
                        map.setView(newLocation);
                    }
                }
            },
            (error) => { console.error(error); }
        );
    }

    type InitInteractionEvent = LeafletMouseEvent | LeafletKeyboardEvent | TouchEvent | undefined;

    const stopFollowingUser = (e: InitInteractionEvent) => {
        if (e) { // Return if target is not the leaflet container
            let target;

            if (e instanceof TouchEvent) {
                target = e.target;
            } else { // Assuming e is either LeafletMousEvent or LeafletKeyboardEvent
                target = e.originalEvent.target;
            }

            if (target instanceof Element) {
                const isMapContainer = target.classList.contains("leaflet-container");
                const isMarkerIcon = target.classList.contains("leaflet-marker-icon")
                if (!(isMapContainer || isMarkerIcon)) {
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

    document.addEventListener('touchstart', stopFollowingUser);

    useEffect(watchUserLocation, []);

    return <>
        <Marker position={location}><Tooltip>You are here.</Tooltip></Marker>
        <button
            id="auto-center-toggle"
            className={'icon-button ' + (isFollowing ? 'icon-button-active' : '')}
            onClick={() => {
                if (!isFollowing) { startFollowingUser(); }
                setIsFollowing(!isFollowing);
            }}
        >
            <IoPaperPlane />
        </button>
    </>
}