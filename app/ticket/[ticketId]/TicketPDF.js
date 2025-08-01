'use client';

import React from 'react';
import { Button } from '@mui/material';
import { Print } from '@mui/icons-material';

const convertTo12HourFormat = (timeString) => {
  if (!timeString) return '';
  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch (error) {
    return timeString;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function TicketPDF({ ticketData }) {
  const generatePDF = async () => {
    try {
      // Sort booking items by date and time
      const sortedBookingItems = [...ticketData.booking_items].sort((a, b) => {
        const dateComparison = new Date(a.date) - new Date(b.date);
        if (dateComparison !== 0) return dateComparison;
        return a.time.localeCompare(b.time);
      });

      // Create a simple HTML element for PDF generation
      const ticketElement = document.createElement('div');
      ticketElement.style.cssText = `
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background: white;
        color: #333;
        line-height: 1.6;
        page-break-inside: avoid;
        break-inside: avoid;
      `;

      // Build the ticket content
      ticketElement.innerHTML = `
        <div style="background: #735EAB; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎫 Your Ticket</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Booking ID: ${ticketData.booking_id}</p>
        </div>
        
        <div style="padding: 25px; text-align: center; border-bottom: 1px solid #e9ecef;">
          <h2 style="margin: 0; font-size: 24px; color: #735EAB;">${ticketData.workshop_name}</h2>
        </div>
        
        <div style="padding: 25px; background: #f8f9fa;">
          <h3 style="margin: 0 0 15px 0; color: #735EAB; font-size: 18px;">📍 Venue Details</h3>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: start;">
            <div>
              <p style="margin: 5px 0;">${ticketData.address.building}</p>
              <p style="margin: 5px 0;">${ticketData.address.street}</p>
              <p style="margin: 5px 0;">Near: ${ticketData.address.landmark}</p>
              <p style="margin: 5px 0; font-weight: bold; color: #735EAB;">${ticketData.address.city}</p>
            </div>
            <div style="background: #735EAB; color: white; padding: 20px; border-radius: 8px; text-align: center; width: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="font-size: 40px; margin-bottom: 10px; display: block;">🎫</div>
              <div style="font-size: 12px; display: block;">Scan for Entry</div>
            </div>
          </div>
        </div>
        
        <div style="padding: 25px;">
          <h3 style="margin: 0 0 20px 0; color: #735EAB; font-size: 18px;">📋 Events</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            ${sortedBookingItems.map((item, index) => `
              <div style="border: 2px solid #735EAB; border-radius: 12px; overflow: hidden; background: white;">
                <div style="background: #735EAB; color: white; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 16px;">🎫</span>
                  <span style="font-size: 12px; font-weight: bold;">#${item.variant_id.slice(-6)}</span>
                </div>
                <div style="padding: 20px; text-align: center;">
                  <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px; line-height: 1.4;">${item.variant_description}</div>
                  <div style="background: #f0f0ff; color: #735EAB; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 10px;">${item.subvariant_description}</div>
                  <div style="color: #666; font-size: 11px; margin-bottom: 8px; line-height: 1.4;">${formatDate(item.date)} at ${convertTo12HourFormat(item.time)}</div>
                  <div style="background: #f8f9fa; padding: 8px; border-radius: 6px; margin-top: 10px;">
                    <div style="font-size: 12px; font-weight: bold; color: #735EAB;">Quantity: ${item.quantity}</div>
                  </div>
                  <div style="border-top: 1px dashed #ddd; margin-top: 15px; padding-top: 10px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div style="background: #735EAB; color: white; padding: 25px; text-align: center;">
          <h3 style="margin: 0 0 15px 0; font-size: 18px;">💰 Price Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
            <span>Subtotal:</span>
            <span>₹${ticketData.booking_summary.subtotal}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
            <span>Booking Fee:</span>
            <span>₹${ticketData.booking_summary.booking_fee}</span>
          </div>
          ${ticketData.booking_summary.cgst > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
              <span>CGST:</span>
              <span>₹${ticketData.booking_summary.cgst}</span>
            </div>
          ` : ''}
          ${ticketData.booking_summary.sgst > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
              <span>SGST:</span>
              <span>₹${ticketData.booking_summary.sgst}</span>
            </div>
          ` : ''}
          <div style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px; margin-top: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
              <span>Total:</span>
              <span>₹${ticketData.booking_summary.total}</span>
            </div>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e9ecef;">
          Generated by Nritya
        </div>
      `;

      // Add to document temporarily
      document.body.appendChild(ticketElement);

      // Add print-specific styles
      const printStyles = document.createElement('style');
      printStyles.textContent = `
        @media print {
          body * {
            visibility: hidden;
          }
          #ticket-print-content, #ticket-print-content * {
            visibility: visible;
          }
          #ticket-print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 20px;
            background: white;
          }
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      `;
      document.head.appendChild(printStyles);

      // Add ID to the ticket element
      ticketElement.id = 'ticket-print-content';

      // Use browser's print functionality
      window.print();

      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(ticketElement);
        document.head.removeChild(printStyles);
      }, 1000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const downloadPageAsPDF = async () => {
    try {
      // Dynamically import html2canvas and jsPDF
      const html2canvas = await import('html2canvas');
      const { jsPDF } = await import('jspdf');

      // Find the main ticket page content
      const ticketPage = document.querySelector('[data-ticket-page]') || document.body;
      
      // Capture the page as canvas
      const canvas = await html2canvas.default(ticketPage, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: ticketPage.scrollWidth,
        height: ticketPage.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: ticketPage.scrollWidth,
        windowHeight: ticketPage.scrollHeight
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `ticket-${ticketData.booking_id}-${ticketData.workshop_name.replace(/\s+/g, '-')}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error downloading page as PDF:', error);
      alert('Failed to download page as PDF. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button
        variant="contained"
        startIcon={<Print />}
        fullWidth
        onClick={generatePDF}
        sx={{
          bgcolor: '#735EAB',
          textTransform: 'none',
          '&:hover': { bgcolor: '#5a4a8a' }
        }}
      >
        Print Ticket
      </Button>
      
      <Button
        variant="outlined"
        fullWidth
        onClick={downloadPageAsPDF}
        sx={{
          borderColor: '#735EAB',
          textTransform: 'none',
          color: '#735EAB',
          '&:hover': {
            borderColor: '#5a4a8a',
            bgcolor: 'rgba(115, 94, 171, 0.1)'
          }
        }}
      >
        Download Page as PDF
      </Button>
    </div>
  );
} 