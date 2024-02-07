import React, { useState, useEffect } from 'react';
import { Form, Table, Button, Modal, Row, Col } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './StudioTable.css'; // Import the CSS file for styling
import  TimeRangePicker from './TimeRangePicker';

function StudioTable({ tableData, setTableData }) {
  const [tableDataReplace, setTableDataReplace] = useState([tableData]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [defaultTime, setDefaultTime] =  useState("00:00-00:00")

  const handleAddRow = () => {
    setTableDataReplace((prevData) => [...prevData, { className: '', danceForms: '', days: '', time: '00:00 - 00:00', instructors: '', status: '' }]);
    console.log(tableDataReplace, "After adding");
  };

  const handleRemoveRow = (index) => {
    setTableDataReplace((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
  };

  const handleTableChange = (index, field, value) => {
    setTableDataReplace((prevData) => {
      const newData = [...prevData];
      newData[index][field] = value;
      return newData;
    });
  };

  const handleTimePickerOpen = (index,time) => {
    console.log("handleTimePickerOpen",time)
    setDefaultTime(time)
    setSelectedRowIndex(index);
    setShowTimePicker(true);
  };

  const handleTimePickerClose = () => {
    setShowTimePicker(false);
    setSelectedRowIndex(null); // Reset selected row index when closing time picker
    console.log("---------")
  };

  const handleTimeSelect = (startTime, endTime) => {
    setTableDataReplace((prevData) => {
      const newData = [...prevData];
      
      if (selectedRowIndex !== null && newData[selectedRowIndex]) {
        const currentTime = newData[selectedRowIndex].time;
    
        if (currentTime !== undefined) {
          const [currentStartTime, currentEndTime] = currentTime.split(' - ');
    
          if (startTime !== null) {
            newData[selectedRowIndex].time = `${startTime} - ${currentEndTime}`;
          }
          if (endTime !== null) {
            newData[selectedRowIndex].time = `${currentStartTime} - ${endTime}`;
          }
        }
      }
      
      return newData;
    });
  
    setSelectedRow(selectedRowIndex);

  };

  useEffect(() => {
    const newData = tableDataReplace.reduce((accumulator, current, index) => {
      accumulator[index] = current;
      return accumulator;
    }, {});
    setTableData(newData);
  }, [tableDataReplace, setTableData]);

  return (
    <>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Dance Forms</th>
            <th>Days</th>
            <th>Time</th>
            <th>Instructors</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tableDataReplace.map((row, index) => (
            <tr key={index} className={selectedRow === index ? 'selected-row' : ''}>
              <td>
                <Form.Control
                  type="text"
                  value={row.className}
                  onChange={(e) => handleTableChange(index, 'className', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.danceForms}
                  onChange={(e) => handleTableChange(index, 'danceForms', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.days}
                  onChange={(e) => handleTableChange(index, 'days', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.time}
                  //onClick={() => handleTimePickerOpen(index,row.time)}
                  onClick={() => handleTimePickerOpen(index,row.time)}
                />
                {showTimePicker && (
                <TimeRangePicker
                  show={showTimePicker}
                  handleClose={handleTimePickerClose}
                  handleSelect={handleTimeSelect}
                  defaultTime={tableDataReplace[selectedRowIndex]?.time || "00:00-00:00"}
                />
              )}

              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.instructors}
                  onChange={(e) => handleTableChange(index, 'instructors', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.status}
                  onChange={(e) => handleTableChange(index, 'status', e.target.value)}
                />
              </td>
              <td>
                {index === 0 ? (
                  <Button variant="primary" onClick={handleAddRow}>
                    <FaPlus />
                  </Button>
                ) : (
                  <Button variant="danger" onClick={() => handleRemoveRow(index)}>
                    <FaMinus />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>      
    </>
  );
}

export default StudioTable;
