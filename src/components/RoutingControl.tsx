import React, { useContext, useEffect, useRef } from 'react';
import L, { Map } from 'leaflet';
import 'leaflet-routing-machine';
import './RoutingControls.css';
import { Place } from '../util/Place';
import { LocationContext } from '../context/LocationContext';

interface RoutingControlProps {
    map: Map | null;
    places: Place[],
    location?: Place
}

const placesToWaypoints = (ps: Place[]): L.LatLng[] => ps.map(p => new L.LatLng(...p.position));

const RoutingControl: React.FC<RoutingControlProps> = ({ map, places }) => {
    const locationContext = useContext(LocationContext);
    const { location } = locationContext;

    const controlRef = useRef<L.Routing.Control | null>(null);

    useEffect(() => {
        if (map) {
            const waypoints = placesToWaypoints(places);

            const control = L.Routing.control({
                waypoints: waypoints,
                routeWhileDragging: false,
                addWaypoints: false,
                plan: new L.Routing.Plan(waypoints, { createMarker: () => false })
            }).addTo(map);

            controlRef.current = control;
            control.hide();

            return () => {
                // Clean up the control when the component is unmounted
                if (controlRef.current) {
                    map.removeControl(controlRef.current);
                    controlRef.current = null;
                }
            };
        }
    }, [map]);

    useEffect(() => {
        if (map && places && controlRef.current) {
            var waypoints = placesToWaypoints(places);
            if (location) {
                waypoints.unshift(new L.LatLng(location[0], location[1]));
            }
            controlRef.current.setWaypoints(waypoints);
            controlRef.current.route();
        }
    }, [places, location]);

    return null;
};

export default RoutingControl;