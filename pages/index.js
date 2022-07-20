import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/sidebar';
import styles from '../styles/Home.module.css'
import Map from './map/map';

export default function Home() {
  const items = ["2780 Glorietta Cir"];
  const onClickItem = (x) => {

  }
  return (
    <div className={styles.container}>
      <Sidebar elems={items} onClickItem={onClickItem} />
      <Map />
    </div>
  )
}
