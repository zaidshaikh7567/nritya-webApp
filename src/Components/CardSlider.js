import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Card } from 'react-bootstrap';
import './CardSlider.css';
import CardSliderCard from './CardSliderCard';
import ProductCard from './NStudioCard';
import {Card as MuiCard}from '@mui/joy';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';


const CardSlider = ({ dataList, imgOnly = false }) => {
  console.log("Debug from CardSlider", imgOnly)

  return (
    <div className={"horizontal-scroll-wrapper"}>
      {dataList.map((studio, index) => (
        <a key={index} href={`#/studio/${studio.id}`}>
          {imgOnly ? (
              <MuiCard style={{paddingRight:"1px"}} component="li" sx={{height:300, width: 534}} >
                <CardCover>
                  <img
                    src={studio}
                    srcSet={studio}
                    loading="lazy"
                    alt=""
                  />
                </CardCover>
              </MuiCard>
            
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
