import React, { useRef, useState } from "react";
import {
  Dialog,
  IconButton,
  Avatar,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import { selectDarkModeStatus } from "../../redux/selectors/darkModeSelector";

const UploadProfileModal = ({ open, onClose }) => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const uploadProfileInputRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleDelete = () => {
    setPhoto(null);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ width: 320 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">Upload Profile Photo</Typography>

          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            my: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar src={photo || ""} sx={{ width: 120, height: 120 }} />
        </Box>

        <Divider
          sx={{
            borderTopWidth: 2,
            borderColor: isDarkModeOn
              ? "rgba(255, 255, 255, 0.5)"
              : "rgba(0, 0, 0, 0.3)",
            alignSelf: "stretch",
          }}
        />

        <Box
          sx={{
            py: 0.5,
            px: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            onClick={() => uploadProfileInputRef.current.click()}
            sx={{
              display: "flex",
              cursor: "pointer",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <PhotoCameraIcon fontSize="medium" />
            <Typography
              sx={{
                fontSize: "10px",
                fontWeight: 500,
                textTransform: "capitalize",
              }}
            >
              Choose Photo
            </Typography>
            <input
              hidden
              ref={uploadProfileInputRef}
              accept="image/*"
              type="file"
              onChange={handlePhotoChange}
            />
          </Box>

          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UploadProfileModal;
