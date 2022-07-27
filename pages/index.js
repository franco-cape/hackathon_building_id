import { useEffect, useState } from "react";
import DefaultTemplate from "../components/Template";
import Sidebar from "../components/sidebar";
import styles from "../styles/Home.module.css";
import Map from "./map/map";
import axios from "axios";
import { coordinates } from "../utils/contants";

function Home() {
    const [buildings, setBuildings] = useState([]);
    const onClickItem = (x) => {
        console.log(x);
        // link to separate page or open a modal
    };
    useEffect(() => {
        const fetchBuildings = async () => {
            const buildings_ = await axios.get(
                `http://localhost:3000/api/buildings?lng=${coordinates.lng}&lat=${coordinates.lat}`
            );
            setBuildings(buildings_?.data?.data);
        };
        fetchBuildings();
    }, []);
    return (
        <div className={styles.container}>
            <Sidebar elems={buildings} onClickItem={onClickItem} />
            <Map elems={buildings} />
        </div>
    );
}

Home = DefaultTemplate(Home);

export default Home;
