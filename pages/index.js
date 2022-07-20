import styles from "../styles/Home.module.css";
import Map from "./map/map";

export default function Home() {
  return (
    <div className={styles.container}>
      <Map />
    </div>
  );
}
