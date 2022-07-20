import styles from "./buildings.module.scss";
import Map from "../../components/Map";
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

  const getMaps = () => buildings.map((b, idx) => <Map key={idx} building={b} id={b.cape_survey_id} />)

  return (
    <div className={styles.container}>
      {getMaps()}
      {/* <Map key={1} building={buildings[0]} />
      <Map key={2} building={buildings[1]} />
      <Map key={3} building={buildings[2]} />
      <Map key={4} building={buildings[3]} /> */}
    </div>
  );
}
