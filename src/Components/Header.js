import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Nav, Navbar, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons'; // Import the cart icon

import { useNavigate } from 'react-router-dom';
import logo from './../logo.png';
import { adminLoginFn, adminLogoutFn } from '../reduxStore/adminLoginSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

import Dance1 from "./DanceImg/Dance1.jpg";
import Dance2 from "./DanceImg/Dance2.jpg";
import Dance3 from "./DanceImg/Dance3.jpg";
import Dance4 from "./DanceImg/Dance4.jpg";
import Dance5 from "./DanceImg/Dance5.jpg";

function Header({ handleLogout, username, isLoggedIn, setUsername, setIsLoggedIn }) {
  const styleObj = {
    fontSize: 10,
    textAlign: "center",
    background: "linear-gradient(to right, #000000, #FFFFFF)", // Gradient from black to white
    }
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const adminLogin = useSelector((state) => state.adminLogin);

  const [showProfileModal, setShowProfileModal] = React.useState(false);

    // Function to open the profile modal
    const openProfileModal = () => {
      setShowProfileModal(true);
    };
  
    // Function to close the profile modal
    const closeProfileModal = () => {
      setShowProfileModal(false);
    };

  const handleButtonClick = () => {
    console.log("Button clicked from Header.js");
    navigate('#/search/'+searchText);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents default form behavior of submitting
    handleButtonClick();
  }
  
  const { entity } = useParams();
  console.log("Hii-1",entity)
  

  return (
    <Navbar style={styleObj} expand="lg" collapseOnSelect >
      <Container fluid>
        <Navbar.Brand href="/nritya-webApp" style={{textTransform: 'none'}}  >
          <img style={{ width: 60, height: 60}}
            src={logo}
            alt="Logo"       
         />        
        </Navbar.Brand>
        <div>
        <meta charset="UTF-8" />
          <h1 style={{ color: '#ffffff', fontSize:25 , textAlign: 'center', textIndent:'right',textTransform: 'none',  fontFamily:'Times Roman', paddingRight:80}}>{'            नृtya'}</h1>
        </div>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
         <Nav
            style={{ fontFamily:'Times Roman',fontSize:20, maxHeight: '90px' }}
            navbarScroll
          >
          </Nav>

         
          
          {JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).displayName ? (
            <Nav className="ms-auto">
              <Button variant="outline-info" className="me-2 rounded-pill" href="#/cart" style={{ textTransform: 'none' }} disabled >
              <FontAwesomeIcon icon={faShoppingCart} />
              </Button>
              <Button variant="outline-info" className="me-2 rounded-pill"  href="#/profile" style={{textTransform: 'none'}}>List Studios</Button>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Button variant="outline-info" className="me-2 rounded-pill" href="#/cart" style={{ textTransform: 'none' }}>
              <FontAwesomeIcon icon={faShoppingCart} />
            </Button>
              <Button variant="outline-info" className="me-2 rounded-pill" href="#/login" style={{textTransform: 'none'}}> List Studios</Button>
            </Nav>
          )}

         {JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).displayName ? (
            <Nav>
              <a onClick={openProfileModal}>
                <Navbar.Text style={{ color: 'white',fontSize:18,fontFamily:'Times Roman'}}>{JSON.parse(localStorage.getItem('userInfo')).displayName}</Navbar.Text>
              </a>
              <Modal show={showProfileModal} onHide={closeProfileModal}>
              <Modal.Header closeButton>
                
                <Modal.Title>Action</Modal.Title> 

              </Modal.Header>
              <Modal.Body>
                 <Button variant="outline-warning" className=" rounded-pill"  href="#/profile">Profile</Button>
       
                <Button variant="outline-warning" className=" rounded-pill" onClick={handleLogout} href="/nritya-webApp">Sign Out</Button>
                <Button variant="outline-warning" className=" rounded-pill" href="#/orders">Orders</Button>
              </Modal.Body>
            </Modal>
              </Nav>
          ) : (
            <Nav>
              <Button variant="outline-warning" className=" rounded-pill" href="#/login" style={{textTransform: 'none'}}>Sign In</Button>
            </Nav>
          )}
        </Navbar.Collapse>


      </Container>
    </Navbar>

    
  );
}

export default Header;