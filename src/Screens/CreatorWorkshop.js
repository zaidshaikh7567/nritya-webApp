import React from "react";
import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { db } from "../config";
import {
  doc,
  getDoc,
  collection,
  where,
  getDocs,
  query,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { COLLECTIONS } from "../constants";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { useAuth } from "../context/AuthContext";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box } from "@mui/material";
import WorkshopAdd from "../Components/WorkshopAdd";
import WorkshopUpdate from "../Components/WorkshopUpdate";
import CardSlider from "../Components/WorkshopCardSlider";

function CreatorWorkshop() {
  const [studioId, setStudioId] = useState([]);
  const [workshop, setWorkshop] = useState([]);
  const [workshopId, setWorkshopId] = useState([]);
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [instructors, setInstructors] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [premiumTill, setPremiumTill] = useState(-1);
  const { currentUser } = useAuth();
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const deleteWorkshop = async (workshopId) => {
    try {
      const docRef = doc(db, COLLECTIONS.WORKSHOPS, workshopId);
      await deleteDoc(docRef);

      const userRef = doc(db, COLLECTIONS.USER, currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        if (userSnap.data() != null) {
          await updateDoc(userRef, {
            WorkshopCreated: userSnap
              .data()
              .WorkshopCreated.filter((workshop) => workshop.id !== workshopId),
          });
        }
      }

      setWorkshop((prev) =>
        prev.filter((workshop) => workshop.id !== workshopId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getCreatorMode = async (event) => {
      try {
        const userRef = doc(db, "User", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          if (userSnap.data() != null) {
            setIsCreator(userSnap.data().CreatorMode);
            setPremiumTill(userSnap.data().isPremium);
          }
        }
      } catch (error) {
        console.log(" error");
      }
    };

    getCreatorMode();
  }, [isCreator]);

  useEffect(() => {
    const fetchInstructors = async () => {
      let userId = null;
      if (
        JSON.parse(localStorage.getItem("userInfo")) &&
        JSON.parse(localStorage.getItem("userInfo")).UserId
      ) {
        userId = JSON.parse(localStorage.getItem("userInfo")).UserId;
      }
      if (!userId) {
        alert("User not found");
        return;
      }

      const instructorRef = collection(db, COLLECTIONS.INSTRUCTORS);
      const q = query(instructorRef, where("createdBy", "==", userId));
      const querySnapshot = await getDocs(q);

      const instructorsList = [];
      querySnapshot.forEach((doc) => {
        instructorsList.push({
          id: doc.id,
          name: doc.data().name,
        });
      });
      setInstructors(instructorsList);
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    const getStudioCreated = async () => {
      const q = query(
        collection(db, COLLECTIONS.STUDIO),
        where(
          "UserId",
          "==",
          JSON.parse(localStorage.getItem("userInfo")).UserId
        )
      );

      const querySnapshot = await getDocs(q);
      const studiosOfUser = querySnapshot.docs
        .filter((doc) => doc.data().studioName)
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        });
      setStudioId(
        studiosOfUser.map(
          (studio) => String(studio.studioName) + " :" + String(studio.id)
        )
      );
    };

    getStudioCreated();
  }, []);

  useEffect(() => {
    const getWorkshopCreated = async () => {
      const q = query(
        collection(db, COLLECTIONS.WORKSHOPS),
        where(
          "UserId",
          "==",
          JSON.parse(localStorage.getItem("userInfo")).UserId
        )
      );
      const querySnapshot = await getDocs(q);
      const workshopsOfUser = querySnapshot.docs
        .filter((doc) => doc.data().workshopName)
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        });
      localStorage.setItem("WorkshopCreated", JSON.stringify(workshopsOfUser));
      setWorkshop(workshopsOfUser);
      setWorkshopId(
        workshopsOfUser.map(
          (workshop) =>
            String(workshop.workshopName) + " :" + String(workshop.id)
        )
      );
    };

    getWorkshopCreated();
  }, [setWorkshop]);

  useEffect(() => {
    const workshopsOfUser =
      JSON.parse(localStorage.getItem("WorkshopCreated")) || [];
    setWorkshop(workshopsOfUser);

    const workshopIdList = workshopsOfUser.map(
      (workshop) => `${workshop.workshopName} : ${workshop.id}`
    );
    setWorkshopId(workshopIdList);
  }, [setWorkshopId]);

  return (
    <div>
      <br></br>
      {isCreator ? (
        <>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  style={{ color: isDarkModeOn ? "white" : "black" }}
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    style={{ color: isDarkModeOn ? "white" : "black" }}
                    label="Add Workshop"
                    value="1"
                  />
                  <Tab
                    style={{ color: isDarkModeOn ? "white" : "black" }}
                    label="Update Workshop"
                    value="2"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">
                <WorkshopAdd
                  instructors={instructors}
                  studioId={studioId}
                  setWorkshop={setWorkshop}
                />
              </TabPanel>
              <TabPanel value="2">
                <>
                  <WorkshopUpdate
                    instructors={instructors}
                    workshopId={workshopId}
                    studioId={studioId}
                  />
                </>
              </TabPanel>
            </TabContext>
          </Box>
        </>
      ) : (
        ""
      )}

      {workshop.length > 0 && (
        <>
          <h3 style={{ color: isDarkModeOn ? "white" : "black" }}>
            Your Workshops
          </h3>

          <CardSlider dataList={workshop} deleteWorkshop={deleteWorkshop} actionsAllowed />
        </>
      )}
    </div>
  );
}
export default CreatorWorkshop;
