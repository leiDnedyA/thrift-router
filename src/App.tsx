import { useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Tooltip } from 'react-leaflet'
import { LatLngTuple } from 'leaflet';
import { calculateDistance } from './util/GeoUtils';
import './App.css'
import { ControlsUI } from './components/ControlsUI';
import { LocationContext } from './context/LocationContext';

/**
 * TODO:
 * 
 * - Figure out routing solution
 * 
 * - Add user controls for radius
 * 
 * - Either do reverse geolocation or add 
 *   optional addresses the places interface
 * 
 * - Switch to Google Places api (way better)
 * 
 */

function UserLocationTracker() {
  const locationContext = useContext(LocationContext);
  
  const {location, updateLocation} = locationContext;
  
  // const [location, setLocation] = useState<LatLngTuple>([42.3680891432082, -71.09465827268468]);

  const fetchUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: LatLngTuple = [position.coords.latitude, position.coords.longitude];
        const distance = calculateDistance(location, newLocation);
        const MIN_MOVE_DISTANCE = 50;
        console.log(distance);
        if (distance > MIN_MOVE_DISTANCE) {
          updateLocation([newLocation[0], newLocation[1]]);
          console.log(location);
          map.setView(newLocation);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const map = useMapEvents({
    'load': fetchUserLocation
  });
  useEffect(fetchUserLocation);

  return <Marker position={location}><Tooltip>You are here.</Tooltip></Marker>
}

function App() {
  const locationContext = useContext(LocationContext);

  const { location } = locationContext;

  return (
    <>
      <div className="map"><MapContainer center={location} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        <UserLocationTracker />
        <ControlsUI userPosition={[41.95036934505278, -71.37626726475337]} />
      </MapContainer></div>
    </>
  )
}

export default App
