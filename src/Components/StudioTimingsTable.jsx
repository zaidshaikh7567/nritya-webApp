import React from "react";
import { useSelector } from "react-redux";
import Typography from "@mui/joy/Typography";
import { Table } from "react-bootstrap";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";

const StudioTimingsTable = ({ timings }) => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const commonCellStyle = {
    backgroundColor: isDarkModeOn ? "#444" : "white",
    color: isDarkModeOn ? "white" : "black",
    textAlign: "center",
    padding: "8px",
    minWidth: "150px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const commonHeaderStyle = {
    backgroundColor: isDarkModeOn ? "#121212" : "black",
    color: "white",
    textAlign: "center",
    padding: "8px",
    minWidth: "150px",
    whiteSpace: "nowrap",
  };

  const isDayClosed = (daySlots) => {
    return daySlots?.length === 1 && daySlots[0].open === "Closed";
  };

  const renderTimings = (slots) => {
    if (!slots || slots.length === 0) {
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ color: "#f44336" }}>Closed</span>
        </div>
      );
    }
    if (isDayClosed(slots)) {
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ color: "#f44336" }}>Closed</span>
        </div>
      );
    }
    
    return slots.map((slot, index) => (
      <div
        key={index}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {slot.open} - {slot.close}
      </div>
    ));
  };

  if (!timings || !Object.keys(timings).length) return null;

  return (
    <div>
      <Typography
        variant="h1"
        component="h2"
        sx={{
          color: isDarkModeOn ? "white" : "black",
          fontSize: "20px",
          textTransform: "capitalize",
          my: 1,
        }}
      >
        Studio Timings
      </Typography>

      {/* Mobile View: Day and Timing as Rows */}
      <div className="d-md-none">
        <Table
          bordered
          className={`custom-table ${isDarkModeOn ? "dark-mode" : ""}`}
          style={{ borderRadius: "5px", overflowX: "auto" }}
        >
          <thead>
            <tr>
              <th style={{ ...commonHeaderStyle }}>Day</th>
              <th style={{ ...commonHeaderStyle }}>Timing</th>
            </tr>
          </thead>
          <tbody>
            {weekdays.map((day) => (
              <tr key={day}>
                <td style={commonCellStyle}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </td>
                <td style={commonCellStyle}>
                  {renderTimings(timings[day] || [])}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Desktop View: Days as Columns */}
      <div className="d-none d-md-block scroll-hidden" style={{ overflowX: "auto" }}>
        <Table
          bordered
          className={`custom-table ${isDarkModeOn ? "dark-mode" : ""}`}
          style={{ minWidth: "1000px" }}
        >
          <thead>
            <tr>
              <th style={commonHeaderStyle}>Day</th>
              {weekdays.map((day) => (
                <th key={day} style={commonHeaderStyle}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={commonCellStyle}>Timing</td>
              {weekdays.map((day) => (
                <td
                  key={day}
                  style={commonCellStyle}
                >
                  {renderTimings(timings[day] || [])}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default StudioTimingsTable;
