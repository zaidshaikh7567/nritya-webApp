import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ url }) => {
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Make sure to target an existing element with the ID 'qr-result'
        await QRCode.toCanvas(document.getElementById('qr-result'), url, {
          colorDark: '#000000',
          colorLight: '#ffffe3',
          width: 200,
          height: 200,
        });
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (url) {
      generateQRCode();
    }
  }, [url]);

  return url ? (
    <canvas id="qr-result" style={{ width: '55%', border: '2px solid black', borderRadius: '5px' }} />
  ) : null;
};

export default QRCodeGenerator;
