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
      {formattedDataList.map((entity, index) => (
        imgOnly ? (
          // Image-only case with anchor <a> no link just to make card UI look proper
          <a>
          <MuiCard
            key={index}
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
                src={entity} // Use studio.iconUrl for the image source
                loading="lazy"
                alt={ "Studio image"} // Use studioName for alt text
              />
            </CardCover>
          </MuiCard>
          </a>
        ) : (
          // Non-image-only case, wrap in <a>
          <a key={index} href={`#/studio/${entity.id}`}>
            <ProductCard
              key={entity.id}
              data={entity}
              img_src={entity.iconUrl} // Use iconUrl if imgSrc is not available
            />
          </a>
        )
      ))}
    </div>

  );
};

export default CardSlider;
