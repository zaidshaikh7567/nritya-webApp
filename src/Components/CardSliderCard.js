import React, {useEffect,useState} from 'react';
import { Card, Badge } from 'react-bootstrap';
import { readDocumentWithImageUrl } from '../utils/firebaseUtils';
import { STORAGES } from '../constants';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import StarRating from './StarRating';
import NStudioCard from './NStudioCard';
//import './CardSliderCard.css'

const CardSliderCard = ({ studio }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const isDarkModeOn = useSelector(selectDarkModeStatus);

  
  console.log('Debug from CardSliderCard',studio.id,studio)
    const  cardSliderClass = isDarkModeOn? 'cardSliderData dark':'cardSliderData';
  return (
    <a href={`#/studio/${studio.id}`}>
    <NStudioCard data={studio} img_src={"https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"}/>
    </a>
    /*
    <a href={`#/studio/${studio.id}`}>
      
    <Card className={cardSliderClass} style={{borderRadius:'1rem'}}>
        <Card.Header>
        <Card.Img  src={imageUrl? imageUrl :"https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"} alt={`Studio ${studio.id}`} />
        </Card.Header>
        
        <Card.Body>
            <p style={{color: isDarkModeOn?'white':'black' }}>{studio.studioName}</p>
            {studio && studio.danceStyles && studio.danceStyles.split(",").map((form, index) => (
            <Badge
              key={index}
              bg={index % 2 === 0 ? "danger" : "info"} // Alternate badge colors
              className="me-2 rounded-pill"
              style={{ marginBottom: "10px", fontSize: '0.8rem' }}
            >
              {form.trim()}
            </Badge>
          ))}
            <StarRating rating={studio.avgRating} viewMode={true}/>
            
        </Card.Body>
    </Card>
    
    </a>
    */

  );
};

export default CardSliderCard;
