import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Container, Typography } from "@mui/material";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { selectDarkModeStatus } from "../../redux/selectors/darkModeSelector";
import launchOfferImg1 from "../../assets/images/launch-offer-img-1.png";
import launchOfferImg2 from "../../assets/images/launch-offer-img-2.png";

const LaunchOffer = () => {
  const isDarkMode = useSelector(selectDarkModeStatus);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: "0px",
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  useLayoutEffect(() => {
    if (isIntersecting && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isIntersecting, hasAnimated]);

  return (
    <Container maxWidth="lg">
      <Box
        ref={ref}
        sx={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "300px", md: "400px" },
            height: { xs: "300px", md: "400px" },
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={launchOfferImg1}
            alt="Decorative background image"
            sx={{
              position: "absolute",
              width: hasAnimated
                ? { xs: "250px", md: "300px" }
                : { xs: "225px", md: "275px" },
              height: hasAnimated
                ? { xs: "275px", md: "350px" }
                : { xs: "225px", md: "275px" },
              top: hasAnimated ? 0 : "40px",
              left: hasAnimated ? 0 : "40px",
              objectFit: "cover",
              transition: "all 1s ease-out",
            }}
          />

          <Box
            component="img"
            src={launchOfferImg2}
            alt="Decorative foreground image"
            sx={{
              position: "absolute",
              width: hasAnimated
                ? { xs: "200px", md: "250px" }
                : { xs: "225px", md: "275px" },
              height: hasAnimated
                ? { xs: "200px", md: "250px" }
                : { xs: "225px", md: "275px" },
              bottom: hasAnimated ? 0 : "40px",
              right: hasAnimated ? 0 : "40px",
              objectFit: "cover",
              transition: "all 1s ease-out",
            }}
          />
        </Box>

        <Box sx={{ flex: 1, color: isDarkMode ? "white" : "black" }}>
          <Typography
            sx={{
              fontSize: "40px",
              opacity: hasAnimated ? 1 : 0,
              transform: hasAnimated ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease-out 0.3s",
            }}
          >
            Exclusive Pre Launch Offers
          </Typography>

          <Typography
            sx={{
              fontSize: "13px",
              opacity: hasAnimated ? 1 : 0,
              transform: hasAnimated ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease-out 0.5s",
            }}
          >
            To help you experience the Nritya advantage, we&apos;ve crafted an
            unbeatable offer
          </Typography>

          <Box sx={{ mt: 6, display: "flex", gap: 5 }}>
            <Box
              sx={{
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(20px)",
                transition: "all 1s ease-out 0.7s",
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  lineHeight: "25px",
                }}
              >
                3 Month Free Trial
              </Typography>
              <Typography sx={{ mt: 1, fontSize: "13px", lineHeight: "20px" }}>
                Enjoy all the features of Nritya without any platform fees for
                the first 3 months.
              </Typography>
            </Box>

            <Box
              sx={{
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(20px)",
                transition: "all 1s ease-out 0.9s",
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  lineHeight: "25px",
                }}
              >
                Minimal Commission Deduction
              </Typography>
              <Typography sx={{ mt: 1, fontSize: "13px", lineHeight: "20px" }}>
                Only a minimal commission on each booking, keeping your revenue
                intact
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LaunchOffer;
