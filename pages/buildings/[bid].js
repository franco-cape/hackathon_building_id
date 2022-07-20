import styles from "../../styles/Home.module.css";
import Map from "../map/map";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/buildings?buildingId=6")
      .then((res) => res.json())
      .then((data) => {
        setBuildings(data);
        console.log(data);
      });
  }, []);

  return (
    <div className={styles.container}>
      <Map />
    </div>
  );
}
