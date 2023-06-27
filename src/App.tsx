import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Popup, Marker, useMapEvent, useMapEvents } from 'react-leaflet'
import { LatLngExpression, LatLngTuple } from 'leaflet';
import { calculateDistance } from './util/GeoUtils';
import './App.css'

function UserLocationTracker() {
  const [location, setLocation] = useState<LatLngTuple>([42.3680891432082, -71.09465827268468]);

  const fetchUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: LatLngTuple = [position.coords.latitude, position.coords.longitude];
        const distance = calculateDistance(location, newLocation);
        const MIN_MOVE_DISTANCE = 50;
        console.log(distance);
        if (distance > MIN_MOVE_DISTANCE) {
          setLocation([newLocation[0], newLocation[1]]);
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

  return <Marker position={location}></Marker>
}

function App() {
  return (
    <>
      <div className="map"><MapContainer center={[42.35402759367939, -71.06663642564683]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UserLocationTracker />
      </MapContainer></div>
    </>
  )
}

export default App
