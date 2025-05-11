import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import UploadProfileModal from "./UploadProfileModal";
import { selectDarkModeStatus } from "../../redux/selectors/darkModeSelector";

const UserCard = ({ formData }) => {
  const theme = useTheme();
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [openUploadProfileModal, setOpenUploadProfileModal] = useState(false);

  const currentUserEmail = JSON.parse(localStorage.getItem("userInfo"))?.email;
  const currentName = JSON.parse(localStorage.getItem("userInfo"))?.displayName;

  const dividerStyle = {
    mx: 2,
    height: "auto",
    borderRightWidth: 2,
    borderColor: isDarkModeOn
      ? "rgba(255, 255, 255, 0.5)"
      : "rgba(0, 0, 0, 0.3)",
    alignSelf: "stretch",
  };

  return (
    <Box
      sx={{
        boxShadow: isDarkModeOn
          ? "0px 0px 9.68px 2.32px #00000040"
          : "0px 0px 5.84px 1.4px #00000040",
        px: { xs: 2, md: 4, lg: 10 },
        py: 3,
        my: 3,
        bgcolor: isDarkModeOn ? "#3C3C3C" : "unset",
        borderRadius: "15px",
      }}
    >
      {isLargeScreen ? (
        <Box sx={{ display: "flex", gap: 0 }}>
          <Box sx={{ flex: 1, pr: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box
                onClick={() => setOpenUploadProfileModal(true)}
                sx={{ position: "relative", cursor: "pointer" }}
              >
                <Avatar sx={{ width: 80, height: 80 }} />
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: theme.palette.background.paper,
                    width: 24,
                    height: 24,
                    "&:hover": {
                      backgroundColor: isDarkModeOn ? "black" : "white",
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
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
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LocationOnOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
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
          </Box>

          <Divider orientation="vertical" sx={dividerStyle} />

          <Box sx={{ flex: 1, px: 2 }}>
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
              sx={{ fontSize: "12px", color: isDarkModeOn ? "white" : "black" }}
            >
              {currentUserEmail}
            </Typography>
          </Box>

          <Divider orientation="vertical" sx={dividerStyle} />

          <Box sx={{ flex: 1, pl: 2 }}>
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
              sx={{ fontSize: "12px", color: isDarkModeOn ? "white" : "black" }}
            >
              GST: {formData?.gstin || ""}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: isSmallScreen ? "center" : "flex-start",
          }}
        >
          <Box
            sx={{
              flex: 1,
              pr: isSmallScreen ? 0 : 2,
              width: isSmallScreen ? "100%" : "auto",
              textAlign: isSmallScreen ? "center" : "left",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexDirection: isSmallScreen ? "column" : "row",
                justifyContent: "center",
              }}
            >
              <Box
                onClick={() => setOpenUploadProfileModal(true)}
                sx={{ position: "relative" }}
              >
                <Avatar sx={{ width: 80, height: 80 }} />
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: theme.palette.background.paper,
                    width: 24,
                    height: 24,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isSmallScreen ? "center" : "flex-start",
                  }}
                >
                  <LocationOnOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
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
          </Box>

          {!isSmallScreen && (
            <Divider orientation="vertical" sx={dividerStyle} />
          )}

          <Box
            sx={{
              flex: 1,
              pl: isSmallScreen ? 0 : 2,
              width: isSmallScreen ? "100%" : "auto",
              textAlign: isSmallScreen ? "center" : "left",
            }}
          >
            <Box sx={{ mb: 3 }}>
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

            <Box>
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
          </Box>
        </Box>
      )}
      <UploadProfileModal
        open={openUploadProfileModal}
        onClose={() => setOpenUploadProfileModal(false)}
      />
    </Box>
  );
};

export default UserCard;
