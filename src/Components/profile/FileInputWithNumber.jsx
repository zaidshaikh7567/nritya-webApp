import { FormControl, Box, Button, Typography, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { Upload } from "@mui/icons-material";

import { selectDarkModeStatus } from "../../redux/selectors/darkModeSelector";

const FORM_FIELD_HEIGHT = 56;

const FileInputWithNumber = ({
  label,
  value,
  numberFieldName,
  fileFieldName,
  onChange,
  onFileChange,
  fileName,
  inputType = "text",
  errors,
}) => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  return (
    <Box>
      <Typography
        variant="body1"
        sx={{
          fontSize: "16px",
          color: isDarkModeOn ? "white" : "black",
        }}
        gutterBottom
      >
        {label}
      </Typography>
      <FormControl fullWidth variant="outlined">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            type={inputType}
            value={value}
            name={numberFieldName}
            onChange={onChange}
            sx={{ flexGrow: 1, height: FORM_FIELD_HEIGHT }}
            variant="outlined"
            InputLabelProps={{ shrink: false }}
            placeholder={`Enter ${label.toLowerCase()}`}
            error={!!errors[numberFieldName] || !!errors[fileFieldName]}
            helperText={errors[numberFieldName] || errors[fileFieldName]}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{
              borderRadius: "0 4px 4px 0",
              height: FORM_FIELD_HEIGHT,
              minWidth: "56px",
              borderLeft: 0,
              color: isDarkModeOn ? "white" : "black",
              borderColor: isDarkModeOn ? "#ffffff3b" : "#0000003b",
              "&:hover": {
                borderLeft: 0,
                borderColor: isDarkModeOn ? "#ffffff3b" : "#0000003b",
              },
            }}
          >
            <Upload sx={{ fontSize: 20 }} />
            <input
              name={fileFieldName}
              type="file"
              hidden
              onChange={onFileChange}
            />
          </Button>
        </Box>
        {fileName && (
          <Box sx={{ fontSize: 12, marginTop: 1, color: "gray" }}>
            Selected file: {fileName}
          </Box>
        )}
      </FormControl>
    </Box>
  );
};

export default FileInputWithNumber;
