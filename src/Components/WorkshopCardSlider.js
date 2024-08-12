import "./WorkshopCardSlider.css";
import React from "react";
import WorkshopCard from "./WorkshopCard";

const CardSlider = ({ dataList, deleteWorkshop }) => {
  return (
    <div className={"horizontal-scroll-wrapper"}>
      {dataList.map((dataItem, index) => (
        <WorkshopCard key={dataItem.id} dataItem={dataItem} deleteWorkshop={deleteWorkshop} />
      ))}
    </div>
  );
};

export default CardSlider;
