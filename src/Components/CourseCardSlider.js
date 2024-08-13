import "./WorkshopCardSlider.css";
import React from "react";
import CourseCard from "./CourseCard";

const CardSlider = ({
  dataList,
  activateCourse,
  deactivateCourse,
  actionsAllowed,
}) => {
  return (
    <div className={"horizontal-scroll-wrapper"}>
      {dataList.map((dataItem, index) => (
        <CourseCard
          key={dataItem.id}
          dataItem={dataItem}
          activateCourse={activateCourse}
          deactivateCourse={deactivateCourse}
          actionsAllowed={actionsAllowed}
        />
      ))}
    </div>
  );
};

export default CardSlider;
