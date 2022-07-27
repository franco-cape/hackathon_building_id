import mapboxgl from "mapbox-gl";
import {useRef, useEffect} from "react";

const Map = ({elems, customStyle}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);


    useEffect(() => {

// -112.068247, 33.768127
        const centroid = elems.length && JSON.parse(elems[0].centroid).coordinates || [-112.068247, 33.768127]

        mapboxgl.accessToken = process.env.MAPBOX_API_KEY ?? "";
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v10",
            center: centroid, // center map on Chad
            zoom: 19,
        });
    }, [elems]);

    useEffect(() => {
        map.current.on("load", function () {
            map.current.resize();
            elems.forEach((building) => {
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
        });
    }, [elems]);

    return <div style={customStyle || MapStyles.map} ref={mapContainer}/>;
};

const MapStyles = {
    map: {
        height: "100vh",
        width: "100%",
    },
};

export default Map;
