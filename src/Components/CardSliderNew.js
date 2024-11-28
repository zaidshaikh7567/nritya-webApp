import React, { useEffect, useRef, useState } from 'react';
import NWorkshopCard from './NWorkshopCard';
import { COLLECTIONS } from '../constants';
import NCourseCard from './NCourseCard';
import NOpenClassCard from './NOpenClassCard';
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { Box } from '@mui/material';

const CardSliderNew = ({ dataList,studioIdName, type = COLLECTIONS.WORKSHOPS }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  console.log(dataList);
  const formattedDataList = Array.isArray(dataList) ? dataList : Object.values(dataList);
  console.log(formattedDataList,studioIdName)

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (direction === "left") {
      container.scrollBy({ left: -330, behavior: "smooth" });
    } else if (direction === "right") {
      container.scrollBy({ left: 330, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      updateScrollButtons();
      container.addEventListener("scroll", updateScrollButtons);
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', p: 0, m: 0, position: 'relative' }}>
    {canScrollLeft && <button className="scroll-button left" onClick={() => scroll("left")}>
      <MdArrowBackIosNew />
      </button>}
    <div ref={scrollRef} className="horizontal-scroll-wrapper no-important scroll-wrapper">
      {type === COLLECTIONS.WORKSHOPS && formattedDataList.map((data, index) => (
            <NWorkshopCard
            key={data.id}
            dataItem={data}
            studioIdName={studioIdName}
          />
      ))}
    {type === COLLECTIONS.COURSES && formattedDataList.map((data, index) => (
            <NCourseCard
            key={data.id}
            dataItem={data}
            studioIdName={studioIdName}
          />
      ))}
    
    {type === COLLECTIONS.OPEN_CLASSES && formattedDataList.map((data, index) => (
            <NOpenClassCard
            key={data.id}
            dataItem={data}
            studioIdName={studioIdName}
          />
      ))}
    </div>
    {canScrollRight && <button className="scroll-button right" onClick={() => scroll("right")}>
    <MdArrowForwardIos />
      </button>}
    </Box>
  );
};

export default CardSliderNew;
