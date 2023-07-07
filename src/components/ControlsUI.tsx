import { useMap } from 'react-leaflet';
import { findStoresByRadius } from '../util/StoreLookup';
import './ControlsUI.css'
import { Marker } from 'leaflet';
import { useContext, useState } from 'react';
import RoutingControl from './RoutingControl';
import { Place } from './Place';
import { LocationContext } from '../context/LocationContext';
import { SiGooglemaps, SiApple } from 'react-icons/si';

function ControlsUI() {
    const locationContext = useContext(LocationContext);
    const { location } = locationContext;
    const [isLoading, setIsLoading] = useState(false);

    const [markers, setMarkers] = useState<Marker[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const map = useMap();
    return <>
        <div className="ui-overlay-container">
            <h2 className='controls-header'>Thrift Router</h2>
            <button
                className='button-59'
                onClick={() => {
                    setIsLoading(true);
                    findStoresByRadius(location, 10000)
                        .then(foundStores => {
                            setIsLoading(false);
                            console.log(foundStores)

                            const newMarkers: Marker[] = [];

                            markers.forEach((m) => {
                                m.removeFrom(map);
                            })

                            foundStores.forEach((store: Place) => {
                                const marker = new Marker(store.position);
                                marker.bindTooltip(store.name).openTooltip();

                                marker.addTo(map);
                                newMarkers.push(marker);
                            })

                            setPlaces(foundStores);
                            setMarkers(newMarkers)
                        })
                }}>Generate Route</button>
            <div className='thrift-list'>
                {isLoading && <p>loading...</p>}
                {places.map((place, index) => {
                    /**
                     * TODO: - make it so that the respective marker gets highlighted
                     *         in some way when user hovers over place text, and vice
                     *         versa
                     *       - come up with better style for places list
                     */
                    const searchLink = `https://www.google.com/search?q=${encodeURIComponent(`${place.name} ${place.position[0]},${place.position[1]}`)}`;
                    return <p key={index}><a href={searchLink}>{place.name}</a></p>
                })}</div>
            <button className='google-maps-button button-50'
                onClick={() => {
                    const coordsURLFragment = places.reduce((accum, currPlace) => {
                        const pos = currPlace.position;
                        return accum + `/${pos[0]},${pos[1]}`;
                    }, "");
                    const googleMapsLink = `https://www.google.com/maps/dir//${coordsURLFragment}`;
                    window.open(googleMapsLink, '_blank');
                }}><SiGooglemaps/> Google Maps</button>
            <button className='apple-maps-button button-50'
                onClick={() => {
                    const coordsURLFragment = places.reduce((accum, currPlace) => {
                        const pos = currPlace.position;
                        return accum + `&daddr=${pos[0]},${pos[1]}`;
                    }, "");
                    const appleMapsLink = `http://maps.apple.com/?saddr=Current+Location${coordsURLFragment}`;
                    window.open(appleMapsLink, '_blank');
                }}><SiApple/> Apple Maps</button>
            <RoutingControl map={map} places={places} />
        </div>
    </>
}

export { ControlsUI }