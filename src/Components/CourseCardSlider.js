import "./WorkshopCardSlider.css";
import React from "react";
import CourseCard from "./CourseCard";

const CardSlider = ({ dataList, deleteCourse }) => {
  return (
    <div className={"horizontal-scroll-wrapper"}>
      {dataList.map((dataItem, index) => (
        <CourseCard key={dataItem.id} dataItem={dataItem} deleteCourse={deleteCourse} />
      ))}
    </div>
  );
};

export default CardSlider;
