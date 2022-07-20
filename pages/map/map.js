
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useEffect } from 'react';

const Map = ({elems}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken = process.env.MAPBOX_API_KEY ?? '';
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v10',
          center: [-96.69771726896862, 32.91303284263627], // center map on Chad
          zoom: 18
        });
        map.current.on('load', function () {
            map.current.resize();
        });
    }, []);      
    useEffect(() => {
        elems.forEach(building => {
            if(map.current && !map.current.getLayer(building.building_id)){
                map.current.addSource(building.building_id, {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: JSON.parse(building.st_asgeojson)
                    }
                })
                map.current.addLayer({
                    'id': building.building_id,
                    'type': 'fill',
                    'source': building.building_id, // reference the data source
                    'layout': {},
                    'paint': {
                    'fill-color': '#0080ff', // blue color fill
                    'fill-opacity': 0.5
                    }
                });
            }
        })
    }, [elems])
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
