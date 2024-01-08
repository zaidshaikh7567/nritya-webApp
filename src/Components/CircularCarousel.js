// CircularCarousel.js

import React, { useRef } from 'react';
import { Card } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './CircularCarousel.css';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';

function CircularCarousel({ carouselImages,title="Images" }) {
  const containerRef = useRef(null);
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const scrollLeft = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollLeft -= container.clientWidth;
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollLeft += container.clientWidth;
    }
  };

  return (
    <>
      {carouselImages.length > 0 && (
        <h2 style={{ color: isDarkModeOn ? 'white' : 'black' }}>{title}</h2>
      )}
      <div className='carousel-container'>
        <button onClick={(e) => {e.preventDefault(); scrollLeft();}}
          className='carousel-button '>
          <FaChevronLeft />
        </button>
        <div className="row-container" ref={containerRef}>
          {carouselImages.map((carouselImage, index) => (
            <div key={index} style={{ marginRight: '10px', padding: '1px', textDecoration: 'none' }}>
              <Card className='carousel-card'>
                <Card.Img src={carouselImage} />
              </Card>
            </div>
          ))}
        </div>
        <button onClick={(e) => {e.preventDefault();scrollRight();}}
          className='carousel-button '>
          <FaChevronRight />
        </button>
      </div>
    </>
  );
}

export default CircularCarousel;
