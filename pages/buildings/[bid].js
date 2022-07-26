import styles from "./buildings.module.scss";
import Map from "../map/map";
import { useRouter } from "next/router";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DefaultTemplate from "../../components/Template";

function Building() {
    const router = useRouter();
    const { bid } = router.query;
    const [buildings, setBuildings] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const getGeochip = async (building) => {
        const geo = JSON.parse(building.st_asgeojson);
        const params = {
            zoom: 21,
            pad: 21,
            algorithm: "geo_chipper",
            survey: building.cape_survey_id,
            geometry: {
                type: geo.type,
                coordinates: geo.coordinates,
            },
        };

        const response = await axios.get(`http://localhost:3000/api/geochip`, {
            params: params,
        });

        return { ...building, image: response.data.image };
    };

    const getBuilding = async () => {
        const buildingResult = await axios.get(
            `http://localhost:3000/api/buildings/${bid}`
        );
        const buildingsArray = buildingResult?.data?.data;
        setBuildings(buildingsArray);
        setSelectedBuilding(buildingsArray[0]);

        // geochip for all surveys
        const images = buildingsArray.map(async (b) => {
            const image = await getGeochip(b);

            return image;
        });

        const buildingsWithImages = await Promise.all(images);

        setBuildings(buildingsWithImages);
        setImagesLoaded(true);
    };

    useEffect(() => {
        if (router.isReady) {
            getBuilding();
        }
    }, [router.isReady]);

    const selectMap = (idx) => {
        console.log("yee");

        setSelectedBuilding(buildings[idx]);
    };

    const formatDate = (customDate) => {
        let options = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        const d = new Date(customDate);
        return `${d.toLocaleString("en-US", options)}`;
    };

    const renderSurveys = () =>
        buildings?.map((b, idx) => {
            return (
                <div
                    key={idx}
                    data-buildingId={b.building_id}
                    className={`${styles.tile} ${
                        b.cape_survey_id === selectedBuilding.cape_survey_id
                            ? styles.active
                            : ""
                    }`}
                    onClick={() => selectMap(idx)}
                >
                    <div className={styles.subtitle}>
                        <span>Survey date:</span>
                        <span>{formatDate(b.sv_image_date)}</span>
                    </div>
                    <Image
                        src={`data:image/png;base64,${b.image}`}
                        alt={b.sv_image_date}
                        width="160"
                        height="160"
                    />
                </div>
            );
        });

    const mapStyles = {
        height: "400px",
        width: "100%",
    };

    return (
        <div className={styles.container}>
            <section className={styles.map}>
                <Map customStyle={mapStyles} elems={[selectedBuilding]} />
            </section>
            <section className={styles.history}>
                {selectedBuilding && (
                    <div>
                        <h4>Building ID: {selectedBuilding.building_id}</h4>
                    </div>
                )}
                <div className={styles.tileWrapper}>
                    {buildings.length && imagesLoaded ? (
                        renderSurveys()
                    ) : (
                        <p>Loading surveys...</p>
                    )}
                </div>
            </section>
        </div>
    );
}

Building = DefaultTemplate(Building);

export default Building;
