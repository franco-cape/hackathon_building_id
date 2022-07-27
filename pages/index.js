import { useEffect, useState } from "react";
import DefaultTemplate from "../components/Template";
import Sidebar from "../components/sidebar";
import styles from "../styles/Home.module.css";
import Map from "./map/map";
import axios from "axios";

function Home() {
    const [buildings, setBuildings] = useState([]);
    const onClickItem = (x) => {
        console.log(x);
        // link to separate page or open a modal
    };
    useEffect(() => {
        const fetchBuildings = async () => {

            // 33.768127, -112.068247
            const buildings_ = await axios.get(
                "http://localhost:3000/api/buildings?lng=-112.068247&lat=33.768127"
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
