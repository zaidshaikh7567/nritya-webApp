import { useState, forwardRef, useLayoutEffect, useRef } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import RoomIcon from "@mui/icons-material/Room";
import { FaUser, FaPhone, FaEnvelope, FaBuilding } from "react-icons/fa";
import {
  GOOGLE_FORM_ACTION_URL,
  mapToGoogleEntry,
} from "../../utils/googleForms";
import { selectDarkModeStatus } from "../../redux/selectors/darkModeSelector";
import indianCities from "../../cities.json";
import indianStates from "../../states.json";
import getInTouch from "../../assets/images/get-in-touch.png";

const GetInTouch = forwardRef((_, getInTouchSectionRef) => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const isDarkMode = useSelector(selectDarkModeStatus);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    studio: "",
    email: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState({});

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const cities = indianCities.cities;
  const states = indianStates.states;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return false;

    const form = new FormData();
    for (let key in formData) {
      form.append(mapToGoogleEntry[key], formData[key]);
    }

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        mode: "no-cors",
        body: form,
      });
      alert("Demo requested successfully.");
    } catch (err) {
      console.error("Form submission error", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCityChange = (event) => {
    setFormData({ ...formData, city: event.target.value });
  };

  const handleStateChange = (event) => {
    setFormData({ ...formData, state: event.target.value });
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

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === leftRef.current) setShowLeft(true);
            if (entry.target === rightRef.current) setShowRight(true);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    if (leftRef.current) observer.observe(leftRef.current);
    if (rightRef.current) observer.observe(rightRef.current);

    return () => observer.disconnect();
  }, []);

  return (
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
        <Box
          ref={leftRef}
          sx={{
            flex: 1,
            height: "400px",
            position: "relative",
            opacity: showLeft ? 1 : 0,
            transform: showLeft ? "translateX(0)" : "translateX(-100px)",
            transition: "all 0.8s ease-out",
          }}
        >
          <img
            src={getInTouch}
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
            <Typography sx={{ fontSize: "18px" }}>+91-9310402342</Typography>
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
            +91-9310402342
          </Typography>
          <Typography
            component="span"
            sx={{ fontSize: "18px", display: "inline-block" }}
          >
            nritya@nritya.co.in
          </Typography>
        </Box>

        <Box
          ref={getInTouchSectionRef}
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
            ref={rightRef}
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
              opacity: showRight ? 1 : 0,
              transform: showRight ? "translateX(0)" : "translateX(50px)",
              transition: "all 0.8s ease-out 0.3s",
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
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  variant="standard"
                  sx={{ minWidth: 120 }}
                  error={!!errors.city}
                >
                  <InputLabel
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <RoomIcon fontSize="small" />
                    City
                  </InputLabel>
                  <Select value={formData.city} onChange={handleCityChange}>
                    {cities.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.city}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  variant="standard"
                  sx={{ minWidth: 120 }}
                  error={!!errors.state}
                >
                  <InputLabel
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <RoomIcon fontSize="small" />
                    State
                  </InputLabel>
                  <Select value={formData.state} onChange={handleStateChange}>
                    {states.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.state}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              sx={{
                mt: 5,
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
  );
});

// Set display name for the component
GetInTouch.displayName = 'GetInTouch';

export default GetInTouch;
