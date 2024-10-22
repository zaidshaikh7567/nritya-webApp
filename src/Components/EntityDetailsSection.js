import React, { useEffect } from "react";
import { Grid, Typography as MUITypography, Box, IconButton,Button, Chip, Divider } from "@mui/material";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { useSelector } from "react-redux";
import ShareButton from "./ShareButton";

function EntityDetailsSection({ dataItem, whatsappMessage }) {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const shareUrl = window.location.href;

  useEffect(() => {
    const elements = document.querySelectorAll('.description-box h3, .description-box h1, .description-box h2, .description-box h4, .description-box h5, .description-box h6');
    elements.forEach((element) => {
      element.style.color = isDarkModeOn ? 'white' : 'black';
    });
  }, [isDarkModeOn]);

  return (
    <Grid container>
  {/* Row 1: About with Share Button */}
  <Grid item xs={12}>
    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }}>
      <MUITypography
        variant="h4"
        style={{ color: isDarkModeOn ? 'white' : 'black', textTransform: 'none', borderBottom: '4px solid #735eab', // Change thickness and color here
          display: 'inline-block', // Ensures the underline wraps around the text
       }}
        
      >
        About
      </MUITypography>
      <ShareButton shareUrl={shareUrl} />
    </Box>
  </Grid>

  {/* Row 2: By New Studio | Kuchipudi */}
  <Grid item xs={12}>
    <MUITypography
      variant="subtitle1"
      style={{ color: isDarkModeOn ? 'white' : 'black', textTransform: 'none' }}
      gutterBottom
    >
      {dataItem.danceStyles && dataItem.danceStyles.length > 0 && (
        <>  {dataItem.danceStyles.join(", ")}</>
      )}
    </MUITypography>
  </Grid>

  {/* Row 3: Level */}
  <Grid item xs={12}>
    <Chip
      sx={{
        marginLeft: "10px",
        marginBottom: "10px",
        fontSize: "0.8rem",
        bgcolor: "#735eab",
        color: 'white',
      }}
      label={dataItem.level}
    />
  </Grid>
  <Grid item xs={12}>
  <Divider
          sx={{
            "&.MuiDivider-root": {
              "&::before": {
                border: `thin solid #735eaf`,
              },
              "&::after": {
                border: `thin solid #735eaf`,
              },
            },
          }}
        >
          Description
        </Divider>

</Grid>

 
  {/* Row 4: Description */}
  <Grid item xs={12}>
    <div
      style={{ color: isDarkModeOn ? 'white' : 'black' }}
      className="description-box"
      dangerouslySetInnerHTML={{ __html: dataItem.description || "Workshop Description" }}
    />
  </Grid>
</Grid>

  )
}

export default EntityDetailsSection;
