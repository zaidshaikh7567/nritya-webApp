import React from 'react';
import './Ticket.css';
import moment from 'moment-timezone';
import html2canvas from 'html2canvas';
import QRCode from 'react-qr-code';
import { Button,Image } from 'react-bootstrap';
import { BASEURL_PROD } from '../constants';
import ticketLogo from '../assets/images/ticket-logo.png';
import ticketBallroomDance from '../assets/images/ticket-ballroom-dance.png';
import ticketDanceImage1 from '../assets/images/ticket-dance-image-1.png';
import ticketDanceImage2 from '../assets/images/ticket-dance-image-2.png';
import ticketDanceImage3 from '../assets/images/ticket-dance-image-3.png';
import ticketDanceImage4 from '../assets/images/ticket-dance-image-4.png';
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
    const ticketContainer = document.getElementById("nritya-ticket-container");
    html2canvas(ticketContainer, {
      backgroundColor: null,
    }).then((canvas) => {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "my-image.png";
      link.click();
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <div id="nritya-ticket-container" className="nritya-ticket-card">
        <div className="nritya-ticket-card-header">
        <Image style={{ width: 120, height: 104}}
            src={ticketLogo}
            alt="Logo" 
            roundedCircle={true}      
            />
          <br />
          <h4 style={{ fontSize: '30px' }} className="ticket-text">{className}</h4>
          <p style={{ fontSize: '20px' }} className="ticket-text">{studioName}</p>
          <p style={{ fontSize: '18px' }} className="ticket-text">{address}</p>

          <div style={{marginTop: "10px", marginBottom: '26px'}} className='d-flex justify-content-around'>
            <Image style={{ width: 70, height: 70 }} src={ticketDanceImage1} alt="" roundedCircle={true} />
            <Image style={{ width: 70, height: 70 }} src={ticketDanceImage2} alt="" roundedCircle={true} />
            <Image style={{ width: 70, height: 70 }} src={ticketDanceImage3} alt="" roundedCircle={true} />
            <Image style={{ width: 70, height: 70 }} src={ticketDanceImage4} alt="" roundedCircle={true} />
          </div>
        </div>
        <div className="nritya-ticket-card-body">
          <p className="ticket-text">Booked by: {customerName}</p>
          <div style={{margin: '10px 0'}}>
            <QRCode value={endpoint_url} style={{ height: '150px', width: '150px' }} />
          </div>
          <p className="ticket-text">Booking ID:<br />{bookingId}</p>
          <p style={{marginTop: 20}} className="ticket-text">Valid till 30 days<br />{convertToLocal(timestamp)}</p>
          <Image style={{ width: 60, height: 60 }} src={ticketBallroomDance} alt="" roundedCircle={true} />
          <p style={{ fontSize: 24 }} className="ticket-text">Admit One for Once</p>
        </div>
      </div>
      <Button style={{marginTop: 12}} variant="primary" onClick={downloadTicket}>
        Download Ticket
      </Button>
    </div>
  );
}

export default Ticket;
