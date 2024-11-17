import React, { useState, useEffect,lazy, Suspense } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Skeleton from "@mui/material/Skeleton";
import MUIButton from "@mui/material/Button";
import { COLLECTIONS } from "../constants";
import {faBolt,faMusic,faHiking,faGlassCheers,} from "@fortawesome/free-solid-svg-icons";
import "./LandingPage.css";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import LocationComponent from "../Components/LocationComponent";
import { useNavigate } from "react-router-dom";
import { getAllFilesFromFolder } from "../utils/firebaseUtils";
import SearchIcon from "@mui/icons-material/Search";
import { BASEURL_PROD } from "../constants";
import { firebaseConfig, envType } from "../config";


const DanceCarousel = lazy(() => import("../Components/DanceCarousel"));
const CardSlider = lazy(() => import('../Components/CardSlider'));
const CardSliderNew = lazy(() => import('../Components/CardSliderNew'));

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
    const retryFetch = async (url, options = {}, retries = 10, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`Network response was not ok`);
                }
                return await response.json();
            } catch (error) {
                if (i < retries - 1) {
                    console.warn(`Retrying after ${delay} fetch (${i + 1}/${retries}) for ${url} due to error:`, error);
                    await new Promise(res => setTimeout(res, delay)); // wait before retrying
                    delay *= 1.5;
                } else {
                    throw error; // Throw error after exhausting retries
                }
            }
        }
    };

    const fetchAndSaveData = async (city, entities) => {
        try {
            const promises = entities.map(entity => {
                const apiEndpoint = `${BASEURL_PROD}api/search/?&city=${city}&entity=${entity}`;
                return retryFetch(apiEndpoint)
                    .then(data => ({ [entity]: data }));
            });

            const allData = await Promise.all(promises);
            const combinedData = Object.assign({}, ...allData);
            return combinedData;
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    };

    const fetchIdNameMp = async (city) => {
        try {
            const apiEndpoint = `${BASEURL_PROD}api/autocomplete/?&city=${city}`;
            return await retryFetch(apiEndpoint);
        } catch (error) {
            console.error("Error in processing:", error);
            throw error;
        }
    };

    const fetchData = async () => {
        try {
            let filterLocation = localStorage.getItem("filterLocation");
            if (!filterLocation || filterLocation === "null") {
                filterLocation = "New Delhi";
            }

            const entities = [COLLECTIONS.STUDIO, COLLECTIONS.WORKSHOPS, COLLECTIONS.COURSES, COLLECTIONS.OPEN_CLASSES];

            // Fetch both `fetchIdNameMp` and `fetchAndSaveData` concurrently
            const [studioIdNameData, exploreEntityData] = await Promise.all([
                fetchIdNameMp(filterLocation),
                fetchAndSaveData(filterLocation, entities),
            ]);

            setStudioIdName(studioIdNameData);
            setExploreEntity(exploreEntityData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();
}, []);

  

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const dataImagesUrlLocal = await getAllFilesFromFolder(
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
  console.log("ENV:",envType,)
  console.log("ENV URL:",BASEURL_PROD);
  console.log("FIREBASE_ENV:",firebaseConfig);
  return (
    <div>
      <Container className="my-0">
        <Row className="pb-1 pl-0 pr-0">
          <Suspense fallback={<Skeleton width="100%" height="40vh" variant="rectangular" />}>
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
            </Suspense>
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
            Search
          </MUIButton>
        </Row>
        
        <LocationComponent />

        <br />
          {/* Studios Section */}
      {exploreEntity[COLLECTIONS.STUDIO] && Object.keys(exploreEntity[COLLECTIONS.STUDIO]).length > 0 && (
        <>
          <h3 style={{ color: isDarkModeOn ? "white" : "black", textTransform: "none" }}>
            Explore Studios
          </h3>
          <Row>
            {/* Wrap CardSlider with Suspense */}
            <Suspense fallback={<div>Loading Studios...</div>}>
              <CardSlider dataList={exploreEntity[COLLECTIONS.STUDIO]} imgOnly={false} />
            </Suspense>
          </Row>
        </>
      )}

      {/* Workshops Section */}
      {exploreEntity[COLLECTIONS.WORKSHOPS] && Object.keys(exploreEntity[COLLECTIONS.WORKSHOPS]).length > 0 && (
        <>
          <h3 style={{ color: isDarkModeOn ? "white" : "black", textTransform: "none" }}>
            Explore Workshops
          </h3>
          <Row>
            <Suspense fallback={<div>Loading Workshops...</div>}>
              <CardSliderNew dataList={exploreEntity[COLLECTIONS.WORKSHOPS]} studioIdName={studioIdName} type={COLLECTIONS.WORKSHOPS} />
            </Suspense>
          </Row>
        </>
      )}

      {/* Open Classes Section */}
      {exploreEntity[COLLECTIONS.OPEN_CLASSES] && Object.keys(exploreEntity[COLLECTIONS.OPEN_CLASSES]).length > 0 && (
        <>
          <h3 style={{ color: isDarkModeOn ? "white" : "black", textTransform: "none" }}>
            Explore Open Classes
          </h3>
          <Row>
            <Suspense fallback={<div>Loading Open Classes...</div>}>
              <CardSliderNew dataList={exploreEntity[COLLECTIONS.OPEN_CLASSES]} studioIdName={studioIdName} type={COLLECTIONS.OPEN_CLASSES} />
            </Suspense>
          </Row>
        </>
      )}

      {/* Courses Section */}
      {exploreEntity[COLLECTIONS.COURSES] && Object.keys(exploreEntity[COLLECTIONS.COURSES]).length > 0 && (
        <>
          <h3 style={{ color: isDarkModeOn ? "white" : "black", textTransform: "none" }}>
            Explore Courses
          </h3>
          <Row>
            <Suspense fallback={<div>Loading Courses...</div>}>
              <CardSliderNew dataList={exploreEntity[COLLECTIONS.COURSES]} studioIdName={studioIdName} type={COLLECTIONS.COURSES} />
            </Suspense>
          </Row>
        </>
      )}

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
