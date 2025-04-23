import { useSelector } from "react-redux";
import { Box, Container, Grid, Typography } from "@mui/material";
import { selectDarkModeStatus } from "../../redux/selectors/darkModeSelector";
import service1Img from "../../assets/images/service-1.jpg";
import service2Img from "../../assets/images/service-2.jpg";
import service3Img from "../../assets/images/service-3.jpg";
import service4Img from "../../assets/images/service-4.jpg";
import service5Img from "../../assets/images/service-5.jpg";
import service6Img from "../../assets/images/service-6.png";

const ourServices = [
  {
    number: "01",
    title: "Studio Listing",
    image: service1Img,
    description:
      "Feature your studio and classes to dance enthusiasts in your area.",
  },
  {
    number: "02",
    title: "Workshop Listing",
    image: service2Img,
    description:
      "Promote your specialized workshops and attract targeted students.",
  },
  {
    number: "03",
    title: "Open Class Listing",
    image: service3Img,
    description:
      "Fill your open classes faster by showcasing them to motivated learners.",
  },
  {
    number: "04",
    title: "Seamless Booking & Payment",
    image: service4Img,
    description:
      "Hassle-free booking and secure transactions through our integrated payment gateway.",
  },
  {
    number: "05",
    title: "Wedding Choreography",
    image: service5Img,
    description:
      "Get connected to potential clients who are looking for wedding choreography.",
  },
  {
    number: "06",
    title: "Corporate Dance Workshops",
    image: service6Img,
    description:
      "Get connected to potential clients who are looking for Corporate Dance Workshop/Events.",
  },
];

const OurServices = () => {
  const isDarkMode = useSelector(selectDarkModeStatus);

  return (
    <Container maxWidth="lg" sx={{ color: isDarkMode ? "white" : "black" }}>
      <Typography sx={{ fontSize: "50px" }}>Our Services</Typography>
      <Grid
        container
        columnSpacing={{ xs: 0, md: 3 }}
        rowSpacing={10}
        sx={{ pt: 7 }}
      >
        {ourServices.map((item, index) => (
          <Grid
            item
            key={index}
            xs={12}
            md={4}
            sx={{
              position: "relative",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.03)",
                "& .hover-number": {
                  color: "#67569E",
                },
              },
            }}
          >
            <Typography
              className="hover-number"
              sx={{
                fontFamily: `"Lato", sans-serif`,
                fontSize: "60px",
                fontWeight: 800,
                position: "absolute",
                top: 25,
                zIndex: 1,
                transition: "color 0.3s ease",
                color: "#EFEFEF",
              }}
            >
              {item.number}
            </Typography>
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                bgcolor: isDarkMode ? "#202020" : "white",
              }}
            >
              <Typography sx={{ fontSize: "20px" }}>{item.title}</Typography>
              <Box sx={{ mt: 1, width: "100%", height: "230px" }}>
                <img
                  src={item.image}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Typography sx={{ mt: 1, fontSize: "13px" }}>
                {item.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OurServices;
