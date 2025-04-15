import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  createTheme,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import indianCities from "../cities.json";
import indianStates from "../states.json";
import SendIcon from "@mui/icons-material/Send";
import { BsCheck2 } from "react-icons/bs";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaBuilding,
} from "react-icons/fa";

const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/your-form-id/formResponse";

const ourServices = [
  {
    number: "01",
    title: "Studio Listing",
    image:
      "https://s3-alpha-sig.figma.com/img/4c3c/81b8/33a37c554a3eb6d35404268fb9e54925?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=OaboRiUxZ4OA5ZNXyLjXtnN-YQRZwIz8EPzBOcUSwpX7hjLgJXGIv~JMuXIXozX75b2SKxUhdBdgnlgE6argWxId4Hl6PmQly5499ObxiuJRJEqQ7c~hribzTJh6Ychg-HY4gshDPHvesF16l5LgsdVD3na6Mdm9HnJXqTlh0Q4GZPopKRNMrYk0CoHV1CHXm44oRQRvOEa-t~xRtTdYTFALhnY1-uTILZ5zaaxTHaA-oQ8rRY9C6ddVwEpDddxNLvzCnZ5f4u35WeMQg3KQQvviwm009s1l6Hk3P1CSNrpLW-UkglLiAS3gDpEFEXFyAlZHOaNEeDCrvU2grIoCMw__",
    description:
      "Feature your studio and classes to dance enthusiasts in your area.",
  },
  {
    number: "02",
    title: "Workshop Listing",
    image:
      "https://s3-alpha-sig.figma.com/img/fd1a/0d5a/676d666e1aa09d3f5bcdb159f0d62e34?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IKRmBXVUy8urE~QVkqspxzNgQf-nEhbEMoMQpniLx6bOkPcCAWftZ~3247lkiqMx2R8fwCEXCbFpAXMzx9SPmiy5ytUKYfCNLGiI8ifi4-2peUenKppiejytp48OAlfonULt0sTvIb~67aXGjVX7zAtEHaOi0MVh2Do~yYhUCQPnz7Hiq9DxSHRUgoqJdDYh2pNoJDWvF3-YMLi3ZHnIxR3MCoQkvab-uf-AENH0dR7i~PhC-s~yRYAZ5GUhSaE-iP6mGBA8gH7b9lZQhNoO0S32cxTbwgELkxIy0ZKJLKE5N-fOP9bLKwLNQHN4EPQMw9fwA~nzR0~6njwm3nZ~NQ__",
    description:
      "Promote your specialized workshops and attract targeted students.",
  },
  {
    number: "03",
    title: "Open Class Listing",
    image:
      "https://s3-alpha-sig.figma.com/img/9872/0a20/fed78cca043e70cb276fbff88606059e?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=bBcewG0~IK3i1E-PVqYsn6NSo9Rb6zuQg18Tcxf-J-~QZT3Ln-jUDNoFBflmJRrLyJ97jRhTrez0JBfpOBAM05T30LlwSeB5hBUBqO3ykChxQCq3Nw62P0eanfh9SvBXVAyZVeZBiJAcU9-IRKRxF2KMQUwAopTQJvlLhLBcb4HYpbMTEXAgXnEBVBamFVQ4LWMpHg5rPkV0xO9NPRbdYnKHacK~qpZ~tfse5gCkl2ZBWVBoDb8L07aEy3XUCEhFNHuhAmvEUxjk~YAmWOWvhV0KcIHyDQrQ9iZiY473aQ3gBVR5s9cfzVpetA0Y6Es3VE~57-815zGHDoUga0Y~jg__",
    description:
      "Fill your open classes faster by showcasing them to motivated learners.",
  },
  {
    number: "04",
    title: "Seamless Booking & Payment",
    image:
      "https://s3-alpha-sig.figma.com/img/cd97/af30/d28c6e2121e6966a1916e51071cb5c08?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=nn7ELKG3xjubHcqkIR2439RrDWkcT87l-hU1cf9JjGD6jjE~H5vDEzPwehgWH4K7Ubkr1nZDHqbu~cMUU45w2rGFgiItFjHUuBJL71M8mV6~btrb4Vv0z7KyUDR46XATThiqgy7-Y92ivulOxbxBCcGcHBrgx~HEZcD17Xwjp49iOk4JvoT~WhvciC8LhtGpQNCR6aKgWglfKKgaTRHYhgDUP9j8jgguNyc1PgbFcrI0P4NC~YLQVbjVRFu-5VsaUN-MXE0MWLFb-PxLx2Noywvf~97HBliV6ocaUH0aXud5Q0N-Zr6RMNYKq0rYFBLUP~rEYawAPYwT3HFKBDvH1w__",
    description:
      "Hassle-free booking and secure transactions through our integrated payment gateway.",
  },
  {
    number: "05",
    title: "Wedding Choreography",
    image:
      "https://s3-alpha-sig.figma.com/img/ff88/4c8e/f45bd0cfd1f1d50751f69932a1bfb2fc?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=G~kbiL~IghMe~XDg1Ru-lkf7iFlZEMAtdBz6FmAzQZ03N7ZN46rHOBb8nG8QsNYWSsxl4DlG4XdzzV5Xnk8zCeCPdAa-LeF1VBxZYwbRwjY~0ThBaXLUqoG06WQg08F2XxUuz6qNx0Avnrhn8Ey8AnRcHFoPr1LgN09-QbA2ghiP7YA7fhy2o277J9IlRa-OwVREI~JMQVFWwa636kzH09iwAOmyjuv3L6kRDAkz1L1On5Jxg7Dtz~XniLA9qDKKSJoLOswVCdO9nrNl-JOjsGKVY8kTmV2fx4xx-hjAwfjNTQM0qOkgzbbRJuTOXqtUmTwp9qLPwLUoWtRt-UoKjQ__",
    description:
      "Get connected to potential clients who are looking for wedding choreography.",
  },
  {
    number: "06",
    title: "Corporate Dance Workshops",
    image:
      "https://s3-alpha-sig.figma.com/img/c7eb/584e/314be78c900909f2f2b8af9383028e86?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IZBFlhdvA3EnAp9iLO7esMCoWFU3sLO1Ea8tGIeNE2SVABOTIoP3CJv28UdxHEhT-oWqcl-Qec8x3Aiw9YOAR2UmhoGRDQwyYQzQn6sJbDeZm5P~JZa0ho~WhTp2cH-LTy45O8NoyiA78CcdjpTAx6g-yDNcBYOKCTJVjrArzMDW6w4Amdk~g3iYdU23imW2c4ziz35Q1YPjLpbqGDqgrCMYRvWqqi8OeNDV-n-swDr4bMu5x3MLRkFFzecgFiVg2lV~wgw9MBC-KbrW50z8CIK4iVVSg-2zUAN4~qBmYuhtnBVvwx5Ginyk0NoDd~tsZ704VpmilsUd-lYMfijE0g__",
    description:
      "Get connected to potential clients who are looking for Corporate Dance Workshop/Events.",
  },
];

const getDesignTokens = (mode) => ({
  typography: {
    fontFamily: ["Wittgenstein", "Roboto", "sans-serif"].join(","),
  },
});

const useCurrentBreakpoint = () => {
  const theme = useTheme();

  const breakpoints = theme.breakpoints;

  const isXs = useMediaQuery(breakpoints.only("xs"));
  const isSm = useMediaQuery(breakpoints.only("sm"));
  const isMd = useMediaQuery(breakpoints.only("md"));
  const isLg = useMediaQuery(breakpoints.only("lg"));
  const isXl = useMediaQuery(breakpoints.only("xl"));

  if (isXs) return "xs";
  if (isSm) return "sm";
  if (isMd) return "md";
  if (isLg) return "lg";
  if (isXl) return "xl";

  return "xs";
};

const NrityaLandingPage = () => {
  const breakpoint = useCurrentBreakpoint();
  const isDarkMode = useSelector(selectDarkModeStatus);

  const cities = indianCities.cities;
  const states = indianStates.states;

  const theme = useMemo(
    () => createTheme(getDesignTokens(isDarkMode ? "dark" : "light")),
    [isDarkMode]
  );

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    studio: "",
    email: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required.";
    tempErrors.mobile = /^\d{10}$/.test(formData.mobile)
      ? ""
      : "Enter a valid 10-digit number.";
    tempErrors.studio = formData.studio ? "" : "Studio Name is required.";
    tempErrors.email = /.+@.+\..+/.test(formData.email)
      ? ""
      : "Email is not valid.";
    tempErrors.city = formData.city ? "" : "City is required.";
    tempErrors.state = formData.state ? "" : "State is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = GOOGLE_FORM_ACTION_URL;
    form.target = "_blank";

    const mapToGoogleEntry = {
      name: "entry.1234567890",
      mobile: "entry.2345678901",
      studio: "entry.3456789012",
      email: "entry.4567890123",
      city: "entry.5678901234",
      state: "entry.6789012345",
    };

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = mapToGoogleEntry[key];
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Banner section START */}
      <Box
        sx={{
          pt: 8,
          pb: 20,
          textAlign: "center",
          color: isDarkMode ? "white" : "black",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url("https://s3-alpha-sig.figma.com/img/93e6/6733/231a2a25f81bf62ac46abc962ee13ad6?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=p7BXIM9T8~xiQUXNnw-qAyn4m2oDUliPvAJjCyGTohHlmIL3zz3mLM70YYiUm09xWAYDzAIcVxVqo34p8bwGamDV2ax2hcyDrxMTumPglZiMsYMKgVt5D0h1mXXelJmovPuqnWmI5cczBIHW8YhaSMmrq~LOLoUr8LfUMIw8zmCFC-rgrldLuWUYR7Vn6vXoQ7N1rdOyEdL6NXwkLas6NHNgaDYx5Lw3NzBdNu~RRxB3ItWD90JYd14WqrifC9BIBx5kAuVtjc96qOuZ0VzJoZAVIQTqXua~Mf4Y77d0T1y~E9OUnGCd1hKVkLSnAmZHrNGG-5OQkgfUd92jiJBWUQ__")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "300px 125%",
            opacity: "30%",
            zIndex: 0,
          }}
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography sx={{ fontSize: "16px", textTransform: "uppercase" }}>
            Welcome to
          </Typography>
          <Typography
            sx={{
              mt: 3,
              fontSize: "80px",
              fontWeight: 300,
              textTransform: "capitalize",
            }}
          >
            Nritya
          </Typography>
          <Typography sx={{ mx: "auto", maxWidth: "300px", fontSize: "16px" }}>
            Unlock your studio's full potential with Nritya - where dance dreams
            meet their perfect studio.
          </Typography>
          <Button
            sx={{
              mt: 2,
              py: "10px",
              px: "26px",
              bgcolor: "#67569E",
              color: "white",
              textTransform: "unset",
              fontSize: "16px",
              "&:hover": { bgcolor: "#67569E" },
            }}
          >
            Request a Demo
          </Button>
        </Box>
      </Box>
      {/* Banner section END */}

      {/* Exclusive launch offers section START */}
      <Container maxWidth="lg">
        <Box
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
              width: ["xs", "sm"].includes(breakpoint) ? "300px" : "400px",
              height: ["xs", "sm"].includes(breakpoint) ? "300px" : "400px",
              position: "relative",
            }}
          >
            <img
              src="https://s3-alpha-sig.figma.com/img/621d/1bec/1d09b18164d210f3a132be42569b75d7?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=fX26yXDn5v3yXE5IoygLqhGzmzp0VaHWtBl9QEdWsRMvyoihMmQwitATB50Wecwmd1gS0nhY0AMm5AeprT6IlddkWiLgPmidJU3WCe4DCQSkiQ1McNwx6i6sjgcCAA2brHP8HM-SFFblNSeqXIrhLFTnM7DNNHBa9wUZg1jjgbRQtxfeClitrigL6che72Wl82d6NdMJ95BiL8xhGv96574IURHYcysHdrKwXeTNtqXDlBZXE-Tko0ix0FKEAuATrBF2yVG0jRbQXY~Efpz~DUpbrprQmV3VOJpJon-rnqxYf8VY4ovn4rTRSV9OeG-3O~YDE9hhVVkbDAKhGDfE1g__"
              alt=""
              style={{
                position: "absolute",
                width: ["xs", "sm"].includes(breakpoint) ? "250px" : "300px",
                height: ["xs", "sm"].includes(breakpoint) ? "275px" : "350px",
                top: 0,
                left: 0,
                objectFit: "fill",
              }}
            />

            <img
              src="https://s3-alpha-sig.figma.com/img/59ae/69bb/01bef697cb18958711ca7a24643f644d?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=RL0jzC0fupHKAEVUART5c-k9zwbPz1PSmf21qZg6iReUddL~qxLA-OaRVNt3KjXukc~9MV15VUGEfI9taEaBdur2txK~4fTEQkPqxn7LvrEMkRhNV3U3EuxxhSktHscbkzG8Cwoe16HPKM6j31wAj6Pi8xtKaOCJd7kR8SIDDH3rLJYly1XmXohDdzgqZawZyms9FGdQKeFBWTNBLoeckq95xtW6QsfnvdTSP1AjQUxELirGvtqXe22Dw-TBlN4XAbHJrc9HAzxQb-JIcv7sa5rjlHOdoe2xb8AjAWN6Q1R-bBgGAcPJwWUxZcZxIZ9oBrAG85dXTK48ZKBdgyBytg__"
              alt=""
              style={{
                position: "absolute",
                width: ["xs", "sm"].includes(breakpoint) ? "200px" : "250px",
                height: ["xs", "sm"].includes(breakpoint) ? "200px" : "250px",
                bottom: 0,
                right: 0,
                objectFit: "fill",
              }}
            />
          </Box>

          <Box sx={{ flex: 1, color: isDarkMode ? "white" : "black" }}>
            <Typography sx={{ fontSize: "40px" }}>
              Exclusive Pre Launch Offers
            </Typography>

            <Typography sx={{ fontSize: "13px" }}>
              To help you experience the Nritya advantage, we've crafted an
              unbeatable offer
            </Typography>

            <Box sx={{ mt: 6, display: "flex", gap: 5 }}>
              <Box sx={{}}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 700,
                    lineHeight: "25px",
                  }}
                >
                  3 Month Free Trial
                </Typography>
                <Typography
                  sx={{ mt: 1, fontSize: "13px", lineHeight: "20px" }}
                >
                  Enjoy all the features of Nritya without any platform fees for
                  the first 3 months.
                </Typography>
              </Box>

              <Box sx={{}}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 700,
                    lineHeight: "25px",
                  }}
                >
                  Minimal Commission Deduction
                </Typography>
                <Typography
                  sx={{ mt: 1, fontSize: "13px", lineHeight: "20px" }}
                >
                  Only a minimal commission on each booking, keeping your
                  revenue intact
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      {/* Exclusive launch offers section END */}

      {/* Community Section START */}
      <Container
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
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            color: isDarkMode ? "white" : "black",
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
                      fontSize: "3px",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, width: "100%", height: "300px" }}>
          <img
            src="https://s3-alpha-sig.figma.com/img/542f/a2aa/ad8515ae81d3322d5e177815f87f5a46?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Mg80q5byaE0MlQXZMmqGL9suVcRZ6xXpU~V7h23rV6Byf9gOjCv5z4W3dnSNokYtSZIdVOAGJ3WQ7jJ-bO1tstGuP-u8PVy4i3LGxEoo-rHMsZwCpZdd02EsVN4stiONMwzgLouU0ZTajD8BH5~XZBiS2Vd4rM1BMxt9Dy3iERjo5RME9T7~RVM8TQ-5fucSNbgIV5r5cXKHyHeoXWJLn0ZJOVWK0z-hgu3ndlt3BwKCuTGBLEZoAhexralNU~yb3MUGtwMVsg8Y81dd5mGD06JJh5XcENEIxKDIN~66mDSnxaC~KGuyqLelUgbqP-KRawDw865XTA4Zd3PQXEGB6Q__"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
            }}
          />
        </Box>
      </Container>
      {/* Community Section END */}

      {/* Our services section START */}
      <Container maxWidth="lg" sx={{ color: isDarkMode ? "white" : "black" }}>
        <Typography sx={{ fontSize: "50px" }}>Our Services</Typography>
        <Grid
          container
          columnSpacing={{ xs: 0, md: 3 }}
          rowSpacing={10}
          sx={{ pt: 7 }}
        >
          {ourServices.map((item, index) => (
            <Grid item key={index} xs={12} md={4} sx={{ position: "relative" }}>
              <Typography
                sx={{
                  fontFamily: `"Lato", sans-serif`,
                  fontSize: "60px",
                  fontWeight: 800,
                  position: "absolute",
                  top: 25,
                  zIndex: 1,
                  color: index === 0 ? "#67569E" : "#EFEFEF",
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
                <Box sx={{ mt: 1, width: "100%", height: "300px" }}>
                  <img
                    src={item.image}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "fill" }}
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
      {/* Our services section end */}

      {/* Get in touch section START */}
      <Container
        maxWidth="lg"
        sx={{ mt: 10, mb: 20, color: isDarkMode ? "white" : "black" }}
      >
        <Typography sx={{ fontSize: "50px" }}>
          Want to get in <span style={{ color: "#67569E" }}>Touch</span>
        </Typography>

        <Box
          sx={{
            display: "flex",
            rowGap: 5,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ flex: 1, height: "400px", position: "relative" }}>
            <img
              src="https://s3-alpha-sig.figma.com/img/76ec/ae4b/d77e591bf545ab0caf57c847f01097d1?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Ul-6SEuoXwhPVbVkjNx-aUePlr93Tp4~BTWwItbfcHae~mzedoj3tly96YU6WFiNHvxBUfsMmokG9RzK7CoO6JQrtCgsqFUz~8hfEMpkEZaP-MwoNj1AVntZorJeE33kXxuJdO1sskGmHdgx1hcQx13RK1dHBVYcUUdcxmOpGzck-B8XGTh-cO0Et-byjP9RCi2wp6jlqHUYB6HA0oR6AxLGc2uLYwV99Xm7LgDY6Kktvlgm9hR91XGKXpXIIBMnu-qy2XwkjOLeo8rQr9w8F8acjge3DdaBTc5eK~o5lTUVgZS46ou-l5KWOv-uKzwtIkIQQI9U0cPbVWuTkLwRlg__"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "fill" }}
            />
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 5,
                position: "absolute",
                bottom: -50,
                left: 0,
              }}
            >
              <Typography sx={{ fontSize: "18px" }}>Contact us</Typography>
              <Typography sx={{ fontSize: "18px" }}>+91-xxxxxxxxx</Typography>
              <Typography sx={{ fontSize: "18px" }}>
                nritya@nritya.co.in
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: "block", md: "none" },
              "& > *:not(:last-child)": { mr: 3 },
            }}
          >
            <Typography
              component="span"
              sx={{ fontSize: "18px", display: "inline-block" }}
            >
              Contact us
            </Typography>
            <Typography
              component="span"
              sx={{ fontSize: "18px", display: "inline-block" }}
            >
              +91-xxxxxxxxx
            </Typography>
            <Typography
              component="span"
              sx={{ fontSize: "18px", display: "inline-block" }}
            >
              nritya@nritya.co.in
            </Typography>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
              maxWidth: "360px",
              width: "100%",
              position: { xs: "unset", md: "relative" },
              textAlign: "center",
              alignSelf: { xs: "center", md: "unset" },
            }}
          >
            <Typography sx={{ fontSize: "20px" }}>
              Fill this form and book a demo
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                px: 5,
                py: 3,
                position: { xs: "unset", md: "absolute" },
                left: -70,
                top: 70,
                borderRadius: 2,
                bgcolor: "white",
                textAlign: "left",
                boxShadow: "0px 0px 11.6px 3px #00000040",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaUser style={{ marginRight: 8 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Mobile Number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    error={!!errors.mobile}
                    helperText={errors.mobile}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaPhone style={{ marginRight: 8 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Studio Name"
                    name="studio"
                    value={formData.studio}
                    onChange={handleChange}
                    error={!!errors.studio}
                    helperText={errors.studio}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaBuilding style={{ marginRight: 8 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Email Id"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaEnvelope style={{ marginRight: 8 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    variant="standard"
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={!!errors.city}
                    helperText={errors.city}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaMapMarkerAlt style={{ marginRight: 8 }} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {cities
                      .map((item) => ({ value: item, label: item }))
                      .map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    variant="standard"
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    error={!!errors.state}
                    helperText={errors.state}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaMapMarkerAlt style={{ marginRight: 8 }} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {states
                      .map((item) => ({ value: item, label: item }))
                      .map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                  </TextField>
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SendIcon />}
                sx={{
                  mt: 5,
                  py: "10px",
                  px: "22px",
                  bgcolor: "#67569E",
                  color: "white",
                  textTransform: "unset",
                  fontSize: "16px",

                  "&:hover": { bgcolor: "#67569E" },
                }}
              >
                Request a Demo
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
      {/* Get in touch section END */}
    </ThemeProvider>
  );
};

export default NrityaLandingPage;
