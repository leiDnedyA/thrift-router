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
    const map = useMap();
    return <>
        <div className="ui-overlay-container">
            <button
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

                            setMarkers(newMarkers)
                        })
                }}>Plot Local Thrifts</button>
        </div>
    </>
}

export { ControlsUI }