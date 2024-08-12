import "./WorkshopCardSlider.css";
import React from "react";
import OpenClassCard from "./OpenClassCard";

const CardSlider = ({ dataList, deleteOpenClass }) => {
  return (
    <div className={"horizontal-scroll-wrapper"}>
      {dataList.map((dataItem, index) => (
        <OpenClassCard key={dataItem.id} dataItem={dataItem} deleteOpenClass={deleteOpenClass} />
      ))}
    </div>
  );
};

export default CardSlider;
