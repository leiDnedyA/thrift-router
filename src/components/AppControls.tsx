import { useMap } from 'react-leaflet';
import { findStoresByRadius } from '../util/StoreLookup';
import './AppControls.css'
import { Marker } from 'leaflet';
import { useContext, useState } from 'react';
import RoutingControl from './RoutingControl';
import { Place } from '../util/Place';
import { LocationContext } from '../context/LocationContext';
import { SiGooglemaps, SiApple } from 'react-icons/si';

const openURL = (url: string): void => { window.open(url, '_blank'); }

function googleMapsURL(places: Place[]): string {
    const coordsURLFragment = places.reduce((accum, currPlace) => {
        const pos = currPlace.position;
        return accum + `/${pos[0]},${pos[1]}`;
    }, "");
    return `https://www.google.com/maps/dir//${coordsURLFragment}`;
}

function appleMapsURL(places: Place[]): string {
    const coordsURLFragment = places.reduce((accum, currPlace) => {
        const pos = currPlace.position;
        return accum + `&daddr=${pos[0]},${pos[1]}`;
    }, "");
    return `http://maps.apple.com/?saddr=Current+Location${coordsURLFragment}`;
}

function placeSearchLink(place: Place): string {
    const urlRoot = "https://www.google.com/search";
    let queryParams;
    if (place.hasOwnProperty('address')) {
        queryParams = `?q=${encodeURIComponent(`${place.address?.line1}, ${place.address?.line2}`)}`
    } else {
        queryParams = `?q=${encodeURIComponent(`${place.name} ${place.position[0]},${place.position[1]}`)}`
    }
    return urlRoot + queryParams;
}

function AppControls() {
    const locationContext = useContext(LocationContext);
    const { location } = locationContext;
    const [isLoading, setIsLoading] = useState(false);

    const [markers, setMarkers] = useState<Marker[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);

    const map = useMap();

    function generateRoute() {
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
                setMarkers(newMarkers);
            });
    }

    return <>
        <div className="ui-overlay-container">
            <h2 className='controls-header'>Thrift Router</h2>
            <button
                className='button-59'
                onClick={generateRoute}>Generate Route</button>
            <div className='thrift-list'>
                {isLoading && <p>loading...</p>}
                {places.map((place, index) => {
                    const searchLink = placeSearchLink(place);
                    return <p key={index}><a href={searchLink}>{place.name}</a></p>
                })}
            </div>

            <button className='link-button button-59'
                onClick={() => { openURL(googleMapsURL(places)); }}>
                <SiGooglemaps /> Google Maps
            </button>

            <button className='link-button button-59'
                onClick={() => { openURL(appleMapsURL(places)); }}>
                <SiApple /> Apple Maps
            </button>

            <RoutingControl map={map} places={places} />
        </div>
    </>
}

export { AppControls }