
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useEffect } from 'react';

const Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken = process.env.MAPBOX_API_KEY ?? '';
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v10',
          center: [15.4542, 18.7322], // center map on Chad
          zoom: 1.8
        });
        map.current.on('load', function () {
            map.current.resize();
        });
    }, []);      

    return (
        <div className="map-container" style={MapStyles.map} ref={mapContainer} />
    );
};

const MapStyles = {
    map: {
        height: '100vh',
        width: '100%'
    }
}

export default Map;
