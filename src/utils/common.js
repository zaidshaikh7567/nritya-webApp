import { COLORS } from "../constants";


export const getRandomColor = () => {
  const colorKeys = Object.keys(COLORS);  // Get all color keys
  const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];  // Pick a random key
  return COLORS[randomKey];  // Return the corresponding color object
};
