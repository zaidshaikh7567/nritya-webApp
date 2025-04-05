import { useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Button as MuiButton } from "@mui/material";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import dayOrder from "../days.json";
import CustomSwitch from "./CustomSwitch";

const generateTimeOptions = () => {
  let option_AM = [];
  let option_PM = [];
  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const timeString = `${formattedHours}:${formattedMinutes}`;

      if (hours < 12) {
        option_AM.push(`${timeString} AM`);
      } else {
        const formattedHours12 = (hours === 12 ? 12 : hours - 12)
          .toString()
          .padStart(2, "0");
        option_PM.push(`${formattedHours12}:${formattedMinutes} PM`);
      }
    }
  }

  return [...option_AM, ...option_PM];
};

const renderTimeOptions = (defaultValue) => {
  const timeOptions = generateTimeOptions();
  return (
    <>
      <option value={defaultValue}>{defaultValue}</option>
      {timeOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </>
  );
};

const StudioWeeklyTimings = ({ timings, setTimings }) => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const handleSelect = (day, index, type, value) => {
    const updatedDayTimings = [...timings[day]];
    updatedDayTimings[index][type] = value;
    setTimings({ ...timings, [day]: updatedDayTimings });
  };

  const addTimeSlot = (day) => {
    const updatedDayTimings = [
      ...timings[day],
      { open: "09:00 AM", close: "06:00 PM" },
    ];
    setTimings({ ...timings, [day]: updatedDayTimings });
  };

  const removeTimeSlot = (day, index) => {
    const updatedDayTimings = [...timings[day]];
    if (updatedDayTimings.length > 1) {
      updatedDayTimings.splice(index, 1);
      setTimings({ ...timings, [day]: updatedDayTimings });
    }
  };

  const toggleDayClosed = (day) => {
    const isClosed =
      timings[day].length === 1 && timings[day][0].open === "Closed";
    if (isClosed) {
      setTimings({
        ...timings,
        [day]: [{ open: "09:00 AM", close: "06:00 PM" }],
      });
    } else {
      setTimings({
        ...timings,
        [day]: [{ open: "Closed", close: "Closed" }],
      });
    }
  };

  const isDayClosed = (day) => {
    return timings[day].length === 1 && timings[day][0].open === "Closed";
  };

  return (
    <Row className="gy-3">
      {dayOrder.map((day) => (
        <Col xs={12} sm={6} md={4} lg={3} key={day}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontWeight: "bold" }}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </span>
            <div className="d-flex align-items-center gap-2">
              <span
                style={{
                  fontSize: "0.8rem",
                  color: isDarkModeOn ? "#aaa" : "#666",
                }}
              >
                {isDayClosed(day) ? "Closed" : "Open"}
              </span>
              <CustomSwitch
                isOn={isDayClosed(day)}
                handleToggle={() => toggleDayClosed(day)}
              />
            </div>
          </div>

          {!isDayClosed(day) ? (
            timings[day].map((slot, index) => (
              <Row key={index} className="mb-2 align-items-center">
                <Col xs={5}>
                  <Form.Group>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      as="select"
                      value={slot.open}
                      onChange={(e) =>
                        handleSelect(day, index, "open", e.target.value)
                      }
                      style={{
                        height: "auto",
                        lineHeight: "1.5em",
                        padding: "8px",
                        color: isDarkModeOn ? "white" : "#333333",
                        backgroundColor: isDarkModeOn ? "#333333" : "white",
                      }}
                    >
                      {renderTimeOptions(slot.open)}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={5}>
                  <Form.Group>
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      as="select"
                      value={slot.close}
                      onChange={(e) =>
                        handleSelect(day, index, "close", e.target.value)
                      }
                      style={{
                        height: "auto",
                        lineHeight: "1.5em",
                        padding: "8px",
                        color: isDarkModeOn ? "white" : "#333333",
                        backgroundColor: isDarkModeOn ? "#333333" : "white",
                      }}
                    >
                      {renderTimeOptions(slot.close)}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={2}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeTimeSlot(day, index)}
                    className="mt-4"
                  >
                    -
                  </Button>
                </Col>
              </Row>
            ))
          ) : (
            <div className="text-muted mb-3">Studio is closed on this day</div>
          )}

          {!isDayClosed(day) && (
            <MuiButton
              variant="contained"
              onClick={() => addTimeSlot(day)}
              sx={{
                color: isDarkModeOn ? "black" : "white",
                bgcolor: isDarkModeOn ? "white" : "black",
                "&:hover": { bgcolor: isDarkModeOn ? "white" : "black" },
              }}
            >
              Add Time Slot
            </MuiButton>
          )}
        </Col>
      ))}
    </Row>
  );
};

export default StudioWeeklyTimings;
