import React from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "react-quill/dist/quill.snow.css";
import { TimePicker } from "@mui/x-date-pickers";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const FORM_FIELD_HEIGHT = 56;

const WorkshopStep2EventInfo = ({
  onBack,
  onSubmit,
  formData,
  setFormData,
}) => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const handleEventChange = (index, field) => (e) => {
    const value = e?.target?.value ?? e;
    const updatedEvents = [...formData.events];
    updatedEvents[index][field] = value;
    setFormData((prev) => ({ ...prev, events: updatedEvents }));
  };

  const handlePricingChange = (eventIndex, pricingIndex, field) => (e) => {
    const value = e?.target?.value ?? e;
    const updatedEvents = [...formData.events];
    updatedEvents[eventIndex].pricingOptions[pricingIndex][field] = value;
    setFormData((prev) => ({ ...prev, events: updatedEvents }));
  };

  const addEvent = () => {
    setFormData((prev) => ({
      ...prev,
      events: [
        ...prev.events,
        {
          date: null,
          startTime: null,
          endTime: null,
          description: "",
          pricingOptions: [
            {
              price: "",
              capacity: "",
              description: "",
            },
          ],
        },
      ],
    }));
  };

  const removeEvent = (index) => {
    const updatedEvents = [...formData.events];
    updatedEvents.splice(index, 1);
    setFormData((prev) => ({ ...prev, events: updatedEvents }));
  };

  const addPricingOption = (eventIndex) => {
    const updatedEvents = [...formData.events];
    updatedEvents[eventIndex].pricingOptions.push({
      price: "",
      capacity: "",
      description: "",
    });
    setFormData((prev) => ({ ...prev, events: updatedEvents }));
  };

  const removePricingOption = (eventIndex, pricingIndex) => {
    const updatedEvents = [...formData.events];
    updatedEvents[eventIndex].pricingOptions.splice(pricingIndex, 1);
    setFormData((prev) => ({ ...prev, events: updatedEvents }));
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography
          variant="h6"
          sx={{
            color: isDarkModeOn ? "white" : "black",
            textTransform: "capitalize",
          }}
          gutterBottom
        >
          Event Schedule & Pricing
        </Typography>
      </Grid>

      {formData.events.map((event, eventIndex) => (
        <React.Fragment key={eventIndex}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: "16px",
                  color: isDarkModeOn ? "white" : "black",
                }}
              >
                Event {eventIndex + 1}
              </Typography>
              {formData.events.length > 1 && (
                <IconButton
                  onClick={() => removeEvent(eventIndex)}
                  sx={{ color: isDarkModeOn ? "white" : "black" }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
            <Paper
              elevation={2}
              sx={{
                mb: 3,
                p: 3,
                borderRadius: 2,
                bgcolor: isDarkModeOn ? "#00000040" : "unset",
              }}
            >
              <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Date
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      name="date"
                      sx={{ width: "100%" }}
                      value={event.date ? dayjs(event.date) : null}
                      onChange={handleEventChange(eventIndex, "date")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Start Time
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      name="startTime"
                      sx={{ width: "100%" }}
                      value={event.startTime ? dayjs(event.startTime) : null}
                      onChange={handleEventChange(eventIndex, "startTime")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    End Time
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      name="endTime"
                      sx={{ width: "100%" }}
                      value={event.endTime ? dayjs(event.endTime) : null}
                      onChange={handleEventChange(eventIndex, "endTime")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Event Description
                  </Typography>
                  <TextField
                    fullWidth
                    name="description"
                    value={event.description}
                    onChange={handleEventChange(eventIndex, "description")}
                    sx={{ height: FORM_FIELD_HEIGHT }}
                    variant="outlined"
                    InputLabelProps={{ shrink: false }}
                    placeholder="Description"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: isDarkModeOn ? "white" : "black",
                      }}
                      gutterBottom
                    >
                      Pricing Options
                    </Typography>
                    <Button
                      onClick={() => addPricingOption(eventIndex)}
                      startIcon={<AddIcon />}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    >
                      Add Pricing
                    </Button>
                  </Box>

                  {event.pricingOptions.map((pricing, pricingIndex) => (
                    <Grid
                      key={pricingIndex}
                      container
                      rowSpacing={3}
                      columnSpacing={2}
                      sx={{
                        mb:
                          pricingIndex !== event.pricingOptions.length - 1
                            ? 2
                            : 0,
                      }}
                    >
                      <Grid item xs={12} sm={3}>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "16px" }}
                          gutterBottom
                        >
                          Price
                        </Typography>
                        <TextField
                          fullWidth
                          name="price"
                          value={pricing.price}
                          onChange={handlePricingChange(
                            eventIndex,
                            pricingIndex,
                            "price"
                          )}
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Enter price"
                          type="number"
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "16px" }}
                          gutterBottom
                        >
                          Capacity
                        </Typography>
                        <TextField
                          fullWidth
                          name="capacity"
                          value={pricing.capacity}
                          onChange={handlePricingChange(
                            eventIndex,
                            pricingIndex,
                            "capacity"
                          )}
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Enter capacity"
                          type="number"
                        />
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "16px" }}
                          gutterBottom
                        >
                          Description
                        </Typography>
                        <TextField
                          fullWidth
                          name="description"
                          value={pricing.description}
                          onChange={handlePricingChange(
                            eventIndex,
                            pricingIndex,
                            "description"
                          )}
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Description"
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={1}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {event.pricingOptions.length > 1 && (
                          <IconButton
                            onClick={() =>
                              removePricingOption(eventIndex, pricingIndex)
                            }
                            sx={{ color: isDarkModeOn ? "white" : "black" }}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </React.Fragment>
      ))}

      <Grid item xs={12} sx={{ pb: 2 }}>
        <Button
          size="small"
          onClick={addEvent}
          startIcon={<AddIcon />}
          sx={{ textTransform: "capitalize" }}
        >
          Add Another Event
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              bgcolor: "#67569E",
              color: "white",
              textTransform: "capitalize",
              "&:hover": { bgcolor: "#67569E", color: "white" },
            }}
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{
              bgcolor: "#67569E",
              color: "white",
              textTransform: "capitalize",
              "&:hover": { bgcolor: "#67569E", color: "white" },
            }}
            onClick={onSubmit}
          >
            Submit Workshop
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default WorkshopStep2EventInfo;
