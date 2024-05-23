import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './DanceCarousel.css';
import { Hidden } from '@mui/material';

const DanceCarousel = ({ danceImages }) => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    arrows: false,
    slidesToScroll: 1,
    customPaging: function(i) {
      return (
        <a>
          <img src={danceImages[i]} />
        </a>
      );
    },


    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
        
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
        {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              
            }
          }
      ]
  };

  return (
    <Slider {...settings}>
      {danceImages.map((image, index) => (
        <div id={index} className="image-container">
            <img className="img-fluid hover-image"  style={{paddingRight:"5px"}} src={image}></img>
        </div>
      ))}
    </Slider>
  );
};

export default DanceCarousel;
