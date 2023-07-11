import { LatLngTuple } from "leaflet";

export interface Place {
    name: string,
    position: LatLngTuple,
    address?: {
        line1: string,
        line2: string
    }
}