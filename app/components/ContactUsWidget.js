'use client';

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

// Import cities and states data
const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", 
  "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", 
  "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", 
  "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", 
  "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi", 
  "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Allahabad", "Ranchi", 
  "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", 
  "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", 
  "Hubballi-Dharwad", "Bareilly", "Moradabad", "Mysore", "Gurgaon", 
  "Aligarh", "Jalandhar", "Tiruchirappalli", "Bhubaneswar", "Salem", 
  "Mira-Bhayandar", "Warangal", "Thiruvananthapuram", "Guntur", "Bhiwandi", 
  "Saharanpur", "Gorakhpur", "Bikaner", "Amravati", "Noida", "Jamshedpur", 
  "Bhilai", "Cuttack", "Firozabad", "Kochi", "Nellore", "Bhavnagar", 
  "Dehradun", "Durgapur", "Asansol", "Rourkela", "Nanded", "Kolhapur", 
  "Ajmer", "Akola", "Gulbarga", "Jamnagar", "Ujjain", "Loni", "Siliguri", 
  "Jhansi", "Ulhasnagar", "Jammu", "Sangli-Miraj & Kupwad", "Mangalore", 
  "Erode", "Belgaum", "Ambattur", "Tirunelveli", "Malegaon", "Gaya", 
  "Jalgaon", "Udaipur", "Maheshtala", "Tirupur", "Davanagere", "Kozhikode", 
  "Akola", "Kurnool", "Rajpur Sonarpur", "Bokaro", "South Dumdum", 
  "Bellary", "Patiala", "Gopalpur", "Agartala", "Bhagalpur", "Muzaffarnagar", 
  "Bhatpara", "Panihati", "Latur", "Dhule", "Rohtak", "Korba", "Bhilwara", 
  "Brahmapur", "Muzaffarpur", "Ahmednagar", "Mathura", "Kollam", "Avadi", 
  "Kadapa", "Kamarhati", "Sambalpur", "Bilaspur", "Shahjahanpur", "Satara", 
  "Bijapur", "Rampur", "Shivamogga", "Chandrapur", "Junagadh", "Thrissur", 
  "Alwar", "Bardhaman", "Kulti", "Kakinada", "Nizamabad", "Parbhani", 
  "Tumkur", "Hisar", "Ozhukarai", "Bihar Sharif", "Panipat", "Darbhanga", 
  "Bally", "Aizawl", "Dewas", "Ichalkaranji", "Tirupati", "Karnal", 
  "Bathinda", "Rampur", "Shivpuri", "Surendranagar", "Unnao", "Yamunanagar", 
  "Panchkula", "Vapi", "Karnal", "Bathinda", "Rampur", "Shivpuri", 
  "Surendranagar", "Unnao", "Yamunanagar", "Panchkula", "Vapi"
];

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", 
  "Ladakh", "Lakshadweep", "Puducherry"
];

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

    // For now, just show success message
    // You can integrate with your backend API here
    alert("Demo requested successfully.");
    handleClose();
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