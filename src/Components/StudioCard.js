import React from 'react'
import { Card, Button, Row, Col , Form,Accordion, Badge, ButtonGroup } from 'react-bootstrap';
import RenderRating from './RenderRating';
import { useNavigate } from 'react-router-dom';
function StudioCard({studioName,studioAddress,studioTiming,studioPrice,studioInstructors,studioDanceStyles,studioContactNumber,studioId}) {
  const navigate = useNavigate();


  
  return (
    <div>
        <Card style={ {backgroundColor: "#000000"}}
          key="dark1"
          text={'dark' === 'light' ? 'dark' : 'white'}
          
          >
             <Card.Body>
                <div style={{ backgroundColor: "#000000",display: "grid", gridTemplateColumns: "1fr 2fr"}}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "10px" }}>
                    <div style={{ borderRadius: '5%', overflow: 'hidden', border: '1px solid #64FFDA', marginBottom: "10px", height: "66%", width: "100%" }}>
                        <img
                        className="d-block w-100"
                         src="https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"
                        style={{height: '100%', width: '100%', objectFit: 'cover'}}
                        alt="pic"
                        />
                    </div>
                    <a href={"/studio/"+studioId}>
                    <Button variant="outline-warning" className="me-2 rounded-pill mb-2" size="sm" style={{ fontSize: '1.4rem' }}  >Explore studio</Button>
                  
                    </a>
                      <div>
                      <ButtonGroup>
                        <Button variant="outline-info" className="me-2 rounded-pill" size="sm" style={{ fontSize: '0.6rem' }}>
                        <a href={"tel:"+studioContactNumber} style={{ textDecoration: 'none', color: 'inherit' }}>
                            Call
                          </a>
                        </Button>
                        <Button variant="outline-info" className="me-2 rounded-pill" size="sm" style={{ fontSize: '0.6rem' }}>
                            <a href={"https://wa.me/"+studioContactNumber} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                              WhatsApp
                            </a>
                          </Button>
                          </ButtonGroup>
                    </div>
                    </div>
                    <div style={{ padding: "20px"}}>
                     
                    <Card.Title style={{ fontSize: '1.5rem', textAlign: "left", marginBottom: "10px" }}> {studioName}</Card.Title>
                    <Card.Subtitle style={{ fontSize: '0.5rem', textAlign: "left", marginBottom: "10px",textTransform: "none" }}>{studioId}</Card.Subtitle>
                        <Card.Subtitle style={{ fontSize: '0.7rem', textAlign: "left", marginBottom: "10px" ,textTransform: "none"}}>4.2 {<RenderRating rating="4.2"/>} 350(ratings)</Card.Subtitle>
                        <Card.Text style={{ fontSize: '1.0rem', color: '#E4A11B', textAlign: "left" }}>Instructor: {studioInstructors}</Card.Text>
                    
                    <Card.Text style={{ fontSize: '1.0rem', textAlign: "left" }}>{studioAddress}</Card.Text>
                    <Card.Text style={{ fontSize: '1.0rem', textAlign: "left" }}>Timing : {studioTiming}</Card.Text>
                    <Card.Text style={{ fontSize: '1.0rem', textAlign: "left" }}>Price : {studioPrice}</Card.Text>
                    
                     
                    {console.log(studioDanceStyles)}
                      {studioDanceStyles && studioDanceStyles.split(",").map((form, index) => (
                        
                        <Badge
                          key={index}
                          bg={index % 2 === 0 ? "danger" : "info"} // Alternate badge colors
                          className="me-2 rounded-pill"
                          style={{ marginBottom: "10px" }}
                        >
                          {form.trim()}
                        </Badge>
                      ))}
                      

                    <br/>
                      
                    
                    
                    </div>
                </div>
                </Card.Body>


        </Card>
      
    </div>
  )
}

export default StudioCard
