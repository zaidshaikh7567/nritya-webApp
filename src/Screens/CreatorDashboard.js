import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { useAuth } from '../context/AuthContext';
import { queryDocumentsCount } from '../utils/firebaseUtils';
import { COLLECTIONS } from '../constants';
import { green } from '@mui/material/colors';
import { Card, CardContent, CardActionArea, Typography, Grid, Icon, Stack } from '@mui/material';
import { loadCSS } from 'fg-loadcss';

function CreatorDashboard() {
  const [counts, setCounts] = useState({
    instructorsCount: 0,
    studiosCount: 0,
    workshopsCount: 0,
    openClassesCount: 0,
    coursesCount: 0,
  });
  
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCounts = async () => {
      const instructorsCount = await queryDocumentsCount(COLLECTIONS.INSTRUCTORS, 'createdBy', '==', currentUser.uid);
      const studiosCount = await queryDocumentsCount(COLLECTIONS.STUDIO, "UserId", '==', currentUser.uid);
      const workshopsCount = await queryDocumentsCount(COLLECTIONS.WORKSHOPS, "UserId", '==', currentUser.uid);
      const openClassesCount = await queryDocumentsCount(COLLECTIONS.OPEN_CLASSES, "UserId", '==', currentUser.uid);
      const coursesCount = await queryDocumentsCount(COLLECTIONS.COURSES, "UserId", '==', currentUser.uid);

      setCounts({ 
        instructorsCount, 
        studiosCount, 
        workshopsCount, 
        openClassesCount, 
        coursesCount 
      });
    };

    fetchCounts();
  }, [currentUser]);

  const cardItems = [
    { title: "Total Studios", data: counts.studiosCount, link: "#/modifyStudios" },
    { title: "Total Instructors", data: counts.instructorsCount, link: "#/modifyInstructors" },
    { title: "Total Workshops", data: counts.workshopsCount, link: "#/modifyWorkshops" },
    { title: "Total Open Classes", data: counts.openClassesCount, link: "#/modifyOpenClasses" },
    { title: "Total Courses", data: counts.coursesCount, link: "#/modifyCourses" }
  ];


  return (
    <div style={{ minHeight: "75vh" }}>
      <Typography variant="h4" style={{ color: isDarkModeOn ? "white" : "black", textTransform: 'capitalize' }}>
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        {cardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{backgroundColor:isDarkModeOn?"black":"white"}}>
              <CardContent >
                <Typography variant="h6" component="div" sx={{color:isDarkModeOn?"white":"black"}}>
                  <>
                    {item.title}
                    <a href={item.link} >
                      <Icon baseClassName="fas" className="fa-plus-circle" color="primary" />
                    </a>
                  </>
                </Typography>
                <Typography variant="h4" sx={{color:isDarkModeOn?"white":"black"}} >{item.data}</Typography>
                
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default CreatorDashboard;
