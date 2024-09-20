import { COLORS } from "../constants";


export const getRandomColor = () => {
  const colorKeys = Object.keys(COLORS);  // Get all color keys
  const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];  // Pick a random key
  return COLORS[randomKey];  // Return the corresponding color object
};


// Function to decode a Unicode (UTF-8) encoded string back to the original text
export const decodeUnicode = (unicodeString) => {
  const utf8Encoded = unicodeString.split('').map((c) => c.charCodeAt(0));
  const textDecoder = new TextDecoder();
  return textDecoder.decode(new Uint8Array(utf8Encoded));
};

export const convertToHtmlEntities= (text) =>{
  return text.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
      return '&#' + i.charCodeAt(0) + ';';
  });
}

export const gradientStyles = [
  { background: 'linear-gradient(to bottom right, #FFD700, #FFA500)', color: 'black' },
  { background: 'linear-gradient(to bottom right, #00BFFF, #1E90FF)', color: 'black' },
  { background: 'linear-gradient(to bottom right, #32CD32, #008000)', color: 'white' },
  { background: 'linear-gradient(to bottom right, #FFA500, #FF4500)', color: 'black' },
  { background: 'linear-gradient(to bottom right, #DC143C, #8B0000)', color: 'white' },
  { background: 'linear-gradient(to bottom right, #000000, #2F4F4F)', color: 'white' },
];