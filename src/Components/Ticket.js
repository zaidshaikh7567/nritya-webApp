import React,{ useState, useEffect } from 'react';
import logo from './../logo.png';
import './Ticket.css';
import moment from 'moment-timezone';
//import QRCodeGenerator from './QRCodeGenerator';
//import QRCode from 'qrcode.react';
import QRCode from 'react-qr-code';



const TimeZone ={"IST":'Asia/Kolkata'}

function Ticket({ studioName, className, address, timing, days, customerName, timestamp, bookingId }) {
  console.log('Received data:', {
    studioName,
    className,
    address,
    timing,
    days,
    customerName,
    timestamp,
    bookingId,
  });

  return (
    <div className="nritya-ticket-card">
      <div className="nritya-ticket-card-header">
        <div className="logo-container">
          <div className="logo">
            <img src={logo} alt="Organization Logo" style={{ width: '5rem', height: '5rem', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <br></br>
        </div>
        <h3 className="text">{studioName}</h3>
        <p className="text">{className}</p>
        <p className="text">{address}</p>
      </div>
      <div className="nritya-ticket-card-body">
        <p className="text">Booked by: {customerName}</p>
        <div >
          {/* You can use an image tag with a dynamic source based on your data */}
          <QRCode value={"https://google.com"} style={{ height: "auto", maxWidth: "70%", width: "40%" }} />
        </div>
        <p className="text">Booking ID: {bookingId}</p>
        <p className="text">Valid till 3 days from {convertToLocal(timestamp)}</p>
      </div>
      <br/>
    </div>
  );
}

export default Ticket;

const convertToLocal = (unixUtcTimestamp,local="IST") => {
  return moment.unix(unixUtcTimestamp).tz(TimeZone[local]).format('DD-MM-YYYY HH:mm:ss');
};

