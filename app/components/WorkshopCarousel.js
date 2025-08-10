'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Card, CardContent, Typography, Chip, AspectRatio } from '@mui/joy';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import { danceStylesColorChips } from '../../src/constants';
import './Carousel.css';
import { Button } from '@mui/material';

const WorkshopCarousel = ({ workshops, title = "Featured Workshops" }) => {
  const [isDarkModeOn, setIsDarkModeOn] = useState(false);
  
  console.log('WorkshopCarousel received workshops:', workshops);
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
  }, [workshops]);

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

  // Helper function to get YouTube thumbnail
  const getYoutubeThumbnail = (youtubeLink) => {
    if (!youtubeLink) return null;
    const videoId = youtubeLink.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg` : null;
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        level="h4" 
        sx={{ 
          mb: 2, 
          color: isDarkModeOn ? 'white' : 'black',
          fontWeight: 'bold'
        }}
      >
        {title}
      </Typography>
      
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
          {workshops.map((workshop, index) => {
            const thumbnailUrl = getYoutubeThumbnail(workshop.youtubeViedoLink) || 
                                workshop.iconUrl || 
                                "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg";

            return (
              <Card
                key={workshop.id || index}
                variant="solid"
                sx={cardStyle}
                component="a"
                href={`/workshop/${workshop.id}`}
              >
                <AspectRatio ratio="1.78" sx={{ position: 'relative' }}>
                  <img
                    src={thumbnailUrl}
                    loading={index < 3 ? "eager" : "lazy"}
                    alt={`${workshop.workshopName} workshop`}
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
                    {workshop.danceStyles && Array.isArray(workshop.danceStyles) && 
                      workshop.danceStyles.slice(0, 3).map((style, chipIndex) => (
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
                </AspectRatio>

                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
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
                      {workshop.workshopName}
                    </Typography>
                  </Box>
                  

                  <Typography
                    level="body-sm"
                    sx={{
                      color: isDarkModeOn ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    {workshop.date || ""} | {workshop.time || ""}
                  </Typography>
                    <Box display="flex" justifyContent="space-between">
                        <Typography alignSelf="center" fontSize={12} style={{ color: isDarkModeOn ? 'white' : 'black' }}>
                          {workshop && workshop.price && workshop.price>=0 &&(`@ ₹${workshop.price} onwards`)}
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
                          Book Now
                        </Button>
                    </Box>
                </CardContent>
              </Card>
            );
          })}
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

export default WorkshopCarousel; 