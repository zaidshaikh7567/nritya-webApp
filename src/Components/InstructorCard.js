import React, {useState,useEffect} from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { ref, getDownloadURL, uploadBytes, listAll,deleteObject } from 'firebase/storage';
import { storage } from '../config';
import { STORAGES } from '../constants';

function InstructorCard({ instructor ,id}) {
  const danceStyles = instructor.danceStyles ? instructor.danceStyles.split(',') : [];
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [imageURL, setImageURL] = useState(null);

  const cardStyle = {
    width: '18rem',
    margin: '5px',
    backgroundColor: isDarkModeOn ? '#333333' : 'black',
    color: isDarkModeOn ? 'white' : 'black',
  };

  const imgStyle = {
    width: '5rem',
    height: '5rem',
    borderRadius: '50%',
    marginRight: '1px',
  };

  const defaultImgStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    marginRight: '10px',
    backgroundColor: isDarkModeOn ? '#555' : '#d3d3d3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  useEffect(() => {
    // Fetch the image URL when the component mounts
    const getImageURL = async () => {
      
      if(instructor && instructor.id){
        console.log("Instructor dp",instructor.id)
        const storagePath = `${STORAGES.INSTRUCTORIMAGES}/${instructor.id}`;
        const folderRef = ref(storage, storagePath);
        try {
          listAll(folderRef)
          .then((result) => {
            if (result.items.length > 0) {
              const firstFileRef = result.items[0];
              getDownloadURL(firstFileRef)
                .then((url) => {
                  setImageURL(url);
                  //console.log(url,imageURL)
                })
                .catch((error) => {
                  console.error('Error fetching studio icon:', error);
                });
            } else {
              console.log('No files found in the folder.');
            }
          })
          .catch((error) => {
            console.error('Error listing files in the folder:', error);
          });
        } catch (error) {
          console.error('Error fetching image URL:', error);
        }
      }
      
    };

    getImageURL();
  }, []);


  return (
    <Card style={cardStyle}>
      
      <Card.Body>
        
          <Row>
            <Col md={4}>
              {imageURL ? (
                <Card.Img variant="top" src={imageURL} alt="Instructor" style={imgStyle} />
              ) : (
                <div style={defaultImgStyle}>
                  <span style={{ color: isDarkModeOn ? 'white' : 'black' }}></span>
                </div>
              )}
            </Col>
            <Col md={6}>
              <h style={{ color: isDarkModeOn ? 'white' : 'white' }}>Instructor</h>
              <br></br>
              <span style={{ color: isDarkModeOn ? 'white' : 'white' }}>{instructor.name}</span>
            </Col>
          </Row>
          <br></br>
          <Row>
        <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '8px' }} >{` ${instructor.id}`}</Card.Subtitle>
        
        <div>
          {instructor.description && (
                    <p style={{ fontSize: '14px' , color: isDarkModeOn ? 'white' : 'white'}}> {instructor.description} year(s)</p>
          )}
        </div>

        <div>
          {instructor.experience && (
                    <p style={{ fontSize: '12px', color: isDarkModeOn ? 'white' : 'white' }}>Exp: {instructor.experience} year(s)</p>

          )}
        </div>
        <div>
          {danceStyles.map((style, index) => (
            <Badge key={index} pill bg={isDarkModeOn ? 'light' : 'dark'} style={{ marginRight: '5px' }}>
              {style.trim()}
            </Badge>
          ))}
        </div>
        <div>
          {instructor.facebook && (
            <a href={instructor.facebook} target="_blank" rel="noopener noreferrer"  style={{ color: isDarkModeOn ? 'white' : 'black' }}>
              <FaFacebook style={{ marginRight: '1rem' }} />
            </a>
          )}
          {instructor.instagram && (
            <a href={instructor.instagram} target="_blank" rel="noopener noreferrer"  style={{ color: isDarkModeOn ? 'white' : 'black' }}>
              <FaInstagram style={{ marginRight: '1rem' }} />
            </a>
          )}
          {instructor.twitter && (
            <a href={instructor.twitter} target="_blank" rel="noopener noreferrer"  style={{ color: isDarkModeOn ? 'white' : 'black' }}>
              <FaTwitter style={{ marginRight: '1rem' }} />
            </a>
          )}
          {instructor.youtube && (
            <a href={instructor.youtube} target="_blank" rel="noopener noreferrer"  style={{ color: isDarkModeOn ? 'white' : 'black' }}>
              <FaYoutube style={{ marginRight: '1rem' }} />
            </a>
          )}
        </div>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default InstructorCard;
