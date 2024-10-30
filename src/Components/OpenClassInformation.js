import React from "react";
import { Box, Typography, Button } from '@mui/material';
import QRCode from 'react-qr-code';
import { BASEURL_PROD } from '../constants';
import venueIcon from "../assets/images/venue-icon.png";
import venueIconWhite from "../assets/images/venue-icon-white.png";
import backIcon from "../assets/images/back-icon.png";
import directionIcon from "../assets/images/direction-icon.png";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { GrShare } from "react-icons/gr";

function OpenClassInformation({openClassClickTicket,setOpenClassClickTicket }) {

    const endpoint_url = BASEURL_PROD + "bookings/availFreeTrial/";
    const isDarkModeOn = useSelector(selectDarkModeStatus);

    return (
        <>
            <Box maxWidth="md" mx="auto" my={4} px={2} display="flex" flexDirection={{ xs: "column", md: "row" }}>

                <Box>
                    <Button onClick={() => setOpenClassClickTicket(null)} sx={{ marginBottom: { xs: "15px" } }}>
                        <img src={backIcon} alt='back' style={{ width: "50px", height: "50px" }} />
                    </Button>
                </Box>

                {/* Top Section with Background Color */}
                <Box
                    bgcolor="#735EAB"
                    borderRadius="15px"
                    sx={{
                        width: { xs: "100%", md: "800px" }, // Full width on small screens, fixed 800px on larger
                        height: { xs: "auto", md: "1200px" }, // Height adapts on smaller screens
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        mx: 'auto'
                    }}
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
                            height: { xs: "auto", md: "180px" }
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
                                {openClassClickTicket.entity_name}
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
                                Ticket for  {openClassClickTicket.persons_allowed}
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
                                Booking ID: {openClassClickTicket.id}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Bottom Section */}
                    <Box
                        bgcolor="white"
                        px={{ xs: 3, md: 9 }}
                        py={{ xs: 4, md: 0 }}
                        // border="1px solid #FFFFFF"
                        borderRadius="15px"
                        sx={{
                            width: { xs: "100%", md: "800px" },
                            height: { xs: "auto", md: "1020px" },
                            bgcolor: isDarkModeOn ? "black" : "white"
                        }}
                        display="flex"
                        flexDirection={{ xs: "column", md: "column" }}
                        alignItems="center"
                        justifyContent="center"
                        gap={4}
                    >
                        <Box
                            display="flex"
                            flexDirection={{ xs: "column", md: "row" }} // Stack vertically on small screens
                            alignSelf={{xs:"center", md:"start"}}
                            gap={{ xs: 2, md: 7 }}
                            ml={{ xs: 0, md: 4 }}
                        >
                            <Box display="flex" alignItems="center" sx={{ p: { xs: "8px", md: '16px' }, bgcolor: 'white', borderRadius: 2 }}>
                                <QRCode value={(endpoint_url +openClassClickTicket .entity_id)} size={200} />
                            </Box>

                            <Box display="flex" flexDirection="column" alignItems={{ xs: "center", sm: "center" }}>
                                {/* <Typography
                                    variant="body2"
                                    mt={2}
                                    mx={{xs: 2.5}}
                                    sx={{
                                        fontSize: { xs: "15px", sm: "20px", md: "26px" },
                                        fontWeight: "500",
                                        fontFamily: "Instrument Sans",
                                        color: isDarkModeOn ? "white" : "black",
                                        wordWrap: "break-word",
                                    }}
                                >
                                    Valid till 31st Oct, 2024 ; 22:14:07
                                </Typography> */}
                                
                                <Box display="flex" flexDirection='column' alignItems="start">
                                    <Box sx={{
                                        fontSize: { xs: "18px", md: "26px" },
                                        fontWeight: "600",
                                        fontFamily: "Instrument Sans",
                                        color: isDarkModeOn ? "white" : "black",
                                        mt:{xs:2 ,md:3 }
                                    }}>Date</Box>
                                    <Box sx={{
                                        fontSize: { xs: "15px", md: "22px" },
                                        fontWeight: "500",
                                        fontFamily: "Instrument Sans",
                                        color: isDarkModeOn ? "white" : "black",
                                        mt:{xs:1 ,md:2 }
                                    }}>25th Oct, 2024</Box>
                                </Box>
                                <Box display="flex" flexDirection='column' alignItems="start">
                                    <Box sx={{
                                        fontSize: { xs: "18px", md: "26px" },
                                        fontWeight: "600",
                                        fontFamily: "Instrument Sans",
                                        color: isDarkModeOn ? "white" : "black",
                                        mt:{xs:2 ,md:3 }
                                    }}>Time</Box>
                                    <Box sx={{
                                        fontSize: { xs: "15px", md: "22px" },
                                        fontWeight: "500",
                                        fontFamily: "Instrument Sans",
                                        color: isDarkModeOn ? "white" : "black",
                                        mt:{xs:1 ,md:2 }
                                    }}>4:00 PM - 6:00 PM</Box>
                                </Box>
                                
                            </Box>
                        </Box>

                        <Box
                            display="flex"
                            flexDirection={{ xs: "column", md: "column" }} // Stack vertically on small screens
                            alignSelf="start"
                            ml={{ xs: 0, md: 4 }}
                        >
                            <Typography
                                variant="body2"
                                // mt={2}
                                sx={{
                                    fontSize: { xs: "16px", sm: "20px", md: "24px" },
                                    fontWeight: "600",
                                    fontFamily: "Instrument Sans",
                                    color: isDarkModeOn ? "white" : "black",
                                    // mx: { xs: "auto", sm: 0, md: 0 }
                                }}
                            >
                                Admit 1 for once
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: { xs: "16px", sm: "20px", md: "26px" },
                                    fontWeight: "500",
                                    fontFamily: "Instrument Sans",
                                    color: isDarkModeOn ? "white" : "black",
                                    // textAlign: "center"
                                }}
                            >
                                Check out the latest class timings

                                <GrShare alt="Class timings"
                                    style={{ width: { xs: 20, sm: 24, md: 30 }, height: { xs: 20, sm: 24, md: 30 }, marginLeft: "8px", color: isDarkModeOn ? "white" : "black" }} />

                            </Typography>
                        </Box>

                        <Box
                            display="flex"
                            flexDirection={{ xs: "column", sm: "row", md: "row" }}
                            alignItems="center"
                            justifyContent="space-between"
                            gap={{ xs: 3,sm :20, md: 3 }}
                            ml={{ xs: 0, sm: 0, md:4 }}
                        >
                            <Box>
                                <Box display="flex" alignItems="center">
                                    <img src={isDarkModeOn ?  venueIconWhite : venueIcon } alt="Venue" style={{ width: "40px", height: "40px" }} />
                                    <Typography
                                        variant="body2"
                                        ml={1}
                                        sx={{
                                            fontSize: { xs: "18px", sm: "22px", md: "26px" },
                                            fontWeight: "600",
                                            fontFamily: "Instrument Sans",
                                            color: isDarkModeOn ? "white" : "black"
                                        }}
                                    >
                                        Venue
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: { xs: "14px", sm: "18px", md: "26px" },
                                        fontWeight: "500",
                                        fontFamily: "Instrument Sans",
                                        color: isDarkModeOn ? "white" : "black",
                                        maxWidth: "90%",
                                        marginTop: "15px"
                                    }}
                                >
                                 The Backyard Groovers White House Tower, Sector 28, Gurugram, 122002
                                </Typography>
                            </Box>

                            <Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        fontSize: { xs: "16px", sm: "18px", md: "24px" },
                                        fontWeight: 700,
                                        marginTop: 1,
                                        backgroundColor: '#735EAB',
                                        color: "#FFFFFF",
                                        width: { xs: "100%", sm: "100%", md: "335px" },
                                        height: { xs: "50px", sm: "60px", md: "72px" }
                                    }}
                                >
                                    GET DIRECTIONS
                                    <img src={directionIcon} alt='direction' style={{ width: "40px", height: "40px", marginLeft: "8px" }} />
                                </Button>
                            </Box>
                        </Box>

                        <Box
                            display="flex"
                            flexDirection={{ xs: "column", md: "column" }} // Stack vertically on small screens
                            alignSelf="start"
                            ml={{ xs: 0, md: 4 }}
                            sx={{ maxWidth: { xs: "100%", md: "50%" } }}
                        >
                            <Typography
                                variant="body2"
                                // mt={2}
                                sx={{
                                    fontSize: { xs: "18px", md: "24px" },
                                    fontWeight: "700",
                                    fontFamily: "Instrument Sans",
                                    color: isDarkModeOn ? "white" : "black"
                                }}
                            >
                                Booking Details
                            </Typography>
                        
                            <Box display="flex" flexDirection="column">
                                <Box style={{
                                    fontWeight: "400",
                                    fontFamily: "Instrument Sans",
                                    fontSize: { xs: "10px", sm: "16px", md: "20px" },
                                    color:isDarkModeOn ? "white" : "black"
                                }}>Hemant Srivastava
                                </Box>
                                <Box style={{
                                    fontWeight: "400",
                                    fontFamily: "Instrument Sans",
                                    fontSize: { xs: "10px", sm: "16px", md: "20px" },
                                    color: isDarkModeOn ? "white" : "black"
                                }}>+91-6392074436
                                </Box>
                                <Box style={{
                                    fontWeight: "400",
                                    fontFamily: "Instrument Sans",
                                    fontSize: { xs: "10px", sm: "14px", md: "20px" },
                                    color: isDarkModeOn ? "white" : "black",
                                    marginBottom: "20px",
                                    wordWrap: "break-word", // Break long text
                                    maxWidth: "100%" // Constrain within the box
                                }}>hemant.nov.srivastava@gmail.com
                                </Box>
                                <Box style={{
                                    fontWeight: "400",
                                    fontFamily: "Instrument Sans",
                                    fontSize: { xs: "10px", sm: "16px", md: "20px" },
                                    color: isDarkModeOn ? "white" : "black"
                                }}>Booked on Mar 16, 2024, 12:49 PM
                                </Box>
                            </Box>
                        </Box>

                        <Box
                            display="flex"
                            flexDirection={{ xs: "column", md: "column" }} // Stack vertically on small screens
                            alignSelf="start"
                            ml={{ xs: 0, md: 4 }}
                        >
                            <Typography
                                variant="body2"
                                // mt={2}
                                sx={{
                                    fontSize: { xs: "18px", md: "24px" },
                                    fontWeight: "700",
                                    fontFamily: "Instrument Sans",
                                    color: isDarkModeOn ? "white" : "black"
                                }}
                            >
                                Payment Details
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    fontSize: { xs: "14px", md: "40px" },
                                    fontWeight: "700",
                                    fontFamily: "Instrument Sans",
                                    color: isDarkModeOn ? "white" : "black"
                                }}
                            >
                                FREE
                            </Typography>
                        </Box>
                    </Box>
                </Box>

            </Box>
        </>
    );
}

export default OpenClassInformation;