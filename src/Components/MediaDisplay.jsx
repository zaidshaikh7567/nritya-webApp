import React from 'react';
import { Box } from '@mui/material';

const MediaDisplay = ({ youtubeId, imageUrl, altText }) => {
  return youtubeId ? (
    <Box
      sx={{
        position: "relative",
        paddingBottom: "56.25%",  // 16:9 aspect ratio
        height: 0,
        overflow: "hidden",
        borderRadius: "8px",
      }}
    >
      <Box
        component="iframe"
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1`}
        title={altText || "Workshop Video"}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
          borderRadius: "8px",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Box>
  ) : (
    <Box
      component="img"
      src={imageUrl}
      alt={altText || "Workshop Image"}
      sx={{
        width: "100%",
        height: "auto",
        objectFit: "cover",
        borderRadius: "8px",
      }}
    />
  );
};

export default MediaDisplay;
