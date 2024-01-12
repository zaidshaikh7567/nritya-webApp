import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Card } from 'react-bootstrap';
import './CardSlider.css';
import CardSliderCard from './CardSliderCard';

const CardSlider = ({ dataList, imgOnly = false }) => {
  console.log("Debug from CardSlider", imgOnly)
  return (
    <div className="scrolling-wrapper">
      {imgOnly ? (
        dataList.map((img, index) => (
          <Card className="cardSlider" key={index}>
            <Card.Img variant="top" src={img} alt={`Card ${index + 1}`} />
          </Card>
        ))
      ) : (
        dataList.map((studio, index) => (
          <CardSliderCard studio={studio}/>
        ))
      )}
    </div>
  );
};

export default CardSlider;
