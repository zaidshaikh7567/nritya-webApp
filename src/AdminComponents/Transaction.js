import React, { useState, useEffect } from 'react';
import { collection, query, getDoc,getDocs, orderBy, limit, startAfter, doc } from 'firebase/firestore';
import { db } from '../config';
import { Card, Button } from 'react-bootstrap';

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

const gradientStylesExpanded ={ background: 'linear-gradient(to bottom right, #000000, #2F4F4F)', color: 'white' }

const PAGE_SIZE = 5; // Number of transactions per page

function Transaction() {
  const [transactionsList, setTransactionsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortingOption, setSortingOption] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // Default sort direction is ascending
  const [maxPage, setMaxPage] = useState(1); // Maximum page number
  const [expandedCards, setExpandedCards] = useState({}); // Map to store expanded card data

  useEffect(() => {
    fetchTransactionsList();
  }, [currentPage, sortingOption, sortDirection]);

  const fetchTransactionsList = async () => {
    const queryRef = collection(db, 'Transactions');
  
    const querySnapshot = await getDocs(queryRef);
    const transactions = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const id = doc.id;
      return { id, ...data };
    });
  
    let sortedTransactions = [...transactions];
  
    if (sortingOption === 'date') {
      sortedTransactions.sort((a, b) => {
        const aValue = a.date || 0;
        const bValue = b.date || 0;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
    } else if (sortingOption === 'amount') {
      sortedTransactions.sort((a, b) => {
        const aValue = parseFloat(a.razorpay_amount) || 0;
        const bValue = parseFloat(b.razorpay_amount) || 0;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }
  
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + PAGE_SIZE);
  
    setTransactionsList(paginatedTransactions);
    setMaxPage(Math.ceil(sortedTransactions.length / PAGE_SIZE)); // Update the maximum page number
  };
  
  const handleSortChange = (e) => {
    setSortingOption(e.target.value);
    setCurrentPage(1); // Reset to the first page when changing sorting option
  };

  const handleDirectionChange = (e) => {
    setSortDirection(e.target.value);
    setCurrentPage(1); // Reset to the first page when changing sort direction
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCardClick = async (userId) => {
    if (expandedCards[userId]) {
      // If the card is already expanded, collapse it
      setExpandedCards((prevState) => ({
        ...prevState,
        [userId]: undefined,
      }));
    } else {
      // Fetch user data and expand the card
      const userRef = doc(db,'User',userId)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        console.log("Document data:", userSnap.data());
        setExpandedCards((prevState) => ({
          ...prevState,
          [userId]: userSnap.data(),
        }));
        console.log("expanded Cards ",expandedCards)
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!",userId);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ marginRight: '20px' }}>
          <label>Sort By:</label>
          <select value={sortingOption} onChange={handleSortChange} style={{ marginLeft: '5px' }}>
            <option value="">None</option>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>

        <div style={{ marginRight: '20px' }}>
          <label>Sort Direction:</label>
          <select value={sortDirection} onChange={handleDirectionChange} style={{ marginLeft: '5px' }}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div>
          {currentPage} of total {maxPage} page(s).
        </div>
      </div>

      <hr></hr>

      {transactionsList.map((transaction, index) => {
        const gradientStyle = gradientStyles[index % gradientStyles.length];
        const isExpanded = Boolean(expandedCards[transaction.userId]);

        return (
          <Card key={index} style={{ ...cardStyle, ...gradientStyle }}>
            <Card.Body>
              <Card.Title>{transaction.description}</Card.Title>
              <Card.Body>
                <Card.Text>Date: {new Date(transaction.date).toGMTString()}</Card.Text>
                <Card.Text>Razorpay Order ID: {transaction.razorpay_order_id}</Card.Text>
                <Card.Text>Nritya Transaction ID: {transaction.id}</Card.Text>
                <Card.Text>Amount: ₹{transaction.razorpay_amount}</Card.Text>
                <Card.Text>UserID: {transaction.userId}</Card.Text>

                {isExpanded && expandedCards[transaction.userId] && (
                  <Card style={{ ...cardStyle, ...gradientStylesExpanded }}>
                    <Card.Body>
                      <Card.Text>User Name: {expandedCards[transaction.userId].Name}</Card.Text>
                      <Card.Text>Email: {expandedCards[transaction.userId].Email}</Card.Text>
              
                      {/* Add more user data fields here */}
                    </Card.Body>
                  </Card>
                )}

                <Button className='rounded-pill' onClick={() => handleCardClick(transaction.userId)}>
                  {isExpanded ? 'Collapse' : 'Expand'} User Data
                </Button>
              </Card.Body>
            </Card.Body>
          </Card>
        );
      })}

      {/* Pagination */}
      <div>
        {Array.from({ length: maxPage }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              display: 'inline-block',
              padding: '8px 12px',
              margin: '4px',
              backgroundColor: currentPage === page ? '#333' : '#f2f2f2',
              color: currentPage === page ? '#fff' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Transaction;
