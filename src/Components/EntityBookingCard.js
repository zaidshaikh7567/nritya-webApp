import React,{useState, useMemo} from "react";
import { Box, Button, Stack, Typography as MUITypography, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody, Grid } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";
import { COLLECTIONS, ENTITY_FLAG } from "../constants";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { useSelector } from "react-redux";
import logoMobile from '../assets/images/logo_small.jpg';

const EntityBookingCard = ({dataItem, personsAllowed, setPersonsAllowed,
  totalPrice, handleBook, entityType,}) => {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const currentUser = JSON.parse(localStorage.getItem("userInfo"))?.UserId;
    const currentUserEmail = JSON.parse(localStorage.getItem("userInfo"))?.email;

    const { BOOKING_LIMIT, INTERNET_CONV_CHARGES_INR } = useMemo(() => {
        switch (entityType) {
          case COLLECTIONS.COURSES:
            return {
              BOOKING_LIMIT: ENTITY_FLAG.COURSES_BOOKING_LIMIT,
              INTERNET_CONV_CHARGES_INR: ENTITY_FLAG.INTERNET_CONV_CHARGES_WORKSHOPS_COURSES_INR,
            };
          case COLLECTIONS.WORKSHOPS:
            return {
              BOOKING_LIMIT: ENTITY_FLAG.WORKSHOPS_BOOKING_LIMIT,
              INTERNET_CONV_CHARGES_INR: ENTITY_FLAG.INTERNET_CONV_CHARGES_WORKSHOPS_COURSES_INR,
            };
          case COLLECTIONS.OPEN_CLASSES:
            return {
              BOOKING_LIMIT: ENTITY_FLAG.OPEN_CLASSES_BOOKING_LIMIT,
              INTERNET_CONV_CHARGES_INR: ENTITY_FLAG.INTERNET_CONV_CHARGES_OPEN_CLASS_INR,
            };
          default:
            return {
              BOOKING_LIMIT: 1,
              INTERNET_CONV_CHARGES_INR: 0,
            };
        }
      }, [entityType]);
    
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Grid item xs={12} lg={4}>
        <Box
          sx={{
            bgcolor: isDarkModeOn ? "black" : "#efefef",
            p: 3,
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          {/* Entity Info */}
          <Box>
            <MUITypography variant="h4" style={{ color: isDarkModeOn ? 'white' : 'black', textTransform: 'none', textDecoration: 'none' }}>
              {dataItem.courseName || dataItem.workshopName || dataItem.openClassName|| "Open Class Name"}
            </MUITypography>
            <br />
            <MUITypography variant="subtitle" style={{ color: isDarkModeOn ? 'white' : 'black' }}>
              {dataItem.date}
            </MUITypography>
            <br />
            <MUITypography variant="subtitle" style={{ color: isDarkModeOn ? 'white' : 'black' }}>
              {dataItem.time}
            </MUITypography>
            <MUITypography variant="body1" sx={{ mt: "1rem", color: isDarkModeOn ? 'white' : 'black' }}>
              {dataItem.city || "City"}
            </MUITypography>
          </Box>

          {/* Booking Section */}
          <Box
            sx={{
              mt: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              color: isDarkModeOn ? 'white' : 'black'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', color: isDarkModeOn ? 'white' : 'black' }}>
                    {dataItem && dataItem.price && (
                      <span>Price per person</span>
                    )}
                  </td>
                  <td style={{ padding: '8px', color: isDarkModeOn ? 'white' : 'black' }}>
                    {dataItem && dataItem.price && (
                      <span> ₹{dataItem.price}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', color: isDarkModeOn ? 'white' : 'black' }}>
                    <span>Person(s)</span>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Stack direction="row" spacing={0} alignItems="center">
                        <Button
                          variant="contained"
                          onClick={() => setPersonsAllowed((prev) => Math.max(prev - 1, 1))}
                          disabled={personsAllowed <= 1}
                          sx={{
                            flex: 1,
                            height: '40px',
                            border: '1px solid',
                            borderColor: isDarkModeOn ? 'white' : 'black',
                            color: 'white',
                            backgroundColor: '#735EAB',
                            '&:hover': {
                              backgroundColor: '#735EAB',
                              color: 'white',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: isDarkModeOn ? 'rgba(115, 94, 171, 0.5)' : 'rgba(115, 94, 171, 0.3)', // Faded background
                                color: 'rgba(255, 255, 255, 0.5)', // Faded text color
                                borderColor: isDarkModeOn ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', // Faded border
                                },
                          }}
                        >
                          <FaMinus />
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            flex: 1,
                            height: '40px',
                            border: '1px solid',
                            borderColor: isDarkModeOn ? 'white' : 'black',
                            color: isDarkModeOn ? 'white' : 'black',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            }
                          }}
                        >
                          {personsAllowed}
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => setPersonsAllowed((prev) => Math.min(prev + 1, BOOKING_LIMIT))}
                          disabled={personsAllowed >= BOOKING_LIMIT}
                          sx={{
                            flex: 1,
                            height: '40px',
                            border: '1px solid',
                            borderColor: isDarkModeOn ? 'white' : 'black',
                            color: 'white',
                            backgroundColor: '#735EAB',
                            '&:hover': {
                              backgroundColor: '#735EAB',
                              color: 'white',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: isDarkModeOn ? 'rgba(115, 94, 171, 0.5)' : 'rgba(115, 94, 171, 0.3)', // Faded background
                                color: 'rgba(255, 255, 255, 0.5)', // Faded text color
                                borderColor: isDarkModeOn ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', // Faded border
                                },
                          }}
                        >
                          <FaPlus />
                        </Button>
                      </Stack>
                    </Box>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Book Now Button */}
            <Button
              variant="contained"
              onClick={handleBook}
              sx={{
                textTransform: "none",
                fontSize: 16,
                padding: "8px 16px",
                backgroundColor: isDarkModeOn ? "white" : "black",
                color: isDarkModeOn ? "black" : "white",
                "&:hover": {
                  backgroundColor: isDarkModeOn ? "#f0f0f0" : "#333333",
                },
              }}
            >
              {currentUser ? `Book Now @${totalPrice}` : "Login to Book"}
            </Button>
            <Button
              hidden={totalPrice === 0}
              variant="text"
              onClick={handleOpenModal}
              sx={{
                textTransform: 'none',
                fontSize: 16,
                color: isDarkModeOn ? 'white' : 'black',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'none',
                },
              }}
            >
              Price Breakdown (i)
            </Button>

            {/* Payment Info */}
            {currentUser && (
              <MUITypography
                variant="caption"
                sx={{ mt: "0.5rem", textAlign: "center" }}
              >
                Book and groove at the venue
              </MUITypography>
            )}
          </Box>
        </Box>
      </Grid>

      {/* Price Breakdown Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
            sx: {
              backgroundColor: isDarkModeOn ? '#333' : '#fff',
              color: isDarkModeOn ? '#fff' : '#000',
              position: 'relative', 
            },
          }}
      >
        <Box
            sx={{ position: 'absolute', top: '1rem',left: '50%',transform: 'translateX(-50%)',
                width: '60px',  height: '60px', backgroundColor: '#735EAB',
                borderRadius: '50%', display: 'flex', justifyContent: 'center',
                alignItems: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
        >
            <img src={logoMobile} alt="Icon"
                style={{ width: '4rem', height: '4rem',borderRadius: '50%'
            }}
            />
        </Box>
        <DialogTitle sx={{ color: isDarkModeOn ? '#fff' : '#000', marginTop: '5rem',textAlign: 'center', textDecoration: 'none', textTransform: 'none'  }}>Price Breakdown for {dataItem.courseName || dataItem.workshopName || dataItem.openClassName}</DialogTitle>
        <DialogContent>
            
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: isDarkModeOn ? '#fff' : '#000' }}><strong>Item</strong></TableCell>
                <TableCell align="right" sx={{ color: isDarkModeOn ? '#fff' : '#000' }}><strong>Amount (₹)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ color: isDarkModeOn ? '#fff' : '#000' }}>Price per Person</TableCell>
                <TableCell align="right" sx={{ color: isDarkModeOn ? '#fff' : '#000' }}>{dataItem.price}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ color: isDarkModeOn ? '#fff' : '#000' }}>Number of Persons</TableCell>
                <TableCell align="right" sx={{ color: isDarkModeOn ? '#fff' : '#000' }}>{personsAllowed}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ color: isDarkModeOn ? '#fff' : '#000' }}>Subtotal</TableCell>
                <TableCell align="right" sx={{ color: isDarkModeOn ? '#fff' : '#000' }}>
                  {dataItem.price * personsAllowed}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ color: isDarkModeOn ? '#fff' : '#000' }}>Internet Convenience Charges</TableCell>
                <TableCell align="right" sx={{ color: isDarkModeOn ? '#fff' : '#000' }}>{INTERNET_CONV_CHARGES_INR}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ color: isDarkModeOn ? '#fff' : '#000' }}><strong>Total Price</strong></TableCell>
                <TableCell align="right" sx={{ color: isDarkModeOn ? '#fff' : '#000' }}>
                  <strong>₹{totalPrice}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EntityBookingCard;
