import dayjs from "dayjs";
import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  Button,
  Divider,
  Box,
  Stack,
  Container,
  IconButton,
  Select,
  MenuItem,
  ThemeProvider,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const theme = createTheme({
  typography: {
    fontFamily: "Nunito Sans, sans-serif",
  },
});

const EventBookingDialog = ({ onClose, workshopData }) => {
  const [selectedVariants, setSelectedVariants] = useState([]);
  console.log("selectedVariants", selectedVariants);
  const [selectedSubvariants, setSelectedSubvariants] = useState({});
  const [quantities, setQuantities] = useState({});
  const [availablity, setAvailablity] = useState(null);
  const [currentClickedVariant, setCurrentClickedVariant] = useState(null);

  const subvariantToVariantMapRef = useRef(new Map());

  const getVariantDescription = (variantId) => {
    const variant = workshopData.variants.find(
      (v) => v.variant_id === variantId
    );
    return variant ? variant.description : "No description available";
  };

  const getSubvariantDescription = (variant_id, subvariant_id) => {
    const variant = workshopData.variants.find(
      (v) => v.variant_id === variant_id
    );
    const subvariant = variant?.subvariants.find(
      (s) => s.subvariant_id === subvariant_id
    );
    return subvariant ? subvariant.description : "No description available";
  };

  const handleVariantToggle = (variant) => {
    setCurrentClickedVariant(variant);

    const isSelected = selectedVariants.some(
      (v) => v.variant_id === variant.variant_id
    );
    let updatedVariants;

    if (isSelected) {
      updatedVariants = selectedVariants.filter(
        (v) => v.variant_id !== variant.variant_id
      );
      const newSubvariants = { ...selectedSubvariants };
      const newQuantities = { ...quantities };

      delete newSubvariants[variant.variant_id];
      delete newQuantities[variant.variant_id];

      setSelectedSubvariants(newSubvariants);
      setQuantities(newQuantities);
    } else {
      updatedVariants = [...selectedVariants, variant];
      setSelectedSubvariants((prev) => ({
        ...prev,
        [variant.variant_id]: {},
      }));
      setQuantities((prev) => ({
        ...prev,
        [variant.variant_id]: {},
      }));
    }

    setSelectedVariants(updatedVariants);
  };

  const handleQuantityChange = (variant_id, subvariant_id, value) => {
    const newValue = parseInt(value);

    setQuantities((prev) => {
      const updatedQuantities = { ...prev };

      if (!newValue || newValue === 0) {
        if (updatedQuantities[variant_id]) {
          delete updatedQuantities[variant_id][subvariant_id];
          if (Object.keys(updatedQuantities[variant_id]).length === 0) {
            delete updatedQuantities[variant_id];
          }
        }
      } else {
        if (!updatedQuantities[variant_id]) {
          updatedQuantities[variant_id] = {};
        }
        updatedQuantities[variant_id][subvariant_id] = newValue;
      }

      return updatedQuantities;
    });
  };

  const calculateSummary = () => {
    let confirmed = [];

    selectedVariants.forEach((variant) => {
      const subQuantities = quantities[variant.variant_id] || {};

      variant.subvariants.forEach((sub) => {
        const qty = subQuantities[sub.subvariant_id];
        if (qty && qty > 0) {
          confirmed.push({
            variant: variant.variant_id,
            subvariant: sub.subvariant_id,
            price: sub.price,
            quantity: qty,
          });
        }
      });
    });

    const total = confirmed.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return { confirmed, total };
  };

  const handleConfirmBooking = () => {
    const { confirmed, total } = calculateSummary();

    if (confirmed.length === 0) {
      alert("Select at least one pricing option.");
      return;
    }

    // Ensure workshopId exists
    const workshopId = workshopData?.workshop_id;
    if (!workshopId) {
      alert("Workshop ID is missing.");
      return;
    }

    let bookingData = {
      workshop_id: workshopId,
      buyers_name: "NAME OF BUYER",
      buyer_email: "buyer@fake.com",
      buyer_number: "+910123456789",
      total: total,
      variant: {},
    };

    // Constructing the variant structure
    confirmed.map((item) => {
      const { quantity, subvariant, price, variant } = item;
      console.log(quantity, subvariant, price, variant);
      // Ensure all required fields are available
      if (
        variant &&
        subvariant &&
        quantity !== undefined &&
        price !== undefined
      ) {
        if (!bookingData.variant[variant]) {
          bookingData.variant[variant] = {};
        }

        bookingData.variant[variant][subvariant] = {
          quantity: quantity,
          price: price,
        };
      } else {
        console.warn("Incomplete data for item: ", item);
      }
    });

    console.log("Booking Data JSON:", JSON.stringify(bookingData, null, 2));

    // Optional: display a nice summary alert too
    let summary = confirmed
      .map((item) => {
        const { quantity, subvariant, price, variant } = item;
        return `${quantity} x ${subvariant} @ ₹${price} (Event: ${variant})`;
      })
      .join("\n");

    alert(`Booking Summary:\n\n${summary}\n\nTotal: ₹${total}`);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setSelectedVariants([]);
    setSelectedSubvariants({});
    setQuantities({});
  };

  const getVariantIdFromSubvariant = (subvariantId) => {
    console.log(
      "Accessing subvariantToVariantMap:",
      subvariantToVariantMapRef.current
    );
    return subvariantToVariantMapRef.current.get(subvariantId); // Access the map from ref
  };

  useEffect(() => {
    if (workshopData?.variants?.length) {
      setCurrentClickedVariant(workshopData?.variants?.[0]);
    }
  }, [workshopData]);

  useEffect(() => {
    const map = new Map();
    workshopData?.variants.forEach((variant) => {
      variant.subvariants.forEach((subvariant) => {
        map.set(subvariant.subvariant_id, variant.variant_id);
      });
    });
    console.log("Saving subvariantToVariantMap:", map);
    subvariantToVariantMapRef.current = map; // Store map in ref
  }, [workshopData]);

  useEffect(() => {
    if (
      process.env.REACT_APP_LIVE_CAPACITY_LEFT === "true" &&
      workshopData?.workshop_id
    ) {
      const workshopId = workshopData?.workshop_id; // Dummy UUID for testing

      const socket = new WebSocket(
        `ws://0.0.0.0:8000/ws/workshops/${workshopId}/`
      );

      socket.onopen = () => {
        console.log("WebSocket connection established!");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received WebSocket data:", data);

        if (data.type === "subvariant_capacity_update") {
          console.log(
            "Seat availabilty Update : ",
            data.available_capacity,
            typeof data.available_capacity
          );
          const capacityMap = new Map(Object.entries(data.available_capacity));
          setAvailablity(capacityMap);
          // Iterate over the available_capacity and update the quantity if necessary
          capacityMap.forEach((availableCapacity, subvariantId) => {
            console.log(subvariantId, availableCapacity);
            const variantId = getVariantIdFromSubvariant(subvariantId); // Get the variant_id using the map
            // console.log(variantId, subvariantId, availableCapacity, subvariantToVariantMapRef.current)
            if (variantId) {
              // If sold out, set quantity to 0
              if (availableCapacity === 0) {
                handleQuantityChange(variantId, subvariantId, 0);
              }
            }
          });
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      socket.onclose = (event) => {
        console.log("WebSocket closed:", event);
      };

      return () => {
        socket.close();
      };
    }
  }, [workshopData]);

  const { confirmed, total } = calculateSummary();

  return (
    <ThemeProvider theme={theme}>
      <Container fullWidth maxWidth="lg" sx={{ py: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton onClick={handleClose}>
            <ArrowBackIcon htmlColor="#222942" />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              color: "#222942",
              fontWeight: 800,
              fontSize: "24px",
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            Select Events
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 4, mt: 1, alignItems: "center" }}>
          {currentClickedVariant ? (
            <Box
              sx={{
                flexShrink: 0,
                border: "1px solid #ccc",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  px: 4,
                  py: 2,
                  textAlign: "center",
                  borderRadius: 4,
                  bgcolor: "#735EAB",
                  color: "white",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    letterSpacing: 0,
                    textTransform: "none",
                    fontWeight: 900,
                  }}
                >
                  {workshopData?.variants?.findIndex?.(
                    (variant) =>
                      variant.variant_id === currentClickedVariant?.variant_id
                  ) + 1}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    letterSpacing: 0,
                    textTransform: "uppercase",
                    fontWeight: 900,
                  }}
                >
                  Day
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    letterSpacing: 0,
                    fontWeight: 500,
                    color: "#222942",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                  gutterBottom
                >
                  <CalendarMonthIcon fontSize="small" />
                  {dayjs(currentClickedVariant?.date).format(
                    "dddd, MMMM DD, YYYY"
                  )}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "none",
                    letterSpacing: 0,
                    fontWeight: 900,
                    fontSize: "24px",
                    color: "#000000",
                  }}
                >
                  {currentClickedVariant?.description}
                </Typography>
              </Box>
            </Box>
          ) : null}

          <Box sx={{ flex: 1, overflow: "auto", display: "flex", gap: 2 }}>
            {workshopData &&
              workshopData.variants.map((variant, i) => (
                <>
                  <Box
                    sx={{
                      px: 4,
                      py: 2,
                      textAlign: "center",
                      borderRadius: 4,
                      bgcolor: "#735EAB",
                      color: "white",
                    }}
                    onClick={() => handleVariantToggle(variant)}
                  >
                    <Typography
                      sx={{
                        fontSize: "18px",
                        letterSpacing: 0,
                        textTransform: "none",
                        fontWeight: 900,
                      }}
                    >
                      {i + 1}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "18px",
                        letterSpacing: 0,
                        textTransform: "uppercase",
                        fontWeight: 900,
                      }}
                    >
                      Day
                    </Typography>
                  </Box>
                </>
              ))}
          </Box>
        </Box>

        <Box>
          {selectedVariants.length > 0 &&
            selectedVariants.map((variant, vi) => (
              <Box
                key={vi}
                sx={{ mt: 3, border: "1px solid #ccc", borderRadius: 2 }}
              >
                <Stack
                  direction="row"
                  sx={{
                    px: 2,
                    py: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      textTransform: "none",
                      letterSpacing: 0,
                      fontWeight: 500,
                      fontSize: "24px",
                      color: "#222942",
                    }}
                  >
                    {variant.description}:-
                  </Typography>

                  <Typography
                    sx={{
                      py: 0.5,
                      px: 2,
                      borderRadius: 1,
                      color: "white",
                      bgcolor: "#63AC0B",
                      letterSpacing: 0,
                      fontSize: "12px",
                      fontWeight: 800,
                    }}
                  >
                    Ticket Options
                  </Typography>
                </Stack>

                <Divider color="#ccc" />

                <Grid container spacing={2}>
                  {variant.subvariants.map((sub, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={idx}>
                      <Box sx={{ p: 2 }}>
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                textTransform: "none",
                                letterSpacing: 0,
                                color: "#222942",
                                fontWeight: 500,
                              }}
                            >
                              {sub.description}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#735EAB",
                                fontWeight: 800,
                                letterSpacing: 0,
                                fontSize: "20px",
                              }}
                            >
                              ₹{sub.price}
                            </Typography>
                          </Box>

                          {process.env.REACT_APP_LIVE_CAPACITY_LEFT ===
                            "true" &&
                            availablity &&
                            availablity.get(sub.subvariant_id) >= 0 &&
                            (availablity.get(sub.subvariant_id) === 0 ? (
                              <Typography
                                variant="body3"
                                sx={{ letterSpacing: 0 }}
                              >
                                Sold Out
                              </Typography>
                            ) : (
                              <Typography
                                variant="body3"
                                sx={{ letterSpacing: 0 }}
                              >
                                {availablity.get(sub.subvariant_id)} seats left
                              </Typography>
                            ))}
                        </Box>

                        <Select
                          fullWidth
                          size="small"
                          displayEmpty
                          value={
                            quantities[variant.variant_id]?.[
                              sub.subvariant_id
                            ] || ""
                          }
                          onChange={(e) =>
                            handleQuantityChange(
                              variant.variant_id,
                              sub.subvariant_id,
                              e.target.value
                            )
                          }
                          sx={{ mt: 1 }}
                          disabled={
                            process.env.REACT_APP_LIVE_CAPACITY_LEFT ===
                              "true" &&
                            availablity?.get(sub.subvariant_id) === 0
                          }
                        >
                          <MenuItem value="" sx={{ letterSpacing: 0 }}>
                            Select Quantity
                          </MenuItem>
                          {[...Array(11).keys()].slice(1).map((qty) => (
                            <MenuItem
                              key={qty}
                              value={qty}
                              sx={{ letterSpacing: 0 }}
                            >
                              {qty}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}

          {confirmed.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#4b3d78",
                  fontWeight: 700,
                  letterSpacing: 0,
                  textTransform: "none",
                }}
              >
                Booking Summary
              </Typography>

              <Box
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {confirmed.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      py: 1.5,
                      px: 2,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: 1,
                      borderBottomColor: "divider",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          letterSpacing: 0,
                          textTransform: "none",
                        }}
                      >
                        {getVariantDescription(item.variant)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontStyle: "italic",
                          letterSpacing: 0,
                        }}
                      >
                        {getSubvariantDescription(
                          item.variant,
                          item.subvariant
                        )}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        textAlign: "right",
                        minWidth: "120px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: 14,
                          color: "text.secondary",
                          mb: 0.5,
                          letterSpacing: 0,
                        }}
                      >
                        ₹{item.price} × {item.quantity}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "#735EAB",
                          fontSize: "1.1rem",
                          letterSpacing: 0,
                        }}
                      >
                        ₹{item.price * item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "rgba(115, 94, 171, 0.05)",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      letterSpacing: 0,
                    }}
                  >
                    Total Amount
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#3e3364",
                      fontSize: "1.3rem",
                      letterSpacing: 0,
                    }}
                  >
                    ₹{total}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "end", gap: 2 }}>
          <Button
            size="small"
            onClick={handleClose}
            sx={{
              textTransform: "none",
              fontSize: 16,
              px: 3,
              border: "1px solid #735EAB",
              color: "#735EAB",
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={confirmed.length === 0}
            sx={{
              textTransform: "none",
              fontSize: 16,
              px: 3,
              backgroundColor: "#735EAB",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#735EAB",
              },
            }}
          >
            Confirm
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EventBookingDialog;
