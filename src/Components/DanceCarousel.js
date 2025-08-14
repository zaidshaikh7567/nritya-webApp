import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './DanceCarousel.css';

const DanceCarousel = ({ danceImages }) => {
  console.log("Dance Images",danceImages);
  const settings = {
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 3,
    arrows: false,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",

    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2.25,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
        
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1.5,
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
        <div key={index} id={index} className="image-container">
            <img className="img-fluid hover-image" loading="lazy" style={{paddingRight:"5px"}} src={image} alt={`Dance image ${index + 1}`}></img>
        </div>

        
      ))}
    </Slider>
  );
};

export default DanceCarousel;
