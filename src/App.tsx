import { useContext } from 'react';
import { MapContainer, TileLayer} from 'react-leaflet'
import './App.css'
import { ControlsUI } from './components/ControlsUI';
import { LocationContext } from './context/LocationContext';
import { UserLocationTracker } from './components/UserLocationTracker';

/**
 * TODO:
 * 
 * - fix and test toggle button (is it caused by Leaflet Routing Machine?)
 * 
 * - Either do reverse geolocation or add 
 *   optional addresses the places interface and REST api
 * 
 * - Fix janky map controls (implement it correctly with react leaflet)
 * 
 * - Add checkboxes for user to include/exclude places
 * 
 * - Add user controls for radius
 * 
 * - Make it so that if the radius is big enough mutiple points are
 *   queried together to make a big list
 * 
 * - switch place links to website if available 
 * 
 * - Switch to Google Places api (way better)
 * 
 * - Pimp out the readme for the repo
 * 
 * - Get project hosted
 * 
 */


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
