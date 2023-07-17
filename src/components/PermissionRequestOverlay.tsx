import { useMap } from 'react-leaflet';
import './PermissionRequestOverlay.css';
import { useEffect } from 'react';

export function PermissionRequestOverlay() {
    const map = useMap();

    useEffect(()=>{
        map.scrollWheelZoom.disable();
        map.dragging.disable();
        map.touchZoom.disable();
    }, [])

    return <div id="permission-request-overlay">
        <div className="content">
            <h2>Location Access Denied</h2>
            <p>In order to use Thrift Router, you must grant this site access to your geolocation. Once permission has been granted, this popup should go away. If it doesn't go away, try <a href="#" onClick={() => { location.reload() }}>refreshing the page.</a></p>
        </div>
    </div>
}