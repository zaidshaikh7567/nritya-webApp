import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { db } from '../config';
import { doc, getDoc, setDoc, addDoc, collection, getDocs } from "firebase/firestore";
import logo from '../logo.png';
import SubscriptionAdd from '../utils/SubscriptionAdd';
import './CreatorPlans.css';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 

const planIcons = {0:"fa-solid fa-paper-plane",1:"fa-solid fa-rocket",2:"fa-solid fa-satellite"}

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
  const isDarkModeOn = useSelector(selectDarkModeStatus);
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
            arr.push(doc.data());
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

  const handleTryClick = (duration) => {
    console.log(duration)
  }

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
    <div className={isDarkModeOn ? 'dark-theme' : 'light-theme'} >
      <section className="pricing-section">
      <div  className={`container ${isDarkModeOn ? 'dark-mode' : ''}`}>
        <div className="sec-title text-center">
          <span className="title">Get plan</span>
          <h2>Choose a Plan</h2>
        </div>

        <div className="outer-box">
          <div className="row">
            {loading ? (
              <Spinner animation="border" variant="danger" />
            ) : (
              cplans.sort((a, b) => a.level - b.level).map((plan, index) => (
                <div key={index} className={`pricing-block ${isDarkModeOn ? 'dark-mode' : ''} col-lg-4 col-md-6 col-sm-12 wow fadeInUp `}
                data-wow-delay={`${index * 400}ms`}>
                  <div className="inner-box">
                    <div className="icon-box">
                      <div className="icon-outer"><i className={`${planIcons[index]}`}></i></div>
                    </div>
                    <div className="price-box">
                      <div className='title'>{plan.title}</div>
                      <h4 className="price">₹ {plan.money}</h4>
                    </div>
                    <ul className="features">
                      <li className={plan.studioVisibility ? 'true' : 'false'}>Studio Visibility</li>
                      <li className={plan.duration ? 'true' : 'false'}>Plan for {plan.duration ? plan.duration : ""} days</li>
                      <li className={plan['workShops-pm'] ? 'true' : 'false'}> {plan['workShops-pm']? plan['workShops-pm'] : ""} workshops monthly</li>
                      <li className={plan['dedicatedSupport'] ? 'true' : 'false'}> Dedicated Support</li>
                    </ul>
                    <div className="btn-box">
                      {plan.netPrice>0? <Button variant="danger" onClick={() => handleBuyClick(plan.netPrice, plan.title, plan.duration)}>Buy plan</Button>: <Button variant="danger" onClick={() => handleTryClick(plan.duration)}>Try plan</Button>}
                    </div>
                  </div>
                </div>
              ))
              
            )}
          </div>
        </div>
      </div>
    </section>


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
