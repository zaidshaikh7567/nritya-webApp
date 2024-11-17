import React from 'react';
import { Box, Card, Skeleton, Stack } from '@mui/material';

const EntitySkeleton = ({ count = 5, cardWidth = 320 }) => {
  const skeletonArray = Array.from({ length: count }, (_, index) => index);

  return (
    <div className="horizontal-scroll-wrapper">
      {skeletonArray.map(index => (
        <Card
          key={index}
          sx={{
            backgroundColor: "#f5f5f5",
            padding: "10px",
            marginRight: "10px",
            width: cardWidth,
            maxWidth: "100%",
            boxShadow: "lg",
          }}
        >
          <Skeleton variant="rectangular" width="100%" height={180} />
          <Stack spacing={1} mt={2}>
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={20} />
          </Stack>
        </Card>
      ))}
    </div>
  );
};

export default EntitySkeleton;
