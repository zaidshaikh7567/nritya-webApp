import React, { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BsCheck2 } from "react-icons/bs";
import { Box, Container, Divider, Typography } from "@mui/material";
import { selectDarkModeStatus } from "../../redux/selectors/darkModeSelector";
import communityImg from "../../assets/images/comminity.jpg";

const Community = () => {
  const isDarkMode = useSelector(selectDarkModeStatus);
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <Container
      ref={containerRef}
      maxWidth="lg"
      sx={{
        py: 10,
        px: { xs: 0, md: 6 },
        display: "flex",
        columnGap: 2,
        rowGap: 5,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* TEXT SECTION */}
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          color: isDarkMode ? "white" : "black",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0px)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <Typography sx={{ fontSize: "30px" }}>
          Nritya - a community of dance lovers actively searching for the
          perfect studio.
        </Typography>

        <Box sx={{ mt: 3, mx: "auto", width: "80%" }}>
          {[
            "Laser Focused Audience",
            "No More Algorithm Guessing",
            "MaximiseClass Enrolment",
          ].map((item, index, arr) => (
            <React.Fragment key={index}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  alignItems: "center",
                  columnGap: 3,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0px)" : "translateY(20px)",
                  transition: `opacity 0.6s ease ${
                    index * 0.2
                  }s, transform 0.6s ease ${index * 0.2}s`,
                }}
              >
                <Typography sx={{ fontSize: "20px" }}>{item}</Typography>
                <BsCheck2
                  color={isDarkMode ? "white" : "black"}
                  style={{ flexShrink: 0, fontSize: "20px" }}
                />
              </Box>
              {index < arr.length - 1 && (
                <Divider
                  color={isDarkMode ? "white" : "black"}
                  sx={{
                    my: 1,
                    height: "1px",
                    opacity: visible ? 1 : 0,
                    width: visible ? "100%" : "0%",
                    transition: `width 0.6s ease ${
                      index * 0.2 + 0.2
                    }s, opacity 0.6s ease`,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* IMAGE SECTION */}
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          height: "300px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            transform: visible ? "translateX(0%)" : "translateX(100%)",
            transition: "transform 0.8s ease",
          }}
        >
          <img
            src={communityImg}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Community;
