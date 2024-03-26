import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Card } from 'react-bootstrap';
import './CardSlider.css';
import CardSliderCard from './CardSliderCard';
import ProductCard from './NStudioCard';

const CardSlider = ({ dataList, imgOnly = false }) => {
  console.log("Debug from CardSlider", imgOnly)

  return (
    <div className={imgOnly?"scrolling-wrapper":"horizontal-scroll-wrapper"}>
      {dataList.map((studio, index) => (
        <a key={index} href={`#/studio/${studio.id}`}>
          {imgOnly ? (
            dataList.map((img, index) => (
              <Card className="cardSlider" key={index}>
                <Card.Img className="card-img" variant="top" src={img} alt={`Card ${index + 1}`} />
              </Card>
            ))
          ) : (
            <ProductCard key={studio.id} data={studio} img_src={studio.imgSrc} />
          )}
        </a>
      ))}
    </div>

    /*
    <div className="scrolling-wrapper">
      {imgOnly ? (
        dataList.map((img, index) => (
          <Card className="cardSlider" key={index}>
            <Card.Img className="card-img" variant="top" src={img} alt={`Card ${index + 1}`} />
          </Card>
        ))
      ) : (
        dataList.map((studio, index) => (
          <CardSliderCard studio={studio}/>
        ))
      )}
    </div>
    */
  );
};

export default CardSlider;
