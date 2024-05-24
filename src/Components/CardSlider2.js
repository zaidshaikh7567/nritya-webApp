import React, { useEffect, useRef } from 'react';
import './CardSlider2.css';
import { Card as MuiCard } from '@mui/joy';
import CardCover from '@mui/joy/CardCover';
import { Row } from 'react-bootstrap';

const CardSlider2 = ({ dataList }) => {
  const scrollWrapperRef = useRef(null);
  const thumbnailsRef = useRef([]);

  const scrollSpeed = 360; // Adjust this value for desired scroll speed
  const scrollInterval = 3000; // Interval between each scroll (in milliseconds)
  const stopInterval = 3000; // Interval to stop between scrolls (in milliseconds)

  useEffect(() => {
    const scrollWrapper = scrollWrapperRef.current;

    let scrollIntervalId;

    const startScrolling = () => {
      scrollIntervalId = setInterval(() => {
        if (scrollWrapper) {
          const maxScrollLeft = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
          const newScrollLeft = scrollWrapper.scrollLeft + scrollSpeed;
          if (newScrollLeft >= maxScrollLeft + scrollSpeed) {
            clearInterval(scrollIntervalId);
            setTimeout(() => {
              startScrolling();
            }, stopInterval);
          } else {
            scrollWrapper.scrollLeft = newScrollLeft;
          }
        }
      }, scrollInterval);
    };

    startScrolling();

    return () => clearInterval(scrollIntervalId);
  }, []);

  const handleThumbnailClick = (index) => {
    const scrollWrapper = scrollWrapperRef.current;
    if (scrollWrapper && thumbnailsRef.current[index]) {
      const scrollLeft = (index)*360;
      console.log(scrollLeft)
      scrollWrapper.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div className="horizontal-scroll-wrapper-carousel" ref={scrollWrapperRef}>
        {dataList.map((dataUrl, index) => (
          <a key={index} href="#">
            <MuiCard
              style={{ marginRight: "0.5rem" }}
              component="li"
              sx={{ height: 175, width: 350 }}
            >
              <CardCover>
                <img
                  src={dataUrl}
                  srcSet={dataUrl}
                  loading="lazy"
                  alt=""
                />
              </CardCover>
            </MuiCard>
          </a>
        ))}
      </div>
      
      <div hidden className="thumbnails justify-content align">
        {dataList.map((dataUrl, index) => (
          <img
            key={index}
            src={dataUrl}
            alt={`Thumbnail ${index}`}
            onClick={() => handleThumbnailClick(index)}
            ref={(ref) => (thumbnailsRef.current[index] = ref)}
          />
        ))}
      </div>

      
    </div>
  );
};

export default CardSlider2;
