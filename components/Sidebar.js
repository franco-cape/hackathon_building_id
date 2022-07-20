import React from "react";
import {
  Col,
  Spacer,
  Text,
} from "@nextui-org/react";

function Sidebar({elems, onClickItem}) {
    const getItems = () => {
        return elems.map((x) => {
            return  ( 
                <Text style={{cursor:'pointer'}} onClick={() => onClickItem(x)} size={20}>
                    {x.building_id}
                </Text>
            )
        });
    }
    return (
        <Col css={{ w: '400px', h: '100vh' }}>
            <Spacer y={1} />
            <Text size={20} weight={'bold'}>Cape Building ID Demo</Text>
            <Spacer y={1} />
            {getItems()}
        </Col> 
    );
}

export default Sidebar;
