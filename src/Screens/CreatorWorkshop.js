import dayjs from "dayjs";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { db } from "../config";
import { COLLECTIONS, STORAGES } from "../constants";
import { useLoader } from "../context/LoaderContext";
import { readDocumentWithImageUrl } from "../utils/firebaseUtils";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";

const WorkshopCard = ({ workshop }) => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const url = await readDocumentWithImageUrl(
          STORAGES.WORKSHOPICON,
          workshop.id
        );

        setImageUrl(
          url ||
            "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"
        );
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    };

    fetchImageUrl();
  }, [workshop.id]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        bgcolor: isDarkModeOn ? "#3C3C3C" : "inherit",
        cursor: "pointer",
        height: "100%",
      }}
    >
      <Link to={`/workshops/${workshop.id}`}>
        <CardMedia
          component="img"
          height="180"
          image={imageUrl}
          alt="Studio"
          sx={{ borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
        />

        <CardContent sx={{ height: "100%" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {workshop?.id}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              flexGrow: 1,
              color: isDarkModeOn ? "white" : "black",
            }}
          >
            {workshop.workshopName}
          </Typography>

          <Box display="flex" alignItems="center" sx={{ my: 1 }}>
            <LocationOnIcon fontSize="small" sx={{ color: "gray", mr: 0.5 }} />
            <Typography
              variant="body2"
              sx={{ color: isDarkModeOn ? "white" : "black" }}
            >
              {workshop?.venueDetails?.address ||
                workshop?.venueDetails?.mapAddress ||
                "N/A"}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1,
              color: isDarkModeOn ? "white" : "black",
            }}
          >
            Date Listed:{" "}
            {workshop?.createdAt
              ? dayjs(workshop.createdAt).format("YYYY-MM-DD")
              : "N/A"}{" "}
            | Date Updated:{" "}
            {workshop?.updatedAt
              ? dayjs(workshop?.updatedAt).format("YYYY-MM-DD")
              : "N/A"}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
};

export default function MyWorkshops() {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const navigate = useNavigate();
  const { setIsLoading } = useLoader();
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const [workshops, setWorkshops] = useState([]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkModeOn ? "dark" : "light",
        },
        typography: {
          fontFamily: '"Nunito Sans", sans-serif',
        },
      }),
    [isDarkModeOn]
  );

  useEffect(() => {
    const getWorkshopCreated = async () => {
      try {
        setIsLoading(true);

        const q = query(
          collection(db, COLLECTIONS.WORKSHOPS),
          where("UserId", "==", user?.UserId)
        );

        const querySnapshot = await getDocs(q);

        const workshopsOfUserPromise = querySnapshot.docs
          .filter((doc) => doc.data().workshopName)
          .map((doc) => ({ id: doc.id, ...doc.data() }));

        const workshopsOfUser = await Promise.all(workshopsOfUserPromise);

        setWorkshops(workshopsOfUser);
      } finally {
        setIsLoading(false);
      }
    };

    getWorkshopCreated();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: isDarkModeOn ? "white" : "black" }}
          >
            My Workshops
          </Typography>
          <Button
            onClick={() => navigate("/workshops/create")}
            variant="contained"
            color="secondary"
            sx={{
              bgcolor: "#67569E",
              color: "white",
              textTransform: "capitalize",
              "&:hover": { bgcolor: "#67569E", color: "white" },
            }}
          >
            Add Workshop
          </Button>
        </Box>

        {workshops.length > 0 ? (
          <Grid container spacing={3} mt={1}>
            {workshops.map((workshop, index) => (
              <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                <WorkshopCard workshop={workshop} />
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Box>
    </ThemeProvider>
  );
}

// import React from "react";
// import { useState, useEffect } from "react";
// import { db } from "../config";
// import { doc, getDoc, collection, where, getDocs, query,updateDoc} from "firebase/firestore";
// import { COLLECTIONS } from "../constants";
// import { useSelector } from "react-redux";
// import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
// import { useAuth } from "../context/AuthContext";
// import Tab from "@mui/material/Tab";
// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import TabPanel from "@mui/lab/TabPanel";
// import { Box } from "@mui/material";
// import WorkshopAdd from "../Components/WorkshopAdd";
// import WorkshopUpdate from "../Components/WorkshopUpdate";
// import CardSlider from "../Components/WorkshopCardSlider";

// function CreatorWorkshop() {
//   const [studioId, setStudioId] = useState([]);
//   const [workshop, setWorkshop] = useState([]);
//   const [workshopId, setWorkshopId] = useState([]);
//   const isDarkModeOn = useSelector(selectDarkModeStatus);
//   const [instructors, setInstructors] = useState([]);
//   const [isCreator, setIsCreator] = useState(false);
//   const [premiumTill, setPremiumTill] = useState(-1);
//   const { currentUser } = useAuth();
//   const [value, setValue] = React.useState("1");

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const activateWorkshop = async (workshopId) => {
//     try {
//       const docRef = doc(db, COLLECTIONS.WORKSHOPS, workshopId);
//       await updateDoc(docRef, { active: true });

//       setWorkshop((prev) =>
//         prev.map((workshop) =>
//           workshop.id === workshopId ? { ...workshop, active: true } : workshop
//         )
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const deactivateWorkshop = async (workshopId) => {
//     try {
//       const docRef = doc(db, COLLECTIONS.WORKSHOPS, workshopId);
//       await updateDoc(docRef, { active: false });

//       setWorkshop((prev) =>
//         prev.map((workshop) =>
//           workshop.id === workshopId ? { ...workshop, active: false } : workshop
//         )
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     const getCreatorMode = async (event) => {
//       try {
//         const userRef = doc(db, "User", currentUser.uid);
//         const userSnap = await getDoc(userRef);
//         if (userSnap.exists()) {
//           if (userSnap.data() != null) {
//             setIsCreator(userSnap.data().CreatorMode);
//             setPremiumTill(userSnap.data().isPremium);
//           }
//         }
//       } catch (error) {
//         console.log(" error");
//       }
//     };

//     getCreatorMode();
//   }, [isCreator]);

//   useEffect(() => {
//     const fetchInstructors = async () => {
//       let userId = null;
//       if (
//         JSON.parse(localStorage.getItem("userInfo")) &&
//         JSON.parse(localStorage.getItem("userInfo")).UserId
//       ) {
//         userId = JSON.parse(localStorage.getItem("userInfo")).UserId;
//       }
//       if (!userId) {
//         alert("User not found");
//         return;
//       }

//       const instructorRef = collection(db, COLLECTIONS.INSTRUCTORS);
//       const q = query(instructorRef, where("createdBy", "==", userId));
//       const querySnapshot = await getDocs(q);

//       const instructorsList = [];
//       querySnapshot.forEach((doc) => {
//         instructorsList.push({
//           id: doc.id,
//           name: doc.data().name,
//         });
//       });
//       setInstructors(instructorsList);
//     };

//     fetchInstructors();
//   }, []);

//   useEffect(() => {
//     const getStudioCreated = async () => {
//       const q = query(
//         collection(db, COLLECTIONS.STUDIO),
//         where(
//           "UserId",
//           "==",
//           JSON.parse(localStorage.getItem("userInfo")).UserId
//         )
//       );

//       const querySnapshot = await getDocs(q);
//       const studiosOfUser = querySnapshot.docs
//         .filter((doc) => doc.data().studioName)
//         .map((doc) => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             ...data,
//           };
//         });
//       setStudioId(
//         studiosOfUser.map(
//           (studio) => String(studio.studioName) + " :" + String(studio.id)
//         )
//       );
//     };

//     getStudioCreated();
//   }, []);

//   useEffect(() => {
//     const getWorkshopCreated = async () => {
//       const q = query(
//         collection(db, COLLECTIONS.WORKSHOPS),
//         where(
//           "UserId",
//           "==",
//           JSON.parse(localStorage.getItem("userInfo")).UserId
//         )
//       );
//       const querySnapshot = await getDocs(q);
//       const workshopsOfUserPromise = querySnapshot.docs
//         .filter((doc) => doc.data().workshopName)
//         .map((doc) => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             ...data,
//           };
//         })
//         .map(async (workshop) => {
//           const docRef = doc(db, COLLECTIONS.STUDIO, workshop?.StudioId);
//           const docSnap = await getDoc(docRef);
//           return { ...workshop, studioDetails: docSnap.data() };
//         });
//       const workshopsOfUser = await Promise.all(workshopsOfUserPromise);
//       localStorage.setItem("WorkshopCreated", JSON.stringify(workshopsOfUser));
//       setWorkshop(workshopsOfUser);
//       setWorkshopId(
//         workshopsOfUser.map(
//           (workshop) =>
//             String(workshop.workshopName) + " :" + String(workshop.id)
//         )
//       );
//     };

//     getWorkshopCreated();
//   }, [setWorkshop]);

//   useEffect(() => {
//     const workshopsOfUser =
//       JSON.parse(localStorage.getItem("WorkshopCreated")) || [];
//     setWorkshop(workshopsOfUser);

//     const workshopIdList = workshopsOfUser.map(
//       (workshop) => `${workshop.workshopName} : ${workshop.id}`
//     );
//     setWorkshopId(workshopIdList);
//   }, [setWorkshopId]);

//   return (
//     <div>
//       <br></br>
//       {isCreator ? (
//         <>
//           <Box sx={{ width: "100%", typography: "body1" }}>
//             <TabContext value={value}>
//               <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//                 <TabList
//                   style={{ color: isDarkModeOn ? "white" : "black" }}
//                   onChange={handleChange}
//                   aria-label="lab API tabs example"
//                 >
//                   <Tab
//                     style={{ color: isDarkModeOn ? "white" : "black" }}
//                     label="Add Workshop"
//                     value="1"
//                   />
//                   <Tab
//                     style={{ color: isDarkModeOn ? "white" : "black" }}
//                     label="Update Workshop"
//                     value="2"
//                   />
//                 </TabList>
//               </Box>
//               <TabPanel value="1">
//                 <WorkshopAdd
//                   instructors={instructors}
//                   studioId={studioId}
//                   setWorkshop={setWorkshop}
//                 />
//               </TabPanel>
//               <TabPanel value="2">
//                 <>
//                   <WorkshopUpdate
//                     instructors={instructors}
//                     workshopId={workshopId}
//                     studioId={studioId}
//                   />
//                 </>
//               </TabPanel>
//             </TabContext>
//           </Box>
//         </>
//       ) : (
//         ""
//       )}

//       {workshop.length > 0 && (
//         <>
//           <h3 style={{ color: isDarkModeOn ? "white" : "black" }}>
//             Your Workshops
//           </h3>

//           <CardSlider
//             dataList={workshop}
//             activateWorkshop={activateWorkshop}
//             deactivateWorkshop={deactivateWorkshop}
//             actionsAllowed
//           />
//         </>
//       )}
//     </div>
//   );
// }
// export default CreatorWorkshop;
