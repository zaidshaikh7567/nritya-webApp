// TableView.js
import React from 'react';
import './TableView.css';
import { Table } from 'react-bootstrap';

const TableView = ({ studioData, isDarkModeOn }) => {
  return (
    <Table bordered className={`custom-table ${isDarkModeOn ? 'dark-mode' : ''}`}>
      <thead>
        <tr>
          <th>Class Name</th>
          <th>Dance Forms</th>
          <th>Days</th>
          <th>Time</th>
          <th>Instructors</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(studioData.tableData).map((key, index) => {
          const classItem = studioData.tableData[key];
          return (
            <tr key={index}>
              <td>{classItem.className}</td>
              <td>{classItem.danceForms}</td>
              <td>{classItem.days}</td>
              <td>{classItem.time}</td>
              <td>{classItem.instructors}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default TableView;
