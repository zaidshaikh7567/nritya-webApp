import React from 'react';
import logo from '../logo.png';
import axios from "axios";
import { Button } from '@mui/joy';

function PayButton() {

  function loadRazorpayScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  
  const handlePaymentResponse = async (response) => {
    try {
      const backendResponse = await axios.post("https://nrityaserver-2b241e0a97e5.herokuapp.com/payments/razorpay_callback", response);
      if (backendResponse.status === 200) {
        alert(`Payment Success:
          Order ID: ${response.razorpay_order_id}
          Payment ID: ${response.razorpay_payment_id}
          Signature: ${response.razorpay_signature}`);
      } else {
        alert(`Payment Verification Failed:
          ${backendResponse.data.error_data ? JSON.stringify(backendResponse.data.error_data) : 'No additional information.'}`);
      }
    } catch (error) {
      console.error('Error sending payment response:', error);
      alert('An error occurred while verifying the payment. Please try again.');
    }
  }

  async function displayRazorpayPaymentSdk() {
    const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Please check your connection.");
      return;
    }

    // Create a new order and send details to backend
    const result = await axios.post("https://nrityaserver-2b241e0a97e5.herokuapp.com/payments/razorpay_order", {
      "order_id": "Order-5152",
      "name": "Ayush Raj",
      "entity_id": "abnh_78opjsjwq123",
      "entity_name": "Studio Of Ayush",
      "entity_type": "Studio",
      "plan": "Super",
    });

    if (!result) {
      alert("Server error. Please check your connection.");
      return;
    }

    // Get the order details back
    const { merchantId, amount, currency, orderId } = result.data;

    const options = {
      key: merchantId,
      amount: amount.toString(),
      currency: currency,
      name: "Nritya",
      description: "Test Transaction",
      image: logo,
      order_id: orderId,
      
      prefill: {
        name: "Ayush Raj",
        email: "ayush@example.com",
      },
      notes: {
        address: "None",
      },
      theme: {
        color: "#61dafb",
      },
      handler: function (response) {
        handlePaymentResponse(response);
      },
      modal: {
        escape: true,
        ondismiss: function () {
          alert("Payment cancelled by user.");
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    
    paymentObject.open();
  }

  return (
      <Button className="App-link" onClick={displayRazorpayPaymentSdk}>
        Pay Now To Test
      </Button>
  );
}

export default PayButton;
