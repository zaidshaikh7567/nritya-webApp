import React from 'react';
import './About.css'; 
import { useSelector } from 'react-redux'; // Import useSelector
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import NrityaImage from '../Components/DanceImg/Dance2.jpg'; // Adjust the path accordingly



const AboutUs = () => {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    const sectionClassName = isDarkModeOn ? "about-section dark-mode" : "about-section";


  return (
    <section className={sectionClassName}>
      <div className="container">
        <div className="row">
          <div className="content-column col-lg-6 col-md-12 col-sm-12 order-2">
            <div className="inner-column">
              <div className="sec-title">
                <span className="title">About Nritya</span>
                <h4 className={`text-big ${isDarkModeOn ? 'dark-mode-text-big' : ''}`}>Discover the beat in your city.</h4>
              </div>
              <div className={`text ${isDarkModeOn ? 'dark-mode-text' : ''}`}>
              At Nritya, we are dedicated to bridging the gap between dance studios, creators, and enthusiasts. Whether you're a dance studio looking to showcase your talent or a user seeking workshops, events, or free trials, Nritya is your one-stop destination.
              </div>
                <div className={`text ${isDarkModeOn ? 'dark-mode-text' : ''}`}>
                Join Nritya today and embark on a journey of dance exploration, connection, and celebration. Let's dance together!
                </div>
              <div className="btn-box">
                <a href="#/contactus" className="theme-btn btn-style-one">Contact Us</a>
              </div>
            </div>
          </div>
          
          <div className="image-column col-lg-6 col-md-12 col-sm-12">
            <div className="inner-column">
              <div className="author-desc">
                <h2>Nritya</h2>
                <span style={{ fontSize: 'small' }}>Discover the beat in your city.</span>
              </div>
              <figure className="image-1">
                <a href="#" className="lightbox-image" data-fancybox="images">
                  <img title="Nritya" src={NrityaImage} alt="" />
                </a>
              </figure>
            </div>
          </div>

        </div>
        <div className="sec-title">
          <span className="title">Our Future Vision</span>
          <h4 className={`text-big ${isDarkModeOn ? 'dark-mode-text-big' : ''}`} >Empowering Dance Communities through Technology</h4>
        </div>
        <div className={`text ${isDarkModeOn ? 'dark-mode-text' : ''}`}>
          At Nritya, we are committed to enhancing the dance experience for both creators and users. Our future goals include providing a platform for creators to showcase their studios, workshops, and events, while offering users the opportunity to discover and book free trials and workshops in their locality.
        </div>
        <div className={`text ${isDarkModeOn ? 'dark-mode-text' : ''}`}>
          We believe in leveraging technology to make dance more accessible and enjoyable for everyone. Stay tuned as we work towards revolutionizing the way dance is experienced and shared.
        </div>
        <div className={`text ${isDarkModeOn ? 'dark-mode-text' : ''}`}>
          Join us on this exciting journey to celebrate the joy of dance and build vibrant dance communities around the world.
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
