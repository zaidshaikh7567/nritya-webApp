import React, { useState, useEffect } from 'react';
import logo from './../logo.png';
import './Ticket.css';
import moment from 'moment-timezone';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'react-qr-code';
import { Button } from 'react-bootstrap';
import { BASEURL_PROD } from '../constants';
const TimeZone = { "IST": 'Asia/Kolkata' };

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
  const endpoint_url = BASEURL_PROD+"bookings/availFreeTrial/"+bookingId
  const convertToLocal = (unixUtcTimestamp, local = 'IST') => {
    return moment.unix(unixUtcTimestamp).tz(TimeZone[local]).format('DD-MM-YYYY HH:mm:ss');
  };

  const downloadTicket = () => {
    const ticketContainer = document.getElementById('nritya-ticket-container');

    html2canvas(ticketContainer).then((canvas) => {
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save(`booking_ticket_${customerName}.pdf`);
    });
  };

  return (
    <div>
      <div id="nritya-ticket-container" className="nritya-ticket-card">
        <div className="nritya-ticket-card-header">
          <div className="logo-container">
            <div className="logo">
              <img
                src={logo}
                alt="Organization Logo"
                style={{ width: '5rem', height: '5rem', objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
          </div>
          <br />
          <h4 className="text">{className}</h4>
          <p className="text">{studioName}</p>
          <p className="text">{address}</p>
        </div>
        <div className="nritya-ticket-card-body">
          <p className="text">Booked by: {customerName}</p>
          <div>
            <QRCode value={endpoint_url} style={{ height: 'auto', maxWidth: '70%', width: '40%' }} />
          </div>
          <p className="text">Booking ID: {bookingId}</p>
          <p className="text">Valid till 3 days from {convertToLocal(timestamp)}</p>
          <p className="text">Admit One for Once</p>
        </div>
        <br />
      </div>
      <Button variant="primary" onClick={downloadTicket}>
        Download Ticket
      </Button>
    </div>
  );
}

export default Ticket;
