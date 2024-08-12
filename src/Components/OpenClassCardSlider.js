import "./WorkshopCardSlider.css";
import React from "react";
import OpenClassCard from "./OpenClassCard";

const CardSlider = ({ dataList, deleteOpenClass, actionsAllowed }) => {
  return (
    <div className={"horizontal-scroll-wrapper"}>
      {dataList.map((dataItem, index) => (
        <OpenClassCard key={dataItem.id} dataItem={dataItem} deleteOpenClass={deleteOpenClass} actionsAllowed={actionsAllowed} />
      ))}
    </div>
  );
};

export default CardSlider;
