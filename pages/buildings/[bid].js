import styles from "./buildings.module.scss";
import Map from "../map/map";
import { useRouter } from 'next/router'
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Building() {
  const router = useRouter()
  const { bid } = router.query
  const [buildings, setBuildings] = useState([]);
  useEffect(() => {
    if(router.isReady) {
      getBuilding();
    }
  }, [router.isReady]);

  const getBuilding = async () => {
    const buildingResult = await axios.get(
      `http://localhost:3000/api/buildings/${bid}`
    );

    setBuildings(buildingResult?.data?.data);
    console.log(buildingResult?.data?.data);
  }

  const getMaps = () => buildings.map((b, idx) => <Map key={idx} elems={[b]} />)

  return (
    <div className={styles.container}>
      {getMaps()}
    </div>
  );
}
