import { LatLngTuple } from "leaflet"
import { createContext, useState } from "react";


const defaultLocation: LatLngTuple = [42.35402759367939, -71.06663642564683];


interface LocationContextProps {
    location: LatLngTuple,
    updateLocation: (newLocation: LatLngTuple) => void;
}

export const LocationContext = createContext<LocationContextProps>({ location: defaultLocation, updateLocation: (location: LatLngTuple) => {} });

interface ProviderProps {
    children: React.ReactNode
}

export const LocationProvider: React.FunctionComponent<ProviderProps> = ({ children }) => {
    const [location, setLocation] = useState<LatLngTuple>(defaultLocation);

    const updateLocation = (newLocation: LatLngTuple) => {
        setLocation(newLocation);
    };

    return (
        <LocationContext.Provider value={{location, updateLocation}}>
            {children}
        </LocationContext.Provider>
    )
}