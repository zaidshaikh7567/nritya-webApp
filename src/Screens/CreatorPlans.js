import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { db } from '../config';
import { doc, getDoc, setDoc, addDoc, collection, getDocs } from "firebase/firestore";
import logo from '../logo.png';
import SubscriptionAdd from '../utils/SubscriptionAdd';


const handlePayment = async (price, item, duration) => {
  // Load Razorpay script dynamically
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  document.body.appendChild(script);

  script.onload = () => {
    const razorpayOptions = {
      key: 'rzp_test_KGN4elrXhQOG65', // Replace with your Razorpay key
      amount: 100 * price, // Replace with the transaction amount
      currency: 'INR', // Replace with the transaction currency
      name: 'Nritya', // Replace with your store name
      description: 'Payment for ' + item, // Replace with the transaction description
      image: logo, // Replace with your store logo URL
      handler: async function (response) {
        // Handle success callback
        console.log('Payment successful!', response);

        const razorpayOrderId = response.razorpay_payment_id;
        console.log("hiiiii : ", razorpayOrderId)

        const transactionData = {
          userId: JSON.parse(localStorage.getItem('userInfo')).UserId,
          razorpay_order_id: razorpayOrderId,
          razorpay_amount: price,
          description: 'Payment for ' + item,
          currency: 'INR',
          date: Date.now(),
          duration: duration,
        };
        console.log("trans : ", transactionData)
        const transactionRef = await addDoc(collection(db, 'Transactions'), transactionData);

        console.log("trans", transactionRef)
        const userId = JSON.parse(localStorage.getItem('userInfo')).UserId;
        const userRef = doc(collection(db, 'User'), userId);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();
        userData.TransactionIDs.push(transactionRef);
        userData.isPremium = SubscriptionAdd(duration, userData.isPremium)

        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        userDetails.isPremium = userData.isPremium

        await setDoc(userRef, userData);
        localStorage.setItem('userDetails', JSON.stringify(userDetails));

        console.log(razorpayOrderId, response.razorpay_amount);

        // Alert payment successful
        alert('Payment successful!');
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  };

  script.onerror = () => {
    // Handle script loading error
    console.log('Error loading Razorpay script.');
  };
};

function CreatorPlans() {
  const [cplans, setCplans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const getCplans = async () => {
      const plansRef = collection(db, "CreatorPlans");
      let arr = [];

      // Retrieve all documents in the "CreatorPlans" collection
      getDocs(plansRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            arr.push(doc.data()); // Push document data into the array
          });
          setCplans(arr);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
          setLoading(false);
        });
    };

    getCplans();
  }, []);

  const handleBuyClick = (price, item, duration) => {
    setPaymentProcessing(true);

    handlePayment(price, item, duration)
      .catch((error) => {
        console.log("Payment error:", error);
        setPaymentError('Payment failed. Please try again.');
      })
      .finally(() => {
        setPaymentProcessing(false);
        setPaymentSuccess(true);
      });
  };

  const handleCloseToast = () => {
    setPaymentError(null);
    setPaymentSuccess(false);
  };

  return (
    <div className="creator-plans-container" >
      <h1>Plans:</h1>

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        cplans.map((plan, index) => (
          <Card key={index} style={{ height: '100%', margin: '20px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <div striped bordered hover>
              <h1 style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>{plan.title}</h1>
              <Table striped bordered hover style={{ height: '100%', alignItems: 'center' }}>
                <tbody>
                  <tr>
                    <td>Price:</td>
                    <td>₹ {plan.money}</td>
                  </tr>
                  <tr>
                    <td>Duration:</td>
                    <td>{plan.duration}</td>
                  </tr>
                  <tr>
                    <td>Post Visibility:</td>
                    <td>{plan.postVisibility}</td>
                  </tr>
                  <tr>
                    <td>Discount:</td>
                    <td>{plan.discount} %</td>
                  </tr>
                  <tr>
                    <td>Net Price:</td>
                    <td>₹ {plan.netPrice}</td>
                  </tr>
                </tbody>
              </Table>
            </div>

            <Button variant="primary" onClick={() => handleBuyClick(plan.netPrice, plan.title, plan.duration)}>Buy</Button>
          </Card>
        ))
      )}

    {paymentProcessing && (
      <Alert variant="info" className="toast-alert">
        <Spinner animation="border" size="sm" className="mr-2" /> Processing payment...
        <button type="button" className="close" onClick={handleCloseToast}>
          <span aria-hidden="true">&times;</span>
        </button>
      </Alert>
    )}

    {paymentSuccess && (
      <Alert variant="success" className="toast-alert">
        Payment successful!
        <button type="button" className="close" onClick={handleCloseToast}>
          <span aria-hidden="true">&times;</span>
        </button>
      </Alert>
    )}

    {paymentError && (
      <Alert variant="danger" className="toast-alert">
        {paymentError}
        <button type="button" className="close" onClick={handleCloseToast}>
          <span aria-hidden="true">&times;</span>
        </button>
      </Alert>
    )}

      
    </div>
  );
}

export default CreatorPlans;
