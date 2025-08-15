"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, Typography, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function StudioRentalImagesCarousel({ studioImages, title="Studio Images" }) {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md")); // md = 900px+
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!studioImages || studioImages.length === 0) return null;

  const imagesPerView = isLargeScreen ? 3 : 1; // show 3 images on large screens, 1 on mobile

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? studioImages.length - imagesPerView : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev >= studioImages.length - imagesPerView ? 0 : prev + 1
    );
  };

  const visibleImages = studioImages.slice(
    currentIndex,
    currentIndex + imagesPerView
  );

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: "bold", textTransform: "none" }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflow: "hidden",
            position: "relative",
            mb: 2,
          }}
        >
          {visibleImages.map((img, idx) => (
            <Box
              key={idx}
              sx={{
                flex: "0 0 auto",
                width: isLargeScreen ? "33.33%" : "100%",
                height: 250,
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Image
                src={img}
                alt={`Studio ${idx + 1}`}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>
          ))}

          {/* Prev arrow */}
          {studioImages.length > imagesPerView && (
            <Box
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "rgba(0,0,0,0.5)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
              }}
              onClick={goToPrev}
            >
              ‹
            </Box>
          )}

          {/* Next arrow */}
          {studioImages.length > imagesPerView && (
            <Box
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "rgba(0,0,0,0.5)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
              }}
              onClick={goToNext}
            >
              ›
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
