// payment_module.js
import axios from "axios";
import logo from '../logo.png';


// Load Razorpay Script
export function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Handle Payment Response
export async function handlePaymentResponse(response, booking_data, BASE_URL, showAlert) {

  try {
    const payload = {
      response: response,
      bookingData: booking_data,
    };

    const backendResponse = await axios.post(`${BASE_URL}payments/razorpay_callback`, payload);
    console.log(backendResponse)
    if (backendResponse.status === 202) {
      showAlert(`Booking Success! 
        Order ID: ${response.razorpay_order_id},
        Payment ID: ${response.razorpay_payment_id}`, "success");
    } else {
      showAlert(`Bookings Failed! 
        ${backendResponse.data.message ? JSON.stringify(backendResponse.data.message) : 'Unknown Error.'}`, "error");
    }

  } catch (error) {
    console.error('Error sending payment response:', error);
    showAlert(`An error occurred while verifying the payment. Please try again.`, "error");
  }

}

// Display Razorpay Payment SDK
export async function displayRazorpayPaymentSdk({
  currentName,
  currentUserEmail,
  dataItem,
  entityId,
  personsAllowed,
  totalPrice,
  BASE_URL,
  collection_name,
  userId,
  showAlert,
}) {
  const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    showAlert("Razorpay SDK failed to load. Please check your connection.", "error");
    return;
  }
  const payload = {
    name: currentName,
    email: currentUserEmail,
    price_per_person: dataItem.price,
    persons_allowed: personsAllowed,
    total_amount: totalPrice,
    user_id: userId,
    entity_id: entityId,
    entity_name: dataItem.workshopName || dataItem.courseName || dataItem.openClassName,
    entity_type: collection_name,
    associated_studio_id: dataItem.StudioId
  }

  // Create a new order and send details to backend
  const booking_data ={
    user_id: userId,
    entity_id: entityId,
    entity_type: collection_name,
    persons_allowed: personsAllowed,
    payment_method: null,
  }
  const result = await axios.post(`${BASE_URL}payments/intitate_booking`, payload);

  if (!result) {
    showAlert("Server error. Please check your connection.", "error");
    return;
  }
  
  if (result.data && parseInt(result.data.code) !== 202){

    showAlert(`Could not book: ${result.data.message} \n ${result.data.code}`, "error");
  } else if (result.data && parseInt(result.data.code) === 202 && parseInt(totalPrice) === 0 ){
    showAlert(`Booking Success! 
      Booking Order ID: ${result.data.orderId}`, "success");
    return
  }

  const { merchantId, amount, currency, orderId } = result.data;

  const options = {
    key: merchantId,
    amount: amount,
    currency: currency,
    name: "Nritya",
    description: `${collection_name} Booking`,
    image: logo,
    order_id: orderId,
    prefill: {
      name: currentName,
      email: currentUserEmail,
    },
    notes: {
      address: "None",
    },
    theme: {
      color: "#61dafb",
    },
    handler: (response) => {
      booking_data.payment_method = response.method; 
      console.log(response)
      handlePaymentResponse(response, booking_data, BASE_URL, showAlert);
    },
    modal: {
      escape: true,
      ondismiss: () => {
        showAlert("You cancelled the payment.", "info");
      },
    },
  };

  const paymentObject = new window.Razorpay(options);

  paymentObject.open();
}
