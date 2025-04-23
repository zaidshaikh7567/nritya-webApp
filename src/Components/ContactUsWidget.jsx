import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Slide,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RoomIcon from "@mui/icons-material/Room";
import { FaUser, FaPhone, FaEnvelope, FaBuilding } from "react-icons/fa";
import indianCities from "../cities.json";
import indianStates from "../states.json";
import { GOOGLE_FORM_ACTION_URL, mapToGoogleEntry } from "../utils/googleForms";

const cities = indianCities.cities;
const states = indianStates.states;

const ContactUsWidget = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    studio: "",
    email: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState({});

  const toggleForm = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCityChange = (event) => {
    setFormData({ ...formData, city: event.target.value });
  };

  const handleStateChange = (event) => {
    setFormData({ ...formData, state: event.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await handleSubmit(e);
    if (result !== false) {
      handleClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <Box
          onClick={handleClose}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1100,
          }}
        />
      )}

      {/* Floating Chatbot Button */}
      <Button
        color="primary"
        onClick={toggleForm}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
          columnGap: 1,
          py: "10px",
          px: "26px",
          bgcolor: "#67569E",
          color: "white",
          display: "flex",
          textTransform: "capitalize",
          "&:hover": { bgcolor: "#574088" },
        }}
      >
        <span>Request Demo</span>
        <SendIcon />
      </Button>

      {/* Slide-in Contact Form */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: { xs: "90%", sm: "360px" },
            zIndex: 1200,
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            boxShadow: "0px 0px 11.6px 3px #00000040",
          }}
        >
          <Typography sx={{ fontSize: "20px", textAlign: "center", mb: 2 }}>
            Fill this form and book a demo
          </Typography>

          <Box component="form" onSubmit={onSubmit}>
            <Grid container spacing={2}>
              {/* Name */}
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

              {/* Mobile */}
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

              {/* Studio */}
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

              {/* Email */}
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

              {/* City */}
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

              {/* State */}
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              sx={{
                mt: 4,
                py: "10px",
                px: "22px",
                bgcolor: "#67569E",
                color: "white",
                textTransform: "unset",
                fontSize: "16px",
                width: "100%",
                "&:hover": { bgcolor: "#67569E" },
              }}
            >
              Request a Demo
            </Button>
          </Box>
        </Box>
      </Slide>
    </>
  );
};

export default ContactUsWidget;
