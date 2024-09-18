import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import {
  Skeleton,
  Button as MUIButton,
} from "@mui/material";
import { COLLECTIONS } from "../constants";
import {
  faBolt,
  faMusic,
  faHiking,
  faGlassCheers,
} from "@fortawesome/free-solid-svg-icons"; // Import specific icons from Font Awesome
import "./LandingPage.css";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import CardSlider from "../Components/CardSlider";
import LocationComponent from "../Components/LocationComponent";
import { useNavigate } from "react-router-dom";
import DanceCarousel from "../Components/DanceCarousel";
import { getAllImagesInFolder } from "../utils/firebaseUtils";
import SearchIcon from "@mui/icons-material/Search";
import CardSlider2 from "../Components/CardSlider2";
import CardSliderNew from "../Components/CardSliderNew";

// Define the array of dance forms with their names and corresponding icons
const danceForms = [
  { name: "Bollywood", icon: faMusic },
  { name: "Bharatnatyam", icon: faMusic },
  { name: "Odisi", icon: faGlassCheers },
  { name: "Kathak", icon: faBolt },
  { name: "Salsa", icon: faGlassCheers },
  { name: "Hip Hop", icon: faBolt },
  { name: "Ballet", icon: faHiking },
  { name: "Jazz", icon: faHiking },
  { name: "Tango", icon: faHiking },
  { name: "Tap Dance", icon: faHiking },
];
const FILTER_DISTANCES_KEY = "filterDistances";
const FILTER_DANCE_FORMS_KEY = "filterDanceForms";

function LandingPage() {
  const [exploreEntity, setExploreEntity] = useState({
    [COLLECTIONS.STUDIO]:{}, [COLLECTIONS.WORKSHOPS]:{}, 
    [COLLECTIONS.OPEN_CLASSES]:{}, [COLLECTIONS.COURSES]:{}
  });
  const [studioIdName,setStudioIdName] = useState({});
  const [danceImagesUrl, setDanceImagesUrl] = useState([]);
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const navigate = useNavigate();

  const handleCardClick = (danceName) => {
    localStorage.removeItem(FILTER_DISTANCES_KEY);
    localStorage.setItem(FILTER_DANCE_FORMS_KEY, JSON.stringify([danceName]));
    if (localStorage.getItem(FILTER_DANCE_FORMS_KEY) === danceName) {
      //console.log("API LandingPage done", danceName);
    }
    setTimeout(() => {
      navigate("/search/studio");
    }, 100);
  };

  const FILTER_LOCATION_KEY = "filterLocation";
  const currentCity = localStorage.getItem(FILTER_LOCATION_KEY) || null;

  const cardStyle = {
    background: isDarkModeOn ? "#333333" : "white",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    cursor: "pointer",
  };

  const buttonStyle = {
    textTransform: "none",
    borderColor: isDarkModeOn ? "white" : "black",
    color: isDarkModeOn ? "white" : "black",
    borderWidth: "1px",
    height: "2rem",
    width: "100%",
  };

  useEffect(() => {

    const fetchAndSaveData = async (city, entities) => {
      try {
        const promises = entities.map(entity => {
          const apiEndpoint = `https://nrityaserver-2b241e0a97e5.herokuapp.com/api/search/?&city=${city}&entity=${entity}`;
          return fetch(apiEndpoint)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Network response for ${entity} was not ok`);
              }
              return response.json();
            })
            .then(data => ({ [entity]: data }));
        });
    
        const allData = await Promise.all(promises);
    
        // Combine the fetched data into a single object
        const combinedData = Object.assign({}, ...allData);
        setExploreEntity(combinedData);
        //console.log("All Fetched Data:", combinedData);
    
        // You can now save `combinedData` to your state or perform other operations
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    const fetchIdNameMp = async (city) => {
      try {
        const apiEndpoint = `https://nrityaserver-2b241e0a97e5.herokuapp.com/api/autocomplete/?&city=${city}`;
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const data = await response.json();
        setStudioIdName(data);
        
      } catch (error) {
        console.error("Error in processing:", error);
      }
    };
    

    const fetchData = async () => {
      
      try {
        let filterLocation = localStorage.getItem('filterLocation');
        if(filterLocation){
          if(filterLocation === "null"){
            filterLocation = 'New Delhi';
          }
        }else{
          filterLocation = 'New Delhi'
        }
        const entities = [COLLECTIONS.STUDIO, COLLECTIONS.WORKSHOPS, 
          COLLECTIONS.COURSES, COLLECTIONS.OPEN_CLASSES];
        fetchIdNameMp(filterLocation)
        fetchAndSaveData(filterLocation, entities);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();


    
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const dataImagesUrlLocal = await getAllImagesInFolder(
          "LandingPageImages"
        );
        //console.log("dataImagesUrlLocal:", dataImagesUrlLocal); // Debugging log
        if (Array.isArray(dataImagesUrlLocal)) {
          const imageUrlsArray = dataImagesUrlLocal.map(
            (image) => image.fileURL
          );
          setDanceImagesUrl(imageUrlsArray);
        } else {
          console.error("Expected an array but got:", dataImagesUrlLocal);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <Container className="my-0">
        <Row className="pb-1 pl-0 pr-0">
          {danceImagesUrl.length > 0 ? (
            <DanceCarousel danceImages={danceImagesUrl} />
          ) : (
            <Skeleton
              sx={{
                width: "100%",
                height: "40vh",
                bgcolor: isDarkModeOn ? "#202020" : "gray",
              }}
              variant="rectangular"
              animation="wave"
            />
          )}
        </Row>

        <Row hidden>
          {danceImagesUrl.length > 0 ? (
            <CardSlider2 dataList={danceImagesUrl} />
          ) : (
            <Skeleton
              sx={{
                width: "100%",
                height: "40vh",
                bgcolor: isDarkModeOn ? "#202020" : "gray",
              }}
              variant="rectangular"
              animation="wave"
            />
          )}
        </Row>

        <Row className="d-lg-none pb-2">
          <MUIButton
            endIcon={
              <SearchIcon style={{ color: isDarkModeOn ? "white" : "black" }} />
            }
            variant="outlined"
            className="me-2 rounded-3"
            href="#/search/studios"
            style={buttonStyle}
          >
            Search Studios in your city
          </MUIButton>
        </Row>
        
        <LocationComponent />

        <br />
          {exploreEntity[COLLECTIONS.STUDIO] && Object.keys(exploreEntity[COLLECTIONS.STUDIO]).length > 0 &&
            (
            <>
              <h3 style={{ color: isDarkModeOn ? "white" : "black", textTransform: "none" }}>
              Explore Studios
              </h3>
            <Row>
              <CardSlider dataList={exploreEntity[COLLECTIONS.STUDIO]} imgOnly={false} />
            </Row>
          </>
          )
        }
        {
          exploreEntity[COLLECTIONS.WORKSHOPS] && Object.keys(exploreEntity[COLLECTIONS.WORKSHOPS]).length > 0 ? (
            <>
            <h3 style={{ color: isDarkModeOn ? "white" : "black", textTransform: "none"  }}>
              Explore Workshops
            </h3>
            <Row>
              <CardSliderNew dataList={exploreEntity[COLLECTIONS.WORKSHOPS]} studioIdName = {studioIdName} type={COLLECTIONS.WORKSHOPS} />
            </Row>
            </>
          ) : null
        }

      {
          exploreEntity[COLLECTIONS.OPEN_CLASSES] && Object.keys(exploreEntity[COLLECTIONS.OPEN_CLASSES]).length > 0 ? (
            <>
            <h3 style={{ color: isDarkModeOn ? "white" : "black", textTransform: "none"  }}>
              Explore Open Classes
            </h3>
            <Row>
              <CardSliderNew dataList={exploreEntity[COLLECTIONS.OPEN_CLASSES]} studioIdName = {studioIdName} type={COLLECTIONS.OPEN_CLASSES} />
            </Row>
            </>
          ) : null
        }

      {
          exploreEntity[COLLECTIONS.COURSES] && Object.keys(exploreEntity[COLLECTIONS.COURSES]).length > 0 ? (
            <>
            <h3 style={{ color: isDarkModeOn ? "white" : "black", textTransform: "none"  }}>
              Explore Courses 
            </h3>
            <Row>
              <CardSliderNew dataList={exploreEntity[COLLECTIONS.COURSES]} studioIdName = {studioIdName} type={COLLECTIONS.COURSES} />
            </Row>
            </>
          ) : null
        }


        <br />
        <h3 style={{ color: isDarkModeOn ? "white" : "black", textTransform: "none"  }}>
          BROWSE BY DANCE FORMS
        </h3>
        <Row>
          {danceForms.map((danceForm, index) => (
            <Col key={index} sm={6} md={4} lg={3}>
              <Card
                className="card-hover"
                style={cardStyle}
                onClick={() => handleCardClick(danceForm.name)}
              >
                <Card.Body style={{ textAlign: "center" }}>
                  <h4 style={{ color: isDarkModeOn ? "white" : "black" }}>
                    {danceForm.name}
                  </h4>
                </Card.Body>
              </Card>
              <br></br>
            </Col>
          ))}
        </Row>
        
      </Container>
    </div>
  );
}

export default LandingPage;
