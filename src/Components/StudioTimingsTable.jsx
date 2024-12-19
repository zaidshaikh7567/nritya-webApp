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
    minWidth: "150px", // Fixed column width
    whiteSpace: "nowrap", // Prevent text wrapping
    overflow: "hidden", // Hide overflow content
    textOverflow: "ellipsis", // Add ellipsis for overflow
  };

  const commonHeaderStyle = {
    backgroundColor: isDarkModeOn ? "#121212" : "black",
    color: "white",
    textAlign: "center",
    padding: "8px",
    minWidth: "150px", // Fixed column width
    whiteSpace: "nowrap", // Prevent text wrapping
  };

  const renderTimings = (slots) =>
    slots.length > 0
      ? slots.map((slot, index) => (
          <div
            key={index}
            style={{
              whiteSpace: "nowrap", // Prevent text wrapping for each timing
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {slot.open} - {slot.close}
          </div>
        ))
      : "Closed";

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
                <td style={{ ...commonCellStyle, textAlign: "center" }}>
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
          style={{ borderRadius: "5px", minWidth: "1000px" }} // Force a minimum table width
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
                  style={{
                    ...commonCellStyle,
                    textAlign: "left", // Align timings to the left
                  }}
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
