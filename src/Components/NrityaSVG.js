import React from 'react';
import './NrityaSVG.css';

const NrityaSVG = ({ text, x, y, fontSize }) => {
  const textArray = (text ? text : "Discover the beat in your city!").split('');

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20" width="100%" height="7%">
      <text 
        x={x ? x : 0} 
        y={y ? y : "10"} 
        fill="#888" 
        fontFamily="Arial" 
        fontSize={fontSize ? fontSize : "5px"} 
        stroke="#888" 
        strokeWidth="0.3"
      >
        {textArray.map((char, index) => (
        <tspan key={index} className={`hover-effect`}>
          {char}
        </tspan>
      ))}

      </text>
    </svg>
  );
};

export default NrityaSVG;
