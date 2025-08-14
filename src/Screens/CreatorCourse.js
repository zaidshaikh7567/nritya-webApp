import React from "react";
import { useState, useEffect } from "react";
import { db } from "../config";
import {doc,getDoc,collection,where,getDocs,query,updateDoc} from "firebase/firestore";
import { COLLECTIONS } from "../constants";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { useAuth } from "../context/AuthContext";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box } from "@mui/material";
import CardSlider from "../Components/CourseCardSlider";
import CourseAdd from "../Components/CourseAdd";
import CourseUpdate from "../Components/CourseUpdate";

function CreatorCourse() {
  const [studioId, setStudioId] = useState([]);
  const [courses, setCourses] = useState([]);
  const [coursesId, setCoursesId] = useState([]);
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [instructors, setInstructors] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [premiumTill, setPremiumTill] = useState(-1);
  const { currentUser } = useAuth();
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const activateCourse = async (courseId) => {
    try {
      const docRef = doc(db, COLLECTIONS.COURSES, courseId);
      await updateDoc(docRef, { active: true });

      setCourses((prev) =>
        prev.map((courses) =>
          courses.id === courseId ? { ...courses, active: true } : courses
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deactivateCourse = async (courseId) => {
    try {
      const docRef = doc(db, COLLECTIONS.COURSES, courseId);
      await updateDoc(docRef, { active: false });

      setCourses((prev) =>
        prev.map((courses) =>
          courses.id === courseId ? { ...courses, active: false } : courses
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getCreatorMode = async (event) => {
      if (!currentUser) {
        console.log('No current user, skipping creator mode fetch');
        return;
      }
      
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
    const getCoursesCreated = async () => {
      const q = query(
        collection(db, COLLECTIONS.COURSES),
        where(
          "UserId",
          "==",
          JSON.parse(localStorage.getItem("userInfo")).UserId
        )
      );
      const querySnapshot = await getDocs(q);
      const coursesOfUserPromise = querySnapshot.docs
        .filter((doc) => doc.data().courseName)
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        }).map(async (courses) => {
          const docRef = doc(db, COLLECTIONS.STUDIO, courses?.StudioId);
          const docSnap = await getDoc(docRef);
          return { ...courses, studioDetails: docSnap.data() };
        });
      const coursesOfUser = await Promise.all(coursesOfUserPromise);
      localStorage.setItem("CourseCreated", JSON.stringify(coursesOfUser));
      setCourses(coursesOfUser);
      setCoursesId(
        coursesOfUser.map(
          (courses) => String(courses.courseName) + " :" + String(courses.id)
        )
      );
    };

    getCoursesCreated();
  }, [setCourses]);

  useEffect(() => {
    const coursesOfUser =
      JSON.parse(localStorage.getItem("CourseCreated")) || [];
      setCourses(coursesOfUser);

    const coursesIdList = coursesOfUser.map(
      (courses) => `${courses.courseName} : ${courses.id}`
    );
    setCoursesId(coursesIdList);
  }, [setCoursesId]);

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
                    label="Add Course"
                    value="1"
                  />
                  <Tab
                    style={{ color: isDarkModeOn ? "white" : "black" }}
                    label="Update Course"
                    value="2"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">
                <CourseAdd
                  instructors={instructors}
                  studioId={studioId}
                  setCourses={setCourses}
                />
              </TabPanel>
              <TabPanel value="2">
                <>
                  <CourseUpdate
                    instructors={instructors}
                    courseId={coursesId}
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

      {courses.length > 0 && (
        <>
          <h3 style={{ color: isDarkModeOn ? "white" : "black" }}>
            Your Courses
          </h3>

          <CardSlider
            dataList={courses}
            activateCourse={activateCourse}
            deactivateCourse={deactivateCourse}
            actionsAllowed
          />
        </>
      )}
    </div>
  );
}
export default CreatorCourse;
