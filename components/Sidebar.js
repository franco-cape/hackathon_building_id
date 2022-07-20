import React from "react";
import Link from 'next/link'
import {
  Col,
  Spacer,
  Text,
} from "@nextui-org/react";
import styles from './Sidebar.module.scss'

function Sidebar({elems = [], onClickItem}) {
    const getItems = () => {
        return elems.map((x, idx) => {
            return  ( 
                <Link key={idx} size={20} href={`/buildings/${x.building_id}`}>
                    <a>{x.building_id}</a>
                </Link>
            )
        });
    }
    return (
        <div className={styles.sideBar} >
            <Spacer y={1} />
            <Text size={20} weight={'bold'}>Cape Building ID Demo</Text>
            <Spacer y={1} />
            <div className={styles.navLinks}>
                {getItems()}
            </div>
        </div> 
    );
}

export default Sidebar;
