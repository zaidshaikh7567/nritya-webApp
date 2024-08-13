import "./WorkshopCardSlider.css";
import React from "react";
import WorkshopCard from "./WorkshopCard";

const CardSlider = ({
  actionsAllowed,
  dataList,
  activateWorkshop,
  deactivateWorkshop,
}) => {
  return (
    <div className={"horizontal-scroll-wrapper"}>
      {dataList.map((dataItem, index) => (
        <WorkshopCard
          key={dataItem.id}
          dataItem={dataItem}
          activateWorkshop={activateWorkshop}
          deactivateWorkshop={deactivateWorkshop}
          actionsAllowed={actionsAllowed}
        />
      ))}
    </div>
  );
};

export default CardSlider;
