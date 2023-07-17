import { useContext } from 'react';
import { MapContainer, TileLayer} from 'react-leaflet'
import './App.css'
import { AppControls } from './components/AppControls';
import { LocationContext } from './context/LocationContext';
import { UserLocationTracker } from './components/UserLocationTracker';

/**
 * TODO:
 * 
 * - Figure out why location is blocked by default in some browsers
 *   https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API/Using_the_Permissions_API
 * 
 * - Add link to my website and github at the bottom
 * 
 * - Improve the design
 *   - Find some dark mode map tiles
 *   - Fix ugly button spacing
 * 
 * - Figure out what the LRM demo server warning is about and fix it
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
        <AppControls />
      </MapContainer></div>
    </>
  )
}

export default App
