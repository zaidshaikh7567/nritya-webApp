import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import bannerBgImage from "../../assets/images/banner-bg.png";
import { selectDarkModeStatus } from "../../redux/selectors/darkModeSelector";
import banner1 from "../../assets/images/banner-1.jpg";
import banner2 from "../../assets/images/banner-2.png";
import banner3 from "../../assets/images/banner-3.jpg";
import banner4 from "../../assets/images/banner-4.png";
import banner5 from "../../assets/images/banner-5.jpg";
import banner6 from "../../assets/images/banner-6.jpg";

const leftImages = [
  {
    src: banner1,
    height: 220,
    offset: true,
    transform: "translateY(20px)",
    objectXPosition: "50%",
    filterGrayScale: "50%",
    parallaxIntensity: 0.03,
    scaleOnHover: 1.1,
  },
  {
    src: banner2,
    height: 250,
    offset: false,
    transform: "translateY(-10px)",
    objectXPosition: "50%",
    filterGrayScale: "30%",
    parallaxIntensity: 0.02,
    scaleOnHover: 1.08,
  },
  {
    src: banner3,
    height: 300,
    offset: false,
    transform: "translateY(5px)",
    objectXPosition: "-90px",
    filterGrayScale: "50%",
    parallaxIntensity: 0.04,
    scaleOnHover: 1.12,
  },
];

const rightImages = [
  {
    src: banner4,
    height: 280,
    offset: false,
    transform: "translateY(-15px)",
    objectXPosition: "50%",
    filterGrayScale: "100%",
    parallaxIntensity: 0.05,
    scaleOnHover: 1.15,
  },
  {
    src: banner5,
    height: 260,
    offset: false,
    transform: "translateY(10px)",
    objectXPosition: "50%",
    filterGrayScale: "50%",
    parallaxIntensity: 0.03,
    scaleOnHover: 1.1,
  },
  {
    src: banner6,
    height: 235,
    offset: true,
    transform: "translateY(-5px)",
    objectXPosition: "50%",
    filterGrayScale: "50%",
    parallaxIntensity: 0.02,
    scaleOnHover: 1.07,
  },
];

const Banner = ({ scrollToGetInTouchSection }) => {
  const isDarkMode = useSelector(selectDarkModeStatus);
  const textRef = useRef(null);
  const letters = ["N", "r", "i", "t", "y", "a"];
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const bannerRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const letters = textRef.current.querySelectorAll("span");
      letters.forEach((letter, index) => {
        letter.style.animation = `revealFromBelow 0.5s ease forwards ${
          index * 0.1
        }s`;
      });
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (bannerRef.current) {
        const rect = bannerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculateParallax = (intensity, index) => {
    const normalizedX = (mousePosition.x - 0.5) * 2;
    const normalizedY = (mousePosition.y - 0.5) * 2;
    const direction = index % 2 === 0 ? 1 : -1;
    const translateX = normalizedX * intensity * 100 * direction;
    const translateY = normalizedY * intensity * 50 * direction;
    return `translate(${translateX}px, ${translateY}px)`;
  };

  return (
    <Box
      ref={bannerRef}
      sx={{
        pt: 8,
        pb: 20,
        textAlign: "center",
        color: isDarkMode ? "white" : "black",
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        "@keyframes revealFromBelow": {
          "0%": {
            transform: "translateY(100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bannerBgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: { xs: "cover", md: "300px 125%" },
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      {/* Left Images */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          gap: 2,
          flexGrow: 1,
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        {leftImages.map((img, i) => {
          const parallaxTransform = calculateParallax(img.parallaxIntensity, i);
          return (
            <Box
              key={i}
              sx={{
                position: "relative",
                marginLeft: img.offset ? "-60px" : "0",
                transform: img.transform,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: `${img.transform} scale(${img.scaleOnHover})`,
                  zIndex: 2,
                },
              }}
            >
              <img
                src={img.src}
                alt=""
                style={{
                  width: "120px",
                  height: `${img.height}px`,
                  objectFit: "cover",
                  objectPosition: `${img.objectXPosition} 100%`,
                  transform: parallaxTransform,
                  filter: `grayscale(${img.filterGrayScale})`,
                  transition: "all 0.3s ease-out",
                  willChange: "transform, filter",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `${parallaxTransform} scale(${img.scaleOnHover})`;
                  e.currentTarget.style.zIndex = "2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = parallaxTransform;
                  e.currentTarget.style.zIndex = "1";
                }}
              />
            </Box>
          );
        })}
      </Box>

      {/* Center Section */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          px: 2,
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: "16px", textTransform: "uppercase" }}>
          Welcome to
        </Typography>
        <Typography
          ref={textRef}
          sx={{
            mt: 3,
            fontSize: { xs: "48px", md: "80px" },
            fontWeight: 300,
            textTransform: "capitalize",
            display: "inline-block",
            overflow: "hidden",
          }}
        >
          {letters.map((letter, index) => (
            <span
              key={index}
              style={{
                display: "inline-block",
                opacity: 0,
                transform: "translateY(100%)",
              }}
            >
              {letter}
            </span>
          ))}
        </Typography>
        <Typography sx={{ mx: "auto", mt: 2, fontSize: "16px" }}>
          Unlock your studio&apos;s full potential with Nritya - where dance dreams
          meet their perfect studio.
        </Typography>
        <Button
          onClick={scrollToGetInTouchSection}
          sx={{
            mt: 3,
            py: "10px",
            px: "26px",
            bgcolor: "#67569E",
            color: "white",
            textTransform: "unset",
            fontSize: "16px",
            transition: "transform 0.3s ease",
            "&:hover": {
              bgcolor: "#67569E",
              transform: "scale(1.05)",
            },
          }}
        >
          Request a Demo
        </Button>
      </Box>

      {/* Right Images */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          gap: 2,
          flexGrow: 1,
          justifyContent: "flex-start",
          alignItems: "flex-end",
        }}
      >
        {rightImages.map((img, i) => {
          const parallaxTransform = calculateParallax(img.parallaxIntensity, i);
          return (
            <Box
              key={i}
              sx={{
                position: "relative",
                marginRight: img.offset ? "-60px" : "0",
                transform: img.transform,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: `${img.transform} scale(${img.scaleOnHover})`,
                  zIndex: 2,
                },
              }}
            >
              <img
                src={img.src}
                alt=""
                style={{
                  width: "120px",
                  height: `${img.height}px`,
                  objectFit: "cover",
                  objectPosition: `${img.objectXPosition} 100%`,
                  transform: parallaxTransform,
                  filter: `grayscale(${img.filterGrayScale})`,
                  transition: "all 0.3s ease-out",
                  willChange: "transform, filter",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `${parallaxTransform} scale(${img.scaleOnHover})`;
                  e.currentTarget.style.zIndex = "2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = parallaxTransform;
                  e.currentTarget.style.zIndex = "1";
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Banner;
