import React, { useState, useEffect } from 'react';
import { db } from '../config';
import { doc, getDoc } from "firebase/firestore";
import Card from 'react-bootstrap/Card';
import { useAuth } from '../context/AuthContext';

const cardStyle = {
  borderRadius: '10px',
  margin: '20px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  animation: 'glowingAnimation 2s infinite',
};

const gradientStyles = [
  { background: 'linear-gradient(to bottom right, #FFD700, #FFA500)', color: 'black' },
  { background: 'linear-gradient(to bottom right, #00BFFF, #1E90FF)', color: 'black' },
  { background: 'linear-gradient(to bottom right, #32CD32, #008000)', color: 'white' },
  { background: 'linear-gradient(to bottom right, #FFA500, #FF4500)', color: 'black' },
  { background: 'linear-gradient(to bottom right, #DC143C, #8B0000)', color: 'white' },
];

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const { currentUser } = useAuth();
  useEffect(() => {
    const getTransactions = async () => {
      try {
        const userRef = doc(db, "User", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const transactionIDs = userSnap.data().TransactionIDs;
          const transactionDataPromises = transactionIDs.map(async (transactionRef) => {
            const transactionSnap = await getDoc(transactionRef);
            if (transactionSnap.exists()) {
              return { id: transactionSnap.id, ...transactionSnap.data() }
            }
            return null;
          });

          const transactionData = await Promise.all(transactionDataPromises);
          const filteredTransactions = transactionData.filter((data) => data !== null);
          console.log(transactionData)
          setTransactions(filteredTransactions);
        } else {
          console.log("User not found but workshop created... error");
        }
      } catch (error) {
        console.log(error);
      }
    }

    getTransactions();
  }, []);

  return (
    <div>
      {currentUser && transactions.length > 0 ? (
        transactions
          .sort((a, b) => b.date - a.date) // Sort transactions in descending order based on date
          .map((transaction,index) => (
            <Card key={transaction.id} style={{ ...cardStyle, ...gradientStyles[index % gradientStyles.length] }}>
              <Card.Body>
                <Card.Title>{transaction.description}</Card.Title>
                <Card.Text>Amount: {transaction.razorpay_amount}</Card.Text>
                <Card.Text>Razorpay Transaction Id : {transaction.razorpay_order_id}</Card.Text>
                <Card.Text> Nritya Transaction Id : {transaction.id}</Card.Text>
                <Card.Text> Duration/validity : {transaction.duration}</Card.Text>
                <Card.Text> Time GMT: {new Date(transaction.date).toUTCString()}</Card.Text>
              </Card.Body>
            </Card>
          ))
      ) : (
        <p>No transactions found.</p>
      )}

    </div>
  );
}

export default Transactions;
