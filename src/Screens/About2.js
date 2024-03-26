import React from 'react';
import './About.css'; 
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import NrityaImage from '../Components/DanceImg/Dance2.jpg';
import { Container, Row, Col } from 'react-bootstrap';


const AboutUs = () => {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    const sectionClassName = isDarkModeOn ? "about-section dark-mode" : "about-section";


  return (
    <Container >
      <Row>
        <section className={sectionClassName}>
          <Col lg={6} md={12} sm={12} className="image-column order-lg-1">
              <div className="inner-column">
                <div className="author-desc">
                  <h2>Nritya</h2>
                </div>
                <figure className="image-1">
                  <a href="#" className="lightbox-image" data-fancybox="images">
                    <img title="Nritya" src={NrityaImage} alt="" />
                  </a>
                </figure>
              </div>
          </Col>
          <Col lg={6} md={12} sm={12}>
                    <h1>HHH</h1>
                </Col>

        </section>
        <Col>
          <h1>HHH</h1>
        </Col>
      </Row>

      
    </Container>
    
  );
};

export default AboutUs;
