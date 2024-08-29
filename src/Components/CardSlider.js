import React from 'react';
import { Card as MuiCard } from '@mui/joy';
import CardCover from '@mui/joy/CardCover';
import ProductCard from './NStudioCard';

const CardSlider = ({ dataList, imgOnly = false }) => {
  console.log("Debug from CardSlider", imgOnly);
  console.log(dataList);
  const formattedDataList = Array.isArray(dataList) ? dataList : Object.values(dataList);
  console.log(formattedDataList)

  const cardHoverStyle = {
    transform: 'scale(1.01)', // Scale up slightly on hover
  };

  return (
    <div className="horizontal-scroll-wrapper">
      {formattedDataList.map((studio, index) => (
        <a key={index} href={`#/studio/${studio.id}`}>
          {imgOnly ? (
            <MuiCard
              style={{ marginRight: "0.5rem" }}
              component="li"
              sx={{
                height: 300,
                width: 534,
                '&:hover': {
                  ...cardHoverStyle,
                },
              }}
            >
              <CardCover>
                <img
                  src={studio.iconUrl} // Use studio.iconUrl for the image source
                  srcSet={studio.iconUrl}
                  loading="lazy"
                  alt={studio.studioName || "Studio image"} // Use studioName for alt text
                />
              </CardCover>
            </MuiCard>
          ) : (
            <ProductCard
              key={studio.id}
              data={studio}
              img_src={studio.iconUrl} // Use iconUrl if imgSrc is not available
            />
          )}
        </a>
      ))}
    </div>
  );
};

export default CardSlider;
