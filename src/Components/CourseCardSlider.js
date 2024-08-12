import "./WorkshopCardSlider.css";
import React from "react";
import CourseCard from "./CourseCard";

const CardSlider = ({ dataList, deleteCourse, actionsAllowed }) => {
  return (
    <div className={"horizontal-scroll-wrapper"}>
      {dataList.map((dataItem, index) => (
        <CourseCard key={dataItem.id} dataItem={dataItem} deleteCourse={deleteCourse} actionsAllowed={actionsAllowed} />
      ))}
    </div>
  );
};

export default CardSlider;
