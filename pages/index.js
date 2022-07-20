import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Sidebar from "../components/sidebar";
import styles from "../styles/Home.module.css";
import Map from "./map/map";
import axios from "axios";

export default function Home() {
  const [buildings, setBuildings] = useState([]);
  const onClickItem = (x) => {
    console.log(x);
    // link to separate page or open a modal
  };
  useEffect(() => {
    const fetchBuildings = async () => {
      const buildings_ = await axios.get(
        "http://localhost:3000/api/buildings?lng=-96.69771726896862&lat=32.91303284263627"
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
