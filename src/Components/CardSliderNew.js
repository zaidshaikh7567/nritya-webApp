import React from 'react';
import { Card as MuiCard } from '@mui/joy';
import CardCover from '@mui/joy/CardCover';
import ProductCard from './NStudioCard';
import NWorkshopCard from './NWorkshopCard';
import { COLLECTIONS } from '../constants';
import NCourseCard from './NCourseCard';
import NOpenClassCard from './NOpenClassCard';

const CardSliderNew = ({ dataList,studioIdName, type = COLLECTIONS.WORKSHOPS }) => {
  console.log(dataList);
  const formattedDataList = Array.isArray(dataList) ? dataList : Object.values(dataList);
  console.log(formattedDataList)

  const cardHoverStyle = {
    transform: 'scale(1.01)', // Scale up slightly on hover
  };

  return (
    <div className="horizontal-scroll-wrapper">
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
  );
};

export default CardSliderNew;
