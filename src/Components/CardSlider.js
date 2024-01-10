import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Card } from 'react-bootstrap';
import './CardSlider.css'
const CardSlider = ({ imgList }) => {
  

  return (
    
    <div className="scrolling-wrapper">
      {imgList.map((img, index) => (
        <Card className="cardSlider" key={index}>
          <Card.Img variant="top" src={img} alt={`Card ${index + 1}`} />
        </Card>
      ))}
    </div>

   

  );
};

export default CardSlider;
