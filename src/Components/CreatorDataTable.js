import React, { useState, useEffect } from 'react';
import { BASEURL_PROD, BASEURL_DEV, COLLECTIONS } from '../constants';
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';



const CreatorDataTable = () => {
  const [studios, setStudios] = useState(null);
  const [selectedStudio, setSelectedStudio] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingsData, setBookingsData] = useState(null);
  const [entityFilter, setEntityFilter] = useState(''); // Filter for entity type
  const user_id = JSON.parse(localStorage.getItem('userInfo')).UserId;
  const BASEURL = BASEURL_PROD;
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  console.log("DataDashboard isDarkModeOn",isDarkModeOn)
  const themeStyles = {
    backgroundColor: isDarkModeOn ? 'black' : '#f5f5f5',
    color: isDarkModeOn ? '#d3d3d3' : '#000000'
  };

  const darkTheme = createTheme({
    palette: {
      mode: isDarkModeOn ? "dark" : "light",
    },
  });

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const response = await fetch(`${BASEURL}reports/getAllOwnerStudio?user_id=${user_id}`);
        const data = await response.json();
        setStudios(data);
      } catch (error) {
        console.error('Error fetching studios:', error);
      }
    };
    fetchStudios();
  }, [user_id]);

  const handleStudioChange = async (e) => {
    const studioId = e.target.value;
    console.log("DataDashboard studioId",studioId)
    setSelectedStudio(studioId);
    setLoading(true);

    if (studioId) {
      try {
        const response = await fetch(`${BASEURL}reports/studioEntityBookingsReport?studio_id=${studioId}`);
        const data = await response.json();
        setBookingsData(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    } else {
      setBookingsData(null);
    }
    setLoading(false)
  };

  const handleEntityFilterChange = (e) => {
    console.log("DataDashboard setEntityFilter",e.target.value)
    setEntityFilter(e.target.value);
  };

  const getEntityLink = (entity) => {
    const baseLink = "https://nritya-official.github.io/nritya-webApp/#/";
    const { EntityType, EntityId } = entity;

    switch (EntityType) {
      case 'Workshop':
        return `${baseLink}workshop/${EntityId}`;
      case 'Open Class':
        return `${baseLink}openClass/${EntityId}`;
      case 'Course':
        return `${baseLink}course/${EntityId}`;
      default:
        return '#';
    }
  };

  const renderTable = (loading) => {
    if (!bookingsData) return null;

    const { WORKSHOPS, OPEN_CLASSES, COURSES } = bookingsData;
    const allEntities = [
      ...WORKSHOPS.map(workshop => ({
        EntityName: workshop.EntityName,
        EntityType: 'Workshop',
        Date: workshop.Date,
        Capacity: workshop.Capacity,
        Booked: workshop.BookingsCount,
        SlotsLeft: workshop.Capacity - workshop.BookingsCount,
        EntityId: workshop.EntityId
      })),
      ...OPEN_CLASSES.map(openClass => ({
        EntityName: openClass.EntityName,
        EntityType: 'Open Class',
        Date: openClass.Date,
        Capacity: openClass.Capacity,
        Booked: openClass.BookingsCount,
        SlotsLeft: openClass.Capacity - openClass.BookingsCount,
        EntityId: openClass.EntityId
      })),
      ...COURSES.map(course => ({
        EntityName: course.EntityName,
        EntityType: 'Course',
        Date: course.Date,
        Capacity: 'N/A',
        Booked: course.BookingsCount,
        SlotsLeft: 'N/A',
        EntityId: course.EntityId
      })),
    ];

    const filteredEntities = entityFilter
      ? allEntities.filter(entity => entity.EntityType === entityFilter)
      : allEntities;
      const columns = [
        { 
          field: 'entityName', 
          headerName: 'Entity Name', 
          flex: 1, 
          renderCell: (params) => (
            <a 
              href={getEntityLink(params.row)} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: isDarkModeOn ? '#90caf9' : '#1976d2' }}>
              {params.value}
            </a>
          )
        },
        { 
          field: 'entityType', 
          headerName: 'Entity Type', 
          flex: 1 
        },
        { 
          field: 'date', 
          headerName: 'Date', 
          flex: 1 
        },
        { 
          field: 'capacity', 
          headerName: 'Capacity', 
          flex: 1 
        },
        { 
          field: 'booked', 
          headerName: 'Booked', 
          flex: 1 
        },
        { 
          field: 'slotsLeft', 
          headerName: 'Slots Left', 
          flex: 1 
        },
      ];
      
      const rows = filteredEntities.map((entity, index) => ({
        id: index, // or entity.id if you have a unique ID
        entityName: entity?.EntityName,
        entityType: entity?.EntityType,
        date: entity?.Date,
        capacity: entity?.Capacity,
        booked: entity?.Booked,
        slotsLeft: entity?.SlotsLeft,
      }));
     
    console.log(allEntities)
    return ( studios &&
     
      (
        <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <Paper style={themeStyles}>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              loading = {loading}
              initialState={{
                sorting: {
                  sortModel: [{ field: 'Date', sort: 'desc' }],
                },
              }}
              disableSelectionOnClick
              slotProps={{ toolbar: { csvOptions: { allColumns: true } } }} 
              
            />
          </div>
        </Paper>
        </ThemeProvider>
      )
    );
  };


  return ( studios &&
    <div >
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Typography variant="h4" component="h3" gutterBottom sx={{textTransform: "none", color:isDarkModeOn?'white':'black'}}>Data Dashboard</Typography>

      <div className="flex-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      
     
      
  <FormControl fullWidth sx={{marginBottom: '20px', flex: '1 1 clamp(300px, 30%, 20rem)' }}>
    <InputLabel id="studio-select-label" sx={{color: isDarkModeOn ? '#ffffff' : '#000000'}} >Select Studio</InputLabel>
    <Select
      labelId="studio-select-label"
      id="studio-select"
      value={selectedStudio}
      label="Select Studio"
      onChange={handleStudioChange}
    
    >
      <MenuItem value="" sx={{color: isDarkModeOn ? '#ffffff' : '#000000'}}>
        <em sx={{color: isDarkModeOn ? '#ffffff' : '#000000'}} >--Select a Studio--</em>
      </MenuItem>
      {studios && Object.entries(studios).map(([id, name]) => (
        <MenuItem key={id} value={id}>{name}</MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl fullWidth style={{ 
    marginBottom: '20px', flex: '1 1 clamp(300px, 30%, 20rem)' }}>
    <InputLabel id="entity-filter-label"sx={{color: isDarkModeOn ? '#ffffff' : '#000000'}} >Filter by Entity Type</InputLabel>
    <Select
      labelId="entity-filter-label"
      id="entity-filter"
      value={entityFilter}
      label="Filter by Entity Type"
      onChange={handleEntityFilterChange}
     
    >
      <MenuItem value="" sx={{color: isDarkModeOn ? '#ffffff' : '#000000'}}><em sx={{color: isDarkModeOn ? '#ffffff' : '#000000'}}>All Entities</em></MenuItem>
      <MenuItem value="Workshop">Workshop</MenuItem>
      <MenuItem value="Open Class">Open Class</MenuItem>
      <MenuItem value="Course">Course</MenuItem>
    </Select>
  </FormControl>
 
</div>
</ThemeProvider>

      {renderTable(loading)}
      {loading && <LinearProgress/>}
    </div>
    
  );
};

export default CreatorDataTable;
