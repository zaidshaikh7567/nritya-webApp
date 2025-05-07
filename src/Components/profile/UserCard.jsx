import { useSelector } from "react-redux";
import { Grid, Box, Typography, Avatar } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import { selectDarkModeStatus } from "../../redux/selectors/darkModeSelector";

const UserCard = ({ formData }) => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const currentUserEmail = JSON.parse(localStorage.getItem("userInfo"))?.email;
  const currentName = JSON.parse(localStorage.getItem("userInfo"))?.displayName;

  return (
    <Box
      sx={{
        boxShadow: isDarkModeOn
          ? "0px 0px 9.68px 2.32px #00000040"
          : "0px 0px 5.84px 1.4px #00000040",
        px: 10,
        py: 3,
        my: 3,
        bgcolor: isDarkModeOn ? "#3C3C3C" : "unset",
        borderRadius: "15px",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent={{ xs: "center", md: "flex-start" }}
            textAlign={{ xs: "center", md: "left" }}
            rowGap={2}
            columnGap={5}
          >
            <Avatar sx={{ width: 80, height: 80 }} />

            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "22px",
                  color: isDarkModeOn ? "white" : "black",
                  fontWeight: 500,
                }}
              >
                {currentName}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "12px",
                  color: isDarkModeOn ? "white" : "black",
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                <LocationOnOutlinedIcon fontSize="small" />{" "}
                {formData?.city || ""}, {formData?.state_province || ""}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "12px",
                  color: isDarkModeOn ? "white" : "black",
                }}
              >
                Joined on: 2023-01-01
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box textAlign={{ xs: "center", md: "left" }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                mb: 1,
                fontSize: "18px",
                color: isDarkModeOn ? "white" : "black",
              }}
            >
              Contact Details
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "12px",
                color: isDarkModeOn ? "white" : "black",
                mb: 0.5,
              }}
            >
              {formData?.phone_number || ""}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "12px",
                color: isDarkModeOn ? "white" : "black",
              }}
            >
              {currentUserEmail}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box textAlign={{ xs: "center", md: "left" }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                mb: 1,
                fontSize: "18px",
                color: isDarkModeOn ? "white" : "black",
              }}
            >
              Other Details
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "12px",
                color: isDarkModeOn ? "white" : "black",
                mb: 0.5,
              }}
            >
              Aadhar: {formData?.aadhar || ""}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "12px",
                color: isDarkModeOn ? "white" : "black",
              }}
            >
              GST: {formData?.gstin || ""}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserCard;
