import React, { useState, useEffect } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../config';
import { STORAGES } from '../constants';
import { FaMapMarker } from 'react-icons/fa';
import StarRating from './StarRating';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import './StudioCard.css'

const SmallCard = ({ studioName,studioAddress,studioDanceStyles,studioId,averageRating }) => {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [studioIconUrl, setStudioIconUrl] = useState(null);
  console.log(averageRating,studioName)
  useEffect(() => {
    // Fetch and set the studio icon URL using studioId
    if (studioId) {
      const storagePath = `${STORAGES.STUDIOICON}/${studioId}`;
      const folderRef = ref(storage, storagePath);

      try {
        listAll(folderRef)
          .then((result) => {
            if (result.items.length > 0) {
              const firstFileRef = result.items[0];
              getDownloadURL(firstFileRef)
                .then((url) => {
                  setStudioIconUrl(url);
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
        console.error('Error fetching studio icon:', error);
      }
    }
  }, [studioId]);
  return (
    <Card className={`cardContainer ${isDarkModeOn ? 'darkMode' : ''}`} style={{borderRadius: "1rem"}}>
            <Card.Img className={`cardImg ${isDarkModeOn ? 'darkMode' : ''}`}
                
                    src={studioIconUrl ? studioIconUrl : "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"}
                    
                    alt="Studio Icon">
                
            </Card.Img>
                <Card.Body className="cardBody">
                    <Card.Text className="cardText">{studioName}</Card.Text>
                    {studioDanceStyles && studioDanceStyles.split(",").slice(0, 3).map((form, index) => (
                                  <Badge
                                  key={index}
                                  bg={index % 2 === 0 ? "danger" : "warning"}
                                  className="badge me-2 rounded-pill"
                                >
                                  {form.trim()}
                                </Badge>
                    ))}
                    <StarRating rating={averageRating} viewMode={true} />
                    <div className="starRatingContainer">
                        <FaMapMarker size={14} className="mapMarkerIcon me-2" />
                        <div  className="cardText">{studioAddress}</div>
                    </div>
                </Card.Body>
    </Card>

  );
};

export default SmallCard;
