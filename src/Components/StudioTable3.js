import React, { useState } from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './StudioTable.css'; // Import the CSS file for styling

function StudioTable({tableData,setTableData}) {
  

  const handleAddRow = () => {
    setTableData((prevData) => [...prevData, { className: '', danceForms: '', days: '', time: '', instructors: '', status: '' }]);
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
      const newData = [...prevData];
      newData[index][field] = value;
      return newData;
    });
  };

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
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} >
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
                  onChange={(e) => handleTableChange(index, 'time', e.target.value)}
                />
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
                  value={row.price}
                  onChange={(e) => handleTableChange(index, 'price', e.target.value)}
                >
                  
                </Form.Control>
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
