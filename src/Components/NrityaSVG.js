import { Grid } from '@mui/material';
import React from 'react';

const NrityaSVG = ({text,x,y}) => {

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20" width="100%" height="10%">
    <text x={x?x:0} y={y?y:"15"} fill="#888" font-family="Arial" font-size="10" stroke="#888" stroke-width="0.6">
    {text?text:"Discover the beat!"}
    </text>
  </svg>
  
  );
};

export default NrityaSVG;
