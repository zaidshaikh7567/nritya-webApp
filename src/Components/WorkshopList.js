import React from "react";
import { Box, Typography } from '@mui/material';
import QRCode from 'react-qr-code';
import venueIcon from "../assets/images/venue-icon.png";
import venueIconWhite from "../assets/images/venue-icon-white.png";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { GrShare } from "react-icons/gr";

function WorkshopList({ bookingData, setWorkshopClickTicket }) {

    
    const isDarkModeOn = useSelector(selectDarkModeStatus);

    return (
        <>
            <Box maxWidth="md" mx="auto" my={4} px={2}>

                {/* Top Section with Background Color */}
                <Box
                    bgcolor="#735EAB"
                    borderRadius="15px"
                    sx={{
                        width: { xs: "100%", md: "800px" }, // Full width on small screens, fixed 800px on larger
                        // height: { xs: "auto", md: "400px" }, // Height adapts on smaller screens
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        mx: 'auto'
                    }}
                    onClick={() => setWorkshopClickTicket(bookingData)}
                >
                    <Box
                        bgcolor="#735EAB"
                        color="white"
                        px={{ xs: 4, md: 8 }} // Padding adapts to screen size
                        py={3} // Added vertical padding
                        borderRadius="15px"
                        display="flex"
                        justifyContent="space-between"
                        flexDirection={{ xs: "column", md: "row" }} // Stack content vertically on small screens
                        sx={{
                            width: { xs: "100%", md: "800px" },
                            height: { xs: "auto", md: "150px" }
                        }}
                    >
                        <Box display="flex" flexDirection="column" alignSelf="center">
                            <Typography
                                variant="h6"
                                component="span"
                                sx={{
                                    fontSize: { xs: "28px", md: "48px" },
                                    fontWeight: "700",
                                    lineHeight: "58.56px",
                                    fontFamily: "Instrument Sans"
                                }}
                            >
                                Jazz 2
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: { xs: "16px", md: "24px" },
                                    fontWeight: "600",
                                    lineHeight: "29.28px",
                                    fontFamily: "Instrument Sans",
                                    color: "#D9D9D9"
                                }}
                            >
                                Ticket for 1
                            </Typography>
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignSelf={{ xs: "center", md: "end" }}
                            mt={{ xs: 2, md: 0 }} // Margin on small screens
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    textAlign: { xs: 'center' },
                                    fontSize: { xs: "16px", md: "24px" },
                                    fontWeight: "600",
                                    lineHeight: "29.28px",
                                    fontFamily: "Instrument Sans",
                                    color: "#D9D9D9",
                                    // marginBottom: 2
                                }}
                            >
                                Booking ID: X6KQEPGTEIU79Y
                            </Typography>
                        </Box>
                    </Box>

                    {/* Bottom Section with QR Code and Details */}
                    <Box

                        // px={{ xs: 4, md: 8 }}
                        // py={4}
                        px={5}
                        py="28px"
                        // border="1px solid #FFFFFF"
                        borderRadius="15px"
                        sx={{
                            width: { xs: "100%", md: "800px" },
                            // height: { xs: "auto", md: "250px" },
                            bgcolor: isDarkModeOn ? "black" : "white"
                        }}
                        display="flex"
                        flexDirection={{ xs: "column", md: "row" }} // Stack vertically on small screens
                        alignItems="center"
                        justifyContent="space-between"
                        gap={{ xs: 2, md: 7 }}
                    >
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Box sx={{ p: '16px', bgcolor: 'white', borderRadius: 2 }}>
                                <QRCode value="TeamopineSolution" size={140} />
                            </Box>

                            <Typography
                                variant="body2"
                                mt={2}
                                sx={{
                                    fontSize: { xs: "18px", md: "24px" },
                                    fontWeight: "600",
                                    fontFamily: "Instrument Sans",
                                    color: isDarkModeOn? "white":  "black" 
                                }}
                            >
                                Admit 2 for once
                            </Typography>
                        </Box>

                        <Box display="flex" flexDirection="column" alignItems={{ xs: "center", md: "start" }}>
                            <Box display="flex" alignItems="center" gap={{ xs: 3, md: 8 }} ml={{ xs: 0, md: 1 }}>
                                <Box display="flex" flexDirection='column' alignItems="start">
                                    <Box sx={{
                                        fontSize: { xs: "18px", md: "26px" },
                                        fontWeight: "600",
                                        fontFamily: "Instrument Sans",
                                        color: isDarkModeOn? "white":  "black" 
                                    }}>Date</Box>
                                    <Box sx={{
                                        fontSize: { xs: "15px", md: "22px" },
                                        fontWeight: "500",
                                        fontFamily: "Instrument Sans",
                                        color: isDarkModeOn? "white":  "black" 
                                    }}>25th Oct, 2024</Box>
                                </Box>
                                <Box display="flex" flexDirection='column' alignItems="start">
                                    <Box sx={{
                                        fontSize: { xs: "18px", md: "26px" },
                                        fontWeight: "600",
                                        fontFamily: "Instrument Sans",
                                        color: isDarkModeOn? "white":  "black" 
                                    }}>Time</Box>
                                    <Box sx={{
                                        fontSize: { xs: "15px", md: "22px" },
                                        fontWeight: "500",
                                        fontFamily: "Instrument Sans",
                                        color: isDarkModeOn? "white":  "black" 
                                    }}>4:00 PM - 6:00 PM</Box>
                                </Box>
                            </Box>

                            <Box display="flex" alignItems="center" mt={{ xs: 4, md: 10 }}>
                                <Box>
                                    <Box display="flex" alignItems="start">
                                        <img src={isDarkModeOn ?  venueIconWhite : venueIcon} alt="Venue" style={{ width: "40px", height: "40px" }} />
                                        <Typography
                                            variant="body2"
                                            ml={1}
                                            sx={{
                                                fontSize: { xs: "18px", md: "26px" },
                                                fontWeight: "600",
                                                fontFamily: "Instrument Sans",
                                                color: isDarkModeOn? "white":  "black" ,
                                            }}
                                        >
                                            Venue
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            marginTop:{xs:2},
                                            fontSize: { xs: "18px", md: "26px" },
                                            fontWeight: "500",
                                            fontFamily: "Instrument Sans",
                                            color: isDarkModeOn? "white":  "black" 
                                        }}
                                    >
                                        The Backyard Groovers
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* External Link Section */}
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Typography
                        variant="body2"
                        mt={2}
                        sx={{
                            fontSize: { xs: "18px", md: "26px" },
                            fontWeight: "500",
                            fontFamily: "Instrument Sans",
                            color: isDarkModeOn ? "white" : "black",
                            textAlign: "center"
                        }}
                    >
                        Check out the latest class timings

                    </Typography>
                    <div>
                        <GrShare alt="Class timings"
                            style={{ marginTop: "13px", width: { xs: 20, sm: 24, md: 30 }, height: { xs: 20, sm: 24, md: 30 }, marginLeft: "8px", color: isDarkModeOn ? "white" : "black" }} />
                    </div>
                </Box>
            </Box>
        </>
    );
}

export default WorkshopList;