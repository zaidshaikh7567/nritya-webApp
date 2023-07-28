import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

function RenderRating(rating) {
  // round the rating to the nearest 0.5
  const roundedRating = Math.round( parseFloat(rating.rating) * 2) / 2;
    console.log(roundedRating,rating.rating)
  // generate the stars
  const fullStars = Math.floor(roundedRating);
  const halfStars = roundedRating - fullStars;
  const emptyStars = 5 - fullStars - halfStars;

  // create an array of stars to render
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`star-${i}`} color="yellow" />);
  }
  if (halfStars > 0) {
    stars.push(<FaStar key="star-half" color="yellow" />);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`star-empty-${i}`} color="yellow" />);
  }

  // render the stars
  return <>{stars}</>;
}

export default RenderRating;
