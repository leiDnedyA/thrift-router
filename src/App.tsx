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
 * - Add link to google maps / apple maps IMPORTANT!
 * 
 * - Add loading text after button clicked
 * 
 * - Fix janky map controls (implement it correctly with react leaflet)
 * 
 * - Add user controls for radius
 * 
 * - Make it so that if the radius is big enough mutiple points are
 *   queried together to make a big list
 * 
 * - Either do reverse geolocation or add 
 *   optional addresses the places interface
 * 
 * 
 * - Switch to Google Places api (way better)
 * 
 */

function UserLocationTracker() {
  const locationContext = useContext(LocationContext);
  
  const {location, updateLocation} = locationContext;

  const watchUserLocation = () => {
    navigator.geolocation.watchPosition(
      (position) => {
        console.log('new position...')
        const newLocation: LatLngTuple = [position.coords.latitude, position.coords.longitude];
        // const newLocation: LatLngTuple = [42.3680891432082, -71.09465827268468]; // Test coords (cambridge, ma)
        const distance = calculateDistance(location, newLocation);
        const MIN_MOVE_DISTANCE = 50;
        if (distance > MIN_MOVE_DISTANCE) {
          updateLocation([newLocation[0], newLocation[1]]);
          map.setView(newLocation);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const map = useMapEvents({
    'load': watchUserLocation
  });
  useEffect(watchUserLocation);

  return <Marker position={location}><Tooltip>You are here.</Tooltip></Marker>
}

function App() {
  const locationContext = useContext(LocationContext);

  const { location } = locationContext;

  return (
    <>
      <div className="map"><MapContainer center={location} zoom={13} maxZoom={18} minZoom={5}>
        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* ^ Stable but ugly */}
        {/* v Unstable but pretty (dark mode) */}
        {/* <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        /> */}
        <UserLocationTracker />
        <ControlsUI />
      </MapContainer></div>
    </>
  )
}

export default App
