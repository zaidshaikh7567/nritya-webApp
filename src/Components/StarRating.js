import React, { useState } from 'react';
import { FaStar, FaStarHalf } from 'react-icons/fa';

const sizeMapping = {
  small: 16,
  medium: 24,
  large: 32,
};

const StarRating = ({ rating, onRatingChange, viewMode,  starSize = 'small' }) => {
  const [hoverRating, setHoverRating] = useState(0);

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
    const wholeNumberPart = Math.floor(rating);
    const decimalPart = rating - wholeNumberPart;

    for (let i = 1; i <= 5; i++) {
      stars.push(renderStar(i));
    }

    return stars;
  };

  return <div>{renderStars()}{rating}</div>;
};

export default StarRating;
