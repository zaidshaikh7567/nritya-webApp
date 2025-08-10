'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Card, CardContent, Typography, Chip, AspectRatio } from '@mui/joy';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import { danceStylesColorChips } from '../../src/constants';
import './Carousel.css';
import { Button } from '@mui/material';
import Link from 'next/link';

const StudioCarousel = ({ studios, title = "Featured Studios" }) => {
  const [isDarkModeOn, setIsDarkModeOn] = useState(false);
  
  console.log('StudioCarousel received studios:', studios);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Calculate visible cards based on screen size
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleCards(1);
      } else if (width < 1024) {
        setVisibleCards(2);
      } else if (width < 1440) {
        setVisibleCards(3);
      } else {
        setVisibleCards(4);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Update scroll buttons
  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      updateScrollButtons();
      container.addEventListener("scroll", updateScrollButtons);
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [studios]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const cardWidth = 320 + 16; // card width + margin
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const cardStyle = {
    backgroundColor: isDarkModeOn ? '#444' : 'white',
    padding: '0px',
    color: isDarkModeOn ? 'white' : 'black',
    marginRight: "16px",
    width: 320,
    maxWidth: "100%",
    flexShrink: 0, // Prevent cards from shrinking
    boxShadow: 'lg',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: 'xl',
    },
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography 
          level="h4" 
          sx={{ 
            color: isDarkModeOn ? 'white' : 'black',
            fontWeight: 'bold'
          }}
        >
          {title}
        </Typography>
        <Button
          size='small'
          variant="contained"
          sx={{
            color: 'white',
            backgroundColor: '#735EAB',
            '&:hover': {
              backgroundColor: '#735EAB',
              color: 'white',
            },
            '&.Mui-disabled': {
              backgroundColor: isDarkModeOn ? 'rgba(115, 94, 171, 0.5)' : 'rgba(115, 94, 171, 0.3)',
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
          component={Link}
          href="/search/studio"
        >
          View all
        </Button>
      </Box>
      
      <Box sx={{ position: 'relative' }}>
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            className="scroll-button left"
            onClick={() => scroll("left")}
            aria-label="Previous slide"
            type="button"
          >
            <MdArrowBackIosNew />
          </button>
        )}

        {/* Carousel Container */}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            gap: 2,
            pb: 2,
          }}
        >
          {studios.map((studio, index) => (
            <Card
              key={studio.id || index}
              variant="solid"
              sx={cardStyle}
              component={Link}
              href={`/studio/${studio.id}`}
            >
              <AspectRatio ratio="1.78" sx={{ position: 'relative' }}>
                <img
                  src={studio.iconUrl || "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"}
                  loading={index < 3 ? "eager" : "lazy"}
                  alt={`${studio.studioName} studio`}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
                
                {/* Dance Style Chips */}
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 8, 
                  left: 8, 
                  display: 'flex', 
                  gap: 1,
                  flexWrap: 'wrap'
                }}>
                  {studio.danceStyles && 
                    studio.danceStyles.split(",").slice(0, 3).map((style, chipIndex) => (
                      <Chip
                        key={chipIndex}
                        size="sm"
                        sx={{
                          fontSize: '0.7rem',
                          bgcolor: danceStylesColorChips[chipIndex]?.backgroundColor || '#735EAB',
                          color: danceStylesColorChips[chipIndex]?.color || 'white',
                        }}
                      >
                        {style.trim()}
                      </Chip>
                    ))
                  }
                </Box>

                {/* Free Trial Badge */}
                {(studio.freeTrialAvailable === "true" || studio.freeTrialAvailable === true) && (
                  <Chip
                    size="sm"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      fontSize: '0.7rem',
                      bgcolor: '#4CAF50',
                      color: 'white',
                    }}
                  >
                    Free Trial
                  </Chip>
                )}
              </AspectRatio>

              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography
                    level="title-md"
                    sx={{
                      color: isDarkModeOn ? 'white' : 'black',
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}
                  >
                    {studio.studioName}
                  </Typography>
                  {studio.avgRating && studio.avgRating > 0 && (
                    <Typography
                      sx={{ 
                        color: isDarkModeOn ? 'white' : 'black',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}
                    >
                      ⭐ {studio.avgRating.toFixed(1)}
                    </Typography>
                  )}
                </Box>
                
                <Typography
                  level="body-xs"
                >
                  {studio.street || "Address not available"}
                </Typography>
                
                <Box display="flex" justifyContent="space-between">
          <Typography alignSelf="center" fontSize={12} style={{ color: isDarkModeOn ? 'white' : 'black' }}>
            {studio && studio.minFee && studio.minFee>=0 &&(`@ ₹${studio.minFee} onwards`)}
          </Typography>
          <Button
            size='small'
            variant="contained"
            sx={{
              alignSelf: "center",
              color: 'white',
              backgroundColor: '#735EAB',
              '&:hover': {
                backgroundColor: '#735EAB',
                color: 'white',
              },
              '&.Mui-disabled': {
                backgroundColor: isDarkModeOn ? 'rgba(115, 94, 171, 0.5)' : 'rgba(115, 94, 171, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
            type='button'
          >
            Explore
          </Button>
          </Box>


                
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            className="scroll-button right"
            onClick={() => scroll("right")}
            aria-label="Next slide"
            type="button"
          >
            <MdArrowForwardIos />
          </button>
        )}
      </Box>
    </Box>
  );
};

export default StudioCarousel; 