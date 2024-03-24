import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './ContactUs.css';
import { useSelector } from 'react-redux'; // Import useSelector
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';

const ContactUs = () => {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
  return (
    <section>
      <div className="section-header">
        <div className="container">
          <h2 className={`text-big ${isDarkModeOn ? 'dark-mode-text-big' : ''}`}>Contact Us</h2>
          <p className={`text ${isDarkModeOn ? 'dark-mode-text' : ''}`}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="contact-info">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <FontAwesomeIcon icon={faHome} />
              </div>

              <div className="contact-info-content">
                <h4 className={`text-big ${isDarkModeOn ? 'dark-mode-text-big' : ''}`}>Address</h4>
                <p className={`text ${isDarkModeOn ? 'dark-mode-text' : ''}`}> 4671 Sugar Camp Road,<br/> Owatonna, Minnesota, <br/>55060</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>

              <div className="contact-info-content">
                <h4 className={`text-big ${isDarkModeOn ? 'dark-mode-text-big' : ''}`}>Phone</h4>
                <p className={`text ${isDarkModeOn ? 'dark-mode-text' : ''}`}>571-457-2321</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>

              <div className="contact-info-content">
                <h4 className={`text-big ${isDarkModeOn ? 'dark-mode-text-big' : ''}`}>Email</h4>
                <p className={`text ${isDarkModeOn ? 'dark-mode-text' : ''}`}>nritya.contact@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <form action="" id="contact-form">
              <h2>Send Message</h2>
              <div className="input-box">
                <input type="text" required={true} name="fullname" />
                <span >Full Name</span>
              </div>

              <div className="input-box">
                <input type="email" required={true} name="email" />
                <span>Email</span>
              </div>

              <div className="input-box">
                <textarea required={true} name="message"></textarea>
                <span>Type your Message...</span>
              </div>

              <div className="input-box">
                <input type="submit" value="Send" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
