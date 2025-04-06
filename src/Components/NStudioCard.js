
import React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import Button from '@mui/material/Button';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { CHIP_LEVELS_DESIGN, COLORS, danceStylesColorChips, STUDIO_ICON_DEFAULT } from '../constants';
import IconButton from '@mui/joy/IconButton';
import Favorite from '@mui/icons-material/Favorite';


export default function NStudioCard({img_src,data}) {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    
    const studioId = data.id?data.id:data.studioId;

    const cardStyle = {
      backgroundColor: isDarkModeOn ? '#444' : 'white',
      padding: '0px',
      color: isDarkModeOn ? 'white' : 'black',
      marginRight: "10px",
      width: 320,
      maxWidth: "100%",
      boxShadow: 'lg',
      transition: 'opacity 0.3s ease',
    };
  
    const cardHoverStyle = {
      transform: 'scale(1.01)',
    };
  
  return (
    <Card variant="solid" sx={{
      ...cardStyle,
      '&:hover': cardHoverStyle,
    }}>
      
        <AspectRatio ratio="1.78" style={{ position: 'relative'}}>
          <img
            src={data && data.iconUrl ? data.iconUrl :STUDIO_ICON_DEFAULT}
            loading="lazy"
            alt="Studio Image"
            style={{ maxWidth: '100%', height: 'auto', overflow: 'hidden' }}
            
          />
          <Stack direction="row" spacing={2} style={{ position: 'absolute', bottom: 0, left: 0, padding: '1px' }}>
        {data && data.danceStyles && typeof data.danceStyles === 'string' ? (data.danceStyles.split(",").slice(0, 3).map((form, index) => (
        <Chip
            key={index}
            color={index % 2 === 0 ? "danger" : "success"}  
            sx={{ marginBottom: "10px", fontSize: '0.8rem',  
                    bgcolor: danceStylesColorChips[index].backgroundColor,
                    color: danceStylesColorChips[index].color, 
            }}
        >
            {form.trim()}
        </Chip>
        ))):(
            <Chip
            key={10}
            color={10 % 2 === 0 ? "danger" : "success"} 
            style={{ marginBottom: "10px", fontSize: '0.8rem' }}
        >
            {"No danceforms"}
        </Chip>
        )}

        </Stack>

        <Stack
            direction="row"
            spacing={2}
            style={{ position: "absolute", top: 0, left: 0, padding: "1px", paddingTop: "1px" }}
          >
            {data && data.freeTrialAvailable &&(
            
                <Chip
                  key={1}
                 
                  sx={{
                    marginLeft: "10px",
                    marginBottom: "10px",
                    fontSize: "0.8rem",
                    bgcolor: COLORS.LIME.backgroundColor,  // Set the background color
                    color: COLORS.LIME.color,  // Set the text color
                  }}
                >
                  {'Free Trial Available'}
                </Chip>
              
            )}
          </Stack>

        </AspectRatio>
      <CardContent style={{ padding: '10px' }}>
        <Box display="flex" justifyContent="space-between" columnGap={1}>
          <Link
            alignSelf="center"
            href={`#/studio/${studioId}`}
            fontWeight="bold"
            color="neutral"
            textColor="text.primary"
            underline='none'
            overlay
            whiteSpace='nowrap'
            overflow='hidden'
            textOverflow='ellipsis'
            style={{ color: isDarkModeOn ? 'white' : 'black' }}
          >
            {data && data.studioName ? data.studioName : "    "}
          </Link>
          {data && data.avgRating && data.avgRating>0 ?
            <Typography width={52} flexShrink={0} alignSelf="center" style={{ color: isDarkModeOn ? 'white' : 'black' }}>
              ⭐ {data.avgRating.toFixed(1)}
            </Typography> : null
          }
        </Box>
        <Typography style={{ color: isDarkModeOn ? 'white' : 'black' }} level="body-xs">{data.street ? data.street : ".  "}</Typography>
        <IconButton
          hidden
          aria-label="Like minimal photography"
          size="md"
          variant="solid"
          color="danger"
          sx={{
            position: 'absolute',
            zIndex: 2,
            borderRadius: '50%',
            right: '1rem',
            bottom: '2rem',
            transform: 'translateY(50%)',
          }}
        >
          <Favorite />
        </IconButton>
        <Box display="flex" justifyContent="space-between">
          <Typography alignSelf="center" fontSize={12} style={{ color: isDarkModeOn ? 'white' : 'black' }}>
            {data && data.minFee && data.minFee>=0 &&(`@ ₹${data.minFee} onwards`)}
          </Typography>
          <Button
            size='small'
            variant="contained"
            sx={{
              alignSelf: "center",
              color: 'white',
              backgroundColor: '#735EAB',
              '&:hover': {
                backgroundColor: '#735EAB',
                color: 'white',
              },
              '&.Mui-disabled': {
                backgroundColor: isDarkModeOn ? 'rgba(115, 94, 171, 0.5)' : 'rgba(115, 94, 171, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
            type='button'
          >
            Explore
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}