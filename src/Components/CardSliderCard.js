import React from 'react';
import NStudioCard from './NStudioCard';

const CardSliderCard = ({ studio }) => {
  return (
    <a href={`/studio/${studio.id}`}>
    <NStudioCard data={studio} img_src={"https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"}/>
    </a>

  );
};

export default CardSliderCard;
