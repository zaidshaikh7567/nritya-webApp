import React, { useState } from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './StudioTable.css'; // Import the CSS file for styling
import  TimeRangePicker from './TimeRangePicker';
import danceStyles from '../danceStyles.json';
import { Autocomplete, TextField } from '@mui/material';

import { MultiSelect } from 'primereact/multiselect';
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

const daysOfWeek = ['M','T','W','Th','F','St','Sn'];

function StudioTable({ tableData = [], setTableData, instructorNamesWithIds }) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const danceStylesOptions = danceStyles.danceStyles;
  const [defaultTime, setDefaultTime] =  useState("00:00-00:00")

  const handleAddRow = () => {
    setTableData((prevData) => [...prevData, { className: '', danceForms: '', days: '', time: '00:00 - 00:00', instructors: [], fee:'',level:'' ,status: '' }]);
  };

  const handleRemoveRow = (index) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
  };

  const handleTableChange = (index, field, value) => {
    setTableData((prevData) => {
      if(field==="days"){
        value = Array.isArray(value) ? value.join(',') : value; 
      }
      const newData = [...prevData];
      newData[index][field] = value;
      return newData;
    });
  };

  const handleTimePickerOpen = (index,time) => {
    setDefaultTime(time)
    setSelectedRowIndex(index);
    setShowTimePicker(true);
  };

  const handleTimePickerClose = () => {
    setShowTimePicker(false);
    setSelectedRowIndex(null); // Reset selected row index when closing time picker
  };

  const handleTimeSelect = (startTime, endTime) => {
    setTableData((prevData) => {
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

  return (
    <>
      <Table bordered variant="light">
        <thead>
          <tr >
          <th style={{padding:'0.6rem'}}>Class Name</th>
            <th style={{padding:'0.6rem'}}>Dance Forms</th>
            <th style={{padding:'0.6rem'}}>Days</th>
            <th style={{padding:'0.6rem'}}>Time</th>
            <th style={{padding:'0.6rem'}}>Instructors</th>
            <th style={{padding:'0.6rem'}}>Fee</th>
            <th style={{padding:'0.6rem'}}>Level</th>
            <th style={{padding:'0.6rem'}}>
              <Button variant="primary" onClick={handleAddRow}>
                <FaPlus />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} className={selectedRow === index ? 'selected-row' : ''}>
              <td style={{padding:'0rem'}}>
                < Form.Control style={{backgroundColor:"white",height: 'auto', lineHeight: '1.5em',padding: '8px'}}
                  type="text"
                  value={row.className}
                  onChange={(e) => handleTableChange(index, 'className', e.target.value)}
                  
                />
              </td>
              <td style={{padding:'0rem'}}>
              < Form.Control style={{backgroundColor:"white",height: 'auto', lineHeight: '1.5em',padding: '8px'}}
                  as="select"
                  value={row.danceForms}
                  onChange={(e) => handleTableChange(index, 'danceForms', e.target.value)}
                >
                  <option value="">Select a dance form</option>
                  {danceStylesOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>

              </td>
              
              <td style={{ padding: '0rem'}} className="m-0 p-0">
                <MultiSelect value={row.days && row.days.split(',').filter(day => day !== '') } 
                    onChange={(event) => handleTableChange(index, 'days', event.target.value)}
                    options={daysOfWeek}
                    placeholder="class days" maxSelectedLabels={7} className="w-full md:w-20rem"
                  />
              </td>
              <td style={{padding:'0rem'}}>
                < Form.Control style={{backgroundColor:"white"}}
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
                  defaultTime={tableData[selectedRowIndex]?.time || "00:00-00:00"}
                />
              )}

              </td>
              <td style={{padding:'0rem', width:'20rem'}}>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={instructorNamesWithIds}
                  value={row.instructors}
                  onChange={(_, values) => handleTableChange(index, 'instructors', values)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      placeholder="Select Instructors"
                    />
                  )}
                />
              </td>
              <td style={{padding:'0rem'}}>
                < Form.Control style={{backgroundColor:"white"}}
                  type="text"
                  value={row.fee}
                  onChange={(e) => handleTableChange(index, 'fee', e.target.value)}
                />
              </td>
              <td style={{padding:'0rem'}}>
                < Form.Control style={{backgroundColor:"white",height: 'auto', lineHeight: '1.5em',padding: '8px'}}
                  as="select"
                  value={row.level}
                  onChange={(e) => handleTableChange(index, 'level', e.target.value)}
                >     <option value="">Select a value</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Misc">Misc</option>

                  </Form.Control>
              </td>
              
              <td style={{padding:'0.6rem'}}>
                <Button variant="danger" onClick={() => handleRemoveRow(index)}>
                  <FaMinus />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>      
    </>
  );
}

export default StudioTable;

/*
                <Autocomplete
                  multiple
                  id={`days-autocomplete-${index}`}
                  options={daysOfWeekOptions}
                  getOptionLabel={(option) => option.value}
                  value={row.days.split(',').filter(day => day !== '').map(day => daysOfWeekOptions.find(option => option.value === day))}
                  onChange={(event, newValue) => handleTableChange(index, 'days', newValue.map(option => option.value).join(','))}
                  renderInput={(params) => <TextField sx={{color:"black",backgroundColor:"white",width:"100%"}} {...params} />}
                />
              */