import { useEffect, useState } from 'react';
import { Modal, Button, Text } from "@nextui-org/react";
import Sidebar from '../components/sidebar';
import styles from '../styles/Home.module.css'
import Map from './map/map';
import axios from 'axios';

export default function Home() {
  const [buildings, setBuildings] = useState([]);
  const [clickedBuilding, setClickedBuilding] = useState();
  const onClickItem = (x) => {
    setClickedBuilding(x);
    setVisible(true);
    // link to separate page or open a modal
  }
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
  };

  useEffect(() => {
    const fetchBuildings = async () => {
      const buildings_ = await axios.get("http://localhost:3000/api/buildings?lng=-96.69771726896862&lat=32.91303284263627");
      setBuildings(buildings_?.data?.data);
    }
    fetchBuildings();
  }, [])
  return (
    <div className={styles.container}>
      <Sidebar elems={buildings} onClickItem={onClickItem} />
      <Map elems={buildings} onClickItem={onClickItem} />

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" weight={"bold"} size={18}>
            Building ID {clickedBuilding?.building_id} History
          </Text>
        </Modal.Header>

        <Modal.Body>
          <Text>RCR History:</Text>
        </Modal.Body>

        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
