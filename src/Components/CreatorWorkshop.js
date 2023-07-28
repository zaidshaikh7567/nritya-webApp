import React from 'react';
import { Card, Button, Row, Col , Form,Accordion } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import WorkshopCard from './StudioCard';
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection,where,getDocs,query } from "firebase/firestore";
import { COLLECTIONS } from '../constants';

function CreatorWorkshop() {
  const [workshop, setWorkshop] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);


  useEffect(() => {
    const getWorkshopCreated = async ()=>{
      const q = query(collection(db, COLLECTIONS.WORKSHOP), where("UserId", "==", localStorage.getItem('userInfo')).UserId    );
      const querySnapshot = await getDocs(q);
      console.log("Workshops : ",querySnapshot)
      localStorage.setItem("WorkshopCreated",JSON.stringify(querySnapshot))
      let arr=[]
      querySnapshot.forEach((doc)=>{
        console.log("=>",doc.data());
        arr=[...arr,doc.data()]
        
      });
      setWorkshop(arr)
    };
      
      getWorkshopCreated();
    },[setWorkshop]);
  
  const handleAddWorkshop = async (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    if (!title) {
      return;
    }

    try {
        
        const docRef = await addDoc(collection(db, "Workshop"), {
          title: event.target.title.value,
          body: event.target.body.value,
          author: JSON.parse(localStorage.getItem('userInfo')).displayName,
          price: event.target.price.value,
          styles: event.target.styles.value,
          UserId: JSON.parse(localStorage.getItem('userInfo')).UserId,
          city: event.target.city.value,
          status: event.target.status.value,
          enrolledId:[],
          reviews:[],
        });
        console.log("Workshop added successfully");
        
        const userRef = doc(db, "User", JSON.parse(localStorage.getItem('userInfo')).UserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          console.log("User there",userSnap.data());
          if(userSnap.data() != null){
            await updateDoc(userRef,{
      
              WorkshopCreated: [...userSnap.data().WorkshopCreated,docRef.id]
            });
            console.log("Workshop added back successfully");
          }else{
            console.log("userSnap.data() null")
          }
        } else {
          console.log("User not found but workshop created... error");
        }
      
    } catch (error) {
      console.error("Error adding workshop: ", error);
    }




    
    const newWorkshop = {
      title: event.target.title.value,
      body: event.target.body.value,
      author: JSON.parse(localStorage.getItem('userInfo')).displayName,
      price: event.target.price.value,
      styles: event.target.styles.value,
      UserId: JSON.parse(localStorage.getItem('userInfo')).UserId,
      city: event.target.city.value,
      status: event.target.status.value,
    };
    console.log("UserId," ,JSON.parse(localStorage.getItem('userInfo')))
    fetch(`/workshop/${JSON.parse(localStorage.getItem('userInfo')).UserId}`, {
      method: 'WORKSHOP',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newWorkshop),
    })
      .then((response) => response.json())
      .then((data) => {
        setWorkshop([...workshop, data]);
        event.target.reset();
      }); 
  };

  const handleSelectWorkshop = (event) => {
    const selectedWorkshop = workshop.find((workshop) => workshop.Title === event.target.value);
    setSelectedWorkshop(selectedWorkshop);
  }

  const handleUpdateWorkshop = (event) => {
    event.preventDefault();
    const title = selectedWorkshop.title;
    const body = event.target.body.value;
    const price = event.target.price.value;
    const styles = event.target.styles.value;
    const city = event.target.city.value;
    const status = event.target.status.value;

    fetch(`/workshopUpdate/${JSON.parse(localStorage.getItem('userInfo')).UserId}/${title}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body, price, styles, city, status }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSelectedWorkshop(null);
        fetch(`/workshop/${JSON.parse(localStorage.getItem('userInfo')).UserId}`)
          .then((response) => response.json())
          .then((data) => {
            setWorkshop(data);
          });
      });
      
  };

  const handleDeleteWorkshop = (title) => {
    fetch(`/workshopDel/${JSON.parse(localStorage.getItem('userInfo')).UserId}/${title}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        setWorkshop(data);
        fetch(`/workshop/${JSON.parse(localStorage.getItem('userInfo')).UserId}`)
          .then((response) => response.json())
          .then((data) => {
            setWorkshop(data);
          });
      });
  };
  

  
  
  useEffect(() => {
      setWorkshop(JSON.parse(localStorage.getItem('userInfo')))
      
  }, []);
  console.log("workshop :",workshop)
  return (
    <div>
       <br></br>
      <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header >
          Add a new course or workshop:
        </Accordion.Header> 
         
        <Accordion.Body>
            <Form onSubmit={handleAddWorkshop}>
              <Form.Group controlId="formBasicTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter title" name="title" />
              </Form.Group>

              <Form.Group controlId="formBasicBody">
                <Form.Label>Body</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter body" name="body" />
              </Form.Group>

              <Form.Group controlId="formBasicBody">
                <Form.Label>Price</Form.Label>
                <Form.Control as="textarea" rows={1} placeholder="Enter body" name="price" />
              </Form.Group>
              <Form.Group controlId="formBasicBody">
                <Form.Label>Dance Styles</Form.Label>
                <Form.Control as="textarea" rows={1} placeholder="Enter body" name="styles" />
              </Form.Group>

              <Form.Group controlId="formBasicBody">
                <Form.Label>City</Form.Label>
                <Form.Control as="textarea" rows={1} placeholder="Enter body" name="city" />
              </Form.Group>

              <Form.Group controlId="formBasicStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" name="status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="sold">Sold Out</option>
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit">
                Add Workshop
              </Button>
            </Form>

          </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
          <Accordion.Header>Update workshop</Accordion.Header>
          <Accordion.Body>
          <Form onSubmit={handleUpdateWorkshop}>
              <Form.Group controlId="formBasicTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control as="select" name="title" onChange={handleSelectWorkshop}>
                {workshop && workshop.length > 0 ? (
                    workshop.map((workshop, index) => (
                      <option value={workshop.Title}>{workshop.Title}</option>
                    ))
                  ) : (
                    <p>No workshop yet!</p>
                  )}

                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formBasicBody">
                <Form.Label>Body</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter body" name="body" defaultValue={selectedWorkshop ? selectedWorkshop.Body : ''} />
              </Form.Group>

              <Form.Group controlId="formBasicBody">
                <Form.Label>Price</Form.Label>
                <Form.Control as="textarea" rows={1} placeholder="Enter body" name="price" defaultValue={selectedWorkshop ? selectedWorkshop.Price : ''}/>
              </Form.Group>
              <Form.Group controlId="formBasicBody">
                <Form.Label>Dance Styles</Form.Label>
                <Form.Control as="textarea" rows={1} placeholder="Enter body" name="styles" defaultValue={selectedWorkshop ? selectedWorkshop.Styles : ''} />
              </Form.Group>

              <Form.Group controlId="formBasicBody">
                <Form.Label>City</Form.Label>
                <Form.Control as="textarea" rows={1} placeholder="Enter body" name="city" defaultValue={selectedWorkshop ? selectedWorkshop.City : ''}/>
              </Form.Group>

              <Form.Group controlId="formBasicStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" name="status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="sold">Sold Out</option>
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit">
                Update Workshop
              </Button>
            </Form>
           
          </Accordion.Body>
        </Accordion.Item>

      </Accordion>
      <br></br>

      <h3>Your Workshops:</h3>
      <ul>
      <Row xs={1} md={2} lg={3} className="g-4">
        {workshop.length > 0 ? (
          workshop.map((workshop, index) => (
            <Col key={index}>
              
              <Card className="h-100" bg="dark"
          key="dark1"
          text={'dark' === 'light' ? 'dark' : 'white'}>
                <Card.Body>
                  <Card.Img variant='top' src='https://unsplash.com/photos/pzgn0feLJwg'/>
                  <Card.Title>{workshop.Title}</Card.Title>
                  <Card.Text>{workshop.Body}</Card.Text>
                  <Card.Text> Price INR: {workshop.Price}</Card.Text>
                  <Card.Text>City :{workshop.City}</Card.Text>
                  <Card.Text>Author: {workshop.Author}</Card.Text>
                  {console.log(workshop.Status,workshop.Title)}
                  {workshop.Status !==`active` ?(
                    <Card.Text>{workshop.Status}</Card.Text>
                  ):(null)}
                  <Button variant="danger" onClick={() => handleDeleteWorkshop(workshop.Title)}>
                    Delete Workshop
                  </Button>
                  
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No workshop yet!</p>
        )}
      </Row>

      </ul>
      
    </div>
  )
}

export default CreatorWorkshop
