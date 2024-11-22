import React, { useState } from 'react';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import { useSelector } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';

const sizeMapping = {
  small: 16,
  medium: 24,
  large: 32,
};

const StarRating = ({ rating, onRatingChange, viewMode,  starSize = 'small' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  
  const handleClick = (index) => {
    if (!viewMode) {
      onRatingChange(index); // Update the rating only in edit mode
    }
  };

  const handleMouseOver = (index) => {
    if (!viewMode) {
      setHoverRating(index); // Set hoverRating only in edit mode
    }
  };

  const handleMouseLeave = () => {
    if (!viewMode) {
      setHoverRating(0); // Reset hoverRating only in edit mode
    }
  };

  const renderStar = (index) => {
    const isFull = (hoverRating || rating) >= index;
    const isHalf = index - 0.5 <= (hoverRating || rating) && (hoverRating || rating) < index;

    const starProps = {
      key: index,
      style: viewMode ? { cursor: 'default' } : { cursor: 'pointer' },
      onClick: () => handleClick(index),
      onMouseOver: () => handleMouseOver(index), // Add onMouseOver regardless of viewMode
      onMouseLeave: handleMouseLeave, // Add onMouseLeave regardless of viewMode
    };

    return (
      <span {...starProps}>
        {isFull ? (
          <FaStar size={sizeMapping[starSize]} color="#ffc107" />
        ) : isHalf ? (
          <FaStarHalf size={sizeMapping[starSize]} color="#ffc107" />
        ) : (
          <FaStar size={sizeMapping[starSize]} color="#e4e5e9" />
        )}
      </span>
    );
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(renderStar(i));
    }

    return stars;
  };

  return (
    <div style={{ color: isDarkModeOn?"white":"black" }}>
      {renderStars()}
    </div>
  );
};

export default StarRating;
