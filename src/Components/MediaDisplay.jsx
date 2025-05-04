import React, {useEffect, useState} from 'react';
import { Box } from '@mui/material';
import { getYoutubeVideoId } from '../utils/common';

const MediaDisplay = ({ youtubeViedoLink, imageUrl, altText }) => {
  const [youtubeId, setYoutubeId] = useState(null);

  useEffect(() => {
    if (youtubeViedoLink) {
      console.log("MediaDisplay", youtubeViedoLink)
      const videoId  = getYoutubeVideoId(youtubeViedoLink);
      console.log("MediaDisplay", videoId)
      setYoutubeId(videoId);
    }
  }, [youtubeViedoLink]);
  
  return youtubeViedoLink && youtubeId ? (
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
        maxHeight: "50%",
        objectFit: "cover",
        borderRadius: "8px",
      }}
    />
  );
};

export default MediaDisplay;
