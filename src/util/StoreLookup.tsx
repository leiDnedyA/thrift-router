// Get a list of thrift stores based on location (coords or address)

import { LatLngTuple } from "leaflet";
import { Place } from "./Place";

/**
 * Returns a list of thrift stores within a certain radius (in meters) surroinding
 * a set of coordinates.
 * 
 * @async
 * @param {[latitude: number, longitude: number]} latLng center of search circle 
 * @param {number} radius radius of search in METERS
 * @returns {Promise<Place[]>}
 */
async function findStoresByRadius(latLng: LatLngTuple, radius: number) : Promise<Place[]>{
    return fetch(`/api/searchCircle/pos/${latLng[0]},${latLng[1]}/rad/${radius}`)
        .then((res) => res.json());
}

export { findStoresByRadius }