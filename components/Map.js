import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.module.scss";

mapboxgl.accessToken = process.env.MAPBOX_API_KEY ?? "";

const Map = ({ building, id }) => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-96.69771726896862, 32.91303284263627],
      zoom: 9,
    });

    // Clean up on unmount
    // return () => map.remove();
  }, []);

  useEffect(() => {
    if (building) {
        map.current.on('load', function () {
            map.current.addSource(id, {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: JSON.parse(building.st_asgeojson),
              },
            });
            map.current.addLayer({
              id: id,
              type: "fill",
              source: id, // reference the data source
              layout: {},
              paint: {
                "fill-color": "#0080ff", // blue color fill
                "fill-opacity": 0.5,
              },
            });
            
        });
    }
  }, [building]);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;
