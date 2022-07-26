import mapboxgl from "mapbox-gl";
import {useRef, useEffect} from "react";

const Map = ({elems, customStyle}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const centroid = useRef(null);

    const addGeometries = (geoms) => {
        geoms.forEach((building) => {
            if (
                map.current && 
                !map.current.getLayer(building.building_id)
            ) {
                map.current.addSource(building.building_id, {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        geometry: JSON.parse(building.st_asgeojson),
                    },
                });
                map.current.addLayer({
                    id: building.building_id,
                    type: "fill",
                    source: building.building_id, // reference the data source
                    layout: {},
                    paint: {
                        "fill-color": "#0080ff", // blue color fill
                        "fill-opacity": 0.5,
                    },
                });
                map.current.addLayer({
                    id: `${building.building_id}-label`,
                    source: building.building_id, // reference the data source
                    type: "symbol",
                    layout: {
                        'text-field': building.building_id,
                        'text-size': 12
                    }
                })
            }
        });
    }

    useEffect(() => {
        const loadFn = function () {
            if(!centroid.current) return;

            map.current.flyTo({center: centroid.current});
            map.current.resize();
            if(elems?.length > 0){
                addGeometries(elems);
            }
        }

        mapboxgl.accessToken = process.env.MAPBOX_API_KEY ?? "";
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v10",
            zoom: 19,
        });

        map.current.on("style.load", loadFn);
        return () => {
            map.current.off("style.load", loadFn);
        }
    }, []);
    
    useEffect(() => {
        if(elems?.length > 0 && elems[0]) {
            let center = elems.length > 0 && JSON.parse(elems[0]?.centroid)?.coordinates || [-96.69771726896862, 32.91303284263627]
            centroid.current = center;
            map.current.flyTo({center: center, zoom: 18});
            addGeometries(elems);
        }
    }, [elems])

    return <div style={customStyle || MapStyles.map} ref={mapContainer}/>;
};

const MapStyles = {
    map: {
        height: "100vh",
        width: "100%",
    },
};

export default Map;
