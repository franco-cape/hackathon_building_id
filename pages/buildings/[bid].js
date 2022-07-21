import styles from "./buildings.module.scss";
import Map from "../map/map";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Building() {
    const router = useRouter();
    const { bid } = router.query;
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const getBuilding = async () => {
        const buildingResult = await axios.get(
            `http://localhost:3000/api/buildings/${bid}`
        );
        setBuildings(buildingResult?.data?.data);
        setSelectedBuilding(buildingResult?.data?.data[0]);
    };

    useEffect(() => {
        if (router.isReady) {
            getBuilding();
        }
    }, [router.isReady]);

    const selectMap = (idx) => {
        setSelectedBuilding(buildings[idx]);
    };

    const renderSurveys = () =>
        buildings?.map((b, idx) => (
            <div
                key={idx}
                data-buildingId={b.building_id}
                className={styles.tile}
                onClick={() => selectMap(idx)}
            >
                <p>Image date: {b.sv_image_date}</p>
            </div>
        ));

    const mapStyles = {
        height: "400px",
        width: "100%",
    };

    return (
        <div className={styles.container}>
            <section className={styles.map}>
                {selectedBuilding ? (
                    <Map customStyle={mapStyles} elems={[selectedBuilding]} />
                ) : (
                    <p>loading...</p>
                )}
            </section>
            <section className={styles.history}>
                {buildings.length ? renderSurveys() : <p>Loading surveys...</p>}
            </section>
        </div>
    );
}
