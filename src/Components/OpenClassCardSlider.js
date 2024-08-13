import "./WorkshopCardSlider.css";
import React from "react";
import OpenClassCard from "./OpenClassCard";

const CardSlider = ({
  dataList,
  deleteOpenClass,
  actionsAllowed,
  activateOpenClass,
  deactivateOpenClass,
}) => {
  return (
    <div className={"horizontal-scroll-wrapper"}>
      {dataList.map((dataItem, index) => (
        <OpenClassCard
          key={dataItem.id}
          dataItem={dataItem}
          activateOpenClass={activateOpenClass}
          deactivateOpenClass={deactivateOpenClass}
          actionsAllowed={actionsAllowed}
        />
      ))}
    </div>
  );
};

export default CardSlider;
