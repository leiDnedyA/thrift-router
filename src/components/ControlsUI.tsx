import { useMap } from 'react-leaflet';
import { findStoresByRadius } from '../util/StoreLookup';
import './ControlsUI.css'
import { LatLngTuple, Marker } from 'leaflet';
import { useState } from 'react';

interface Place {
    name: string,
    position: LatLngTuple
}

function ControlsUI(props: { userPosition: LatLngTuple }) {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const map = useMap();
    return <>
        <div className="ui-overlay-container">
            <h2 className='controls-header'>Thrift Router</h2>
            <button
                className='button-50'
                onClick={() => {
                    findStoresByRadius(props.userPosition, 10000)
                        .then(foundStores => {

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
                }}>Plot Local Thrifts</button>
                {places.map((place, index)=>{
                    /**
                     * TODO: - make it so that the respective marker gets highlighted
                     *         in some way when user hovers over place text, and vice
                     *         versa
                     *       - come up with better style for places list
                     */
                    const searchLink = `https://www.google.com/search?q=${encodeURIComponent(`${place.name} ${place.position[0]},${place.position[1]}`)}`;
                    return <p key={index}><a href={searchLink}>{place.name}</a></p>
                })}
        </div>
    </>
}

export { ControlsUI }