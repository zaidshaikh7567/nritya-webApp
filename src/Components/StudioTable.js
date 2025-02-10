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

const daysOfWeek = ['Mon','Tues','Wed','Thurs','Fri','Sat','Sun'];
const categoryMap = {
  Kids: "Kids",
  Adults: "Adults",
  Women_Only: "Women Only",
  Men_Only: "Men Only",
  Seniors: "Seniors",
  All: "All Ages, Open to All",
  Couples: "Couples",
  Families: "Families"
};

function StudioTable({ tableData = [], setTableData, instructorNamesWithIds }) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const danceStylesOptions = danceStyles.danceStyles;
  const [defaultTime, setDefaultTime] =  useState('12:00 PM - 01:00 PM')

  const handleAddRow = () => {
    setTableData((prevData) => [...prevData, { className: '', danceForms: '', days: '', time: '12:00 PM - 01:00 PM', instructors: [], fee:'',level:'' ,status: '',freeTrial: false, classCategory: []  }]);
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
      console.log(tableData)
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
          <tr style={{border: '1px solid black'}}>
            <th style={{padding:'0rem',textAlign:'center' , minWidth:'15rem', border: '1px solid black'}}>Class Name</th>
            <th style={{padding:'0rem',textAlign:'center' , minWidth:'10rem', border: '1px solid black'}}>Dance Form</th>
            <th style={{padding:'0rem',textAlign:'center' , minWidth:'15rem', border: '1px solid black'}}>Days</th>
            <th style={{padding:'0rem',textAlign:'center' , minWidth:'15rem', border: '1px solid black'}}>Time</th>
            <th style={{padding:'0rem',textAlign:'center' , minWidth:'20rem', border: '1px solid black'}}>Instructors</th>
            <th style={{padding:'0rem',textAlign:'center' , minWidth:'8rem', border: '1px solid black'}}>Fee (₹)</th>
            <th style={{padding:'0rem',textAlign:'center' , minWidth:'10rem', border: '1px solid black'}}>Level</th>
            <th style={{padding:'0rem',textAlign:'center' , minWidth:'8rem', border: '1px solid black'}}>Free Trial</th>
            <th style={{padding:'0rem',textAlign:'center' , minWidth:'15rem', border: '1px solid black'}}>Class Category</th>
            <th style={{padding:'0rem'}}>
              <Button variant="primary" onClick={handleAddRow}>
                <FaPlus />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody style={{border: '1px solid black'}}>
          {tableData.map((row, index) => (
            <tr key={index} className={selectedRow === index ? 'selected-row' : ''}>
              <td style={{padding:'0rem',border: '1px solid black'}}>
                < Form.Control style={{backgroundColor:"white",height: 'auto', lineHeight: '1.5em',padding: '8px'}}
                  type="text"
                  value={row.className}
                  onChange={(e) => handleTableChange(index, 'className', e.target.value)}
                  
                />
              </td>
              <td style={{padding:'0rem',border: '1px solid black'}}>
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
              
              <td style={{ padding:'0rem',minWidth:'15rem', border: '1px solid black'}} className="m-0 p-0">
                <MultiSelect value={row.days && row.days.split(',').filter(day => day !== '') } 
                    onChange={(event) => handleTableChange(index, 'days', event.target.value)}
                    options={daysOfWeek}
                    placeholder="class days" maxSelectedLabels={7} className="w-full md:w-20rem"
                  />
              </td>
              <td style={{padding:'0rem',border: '1px solid black'}}>
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
              <td style={{padding:'0rem',border: '1px solid black', width:'20rem'}}>
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
              <td style={{padding:'0rem',border: '1px solid black'}}>
                < Form.Control style={{backgroundColor:"white"}}
                  type="text"
                  value={row.fee}
                  onChange={(e) => handleTableChange(index, 'fee', e.target.value)}
                />
              </td>
              <td style={{padding:'0rem',border: '1px solid black'}}>
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
              <td style={{padding:'0rem',border: '1px solid black'}}>
                < Form.Control style={{backgroundColor:"white",height: 'auto', lineHeight: '1.5em',padding: '8px'}}
                  as="select"
                  value={row.freeTrial}
                  onChange={(e) => handleTableChange(index, 'freeTrial', e.target.value)}
                >     <option value="">Select a value</option>
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                  </Form.Control>
              </td>
              <td style={{padding:'0rem', width:'20rem'}}>
                < Form.Control style={{backgroundColor:"white",height: 'auto', lineHeight: '1.5em',padding: '8px'}}
                  as="select"
                  value={row.classCategory[0] || ""}
                  onChange={(e) => handleTableChange(index, 'classCategory', [e.target.value])}
                >
                  <option value="">Select Class Category</option>
                  {Object.values(categoryMap).map((value, idx) => <option key={idx} value={value}>{value}</option>)}
                </Form.Control>
              </td>
              <td style={{padding:'0rem'}}>
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