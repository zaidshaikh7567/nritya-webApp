import React, {useState,useEffect} from 'react';
import {  Stepper, Step, StepLabel, Box, Typography, Paper, ThemeProvider, createTheme, Divider } from '@mui/material';
import { useSelector } from 'react-redux'; 
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';

import { styled } from '@mui/material/styles';

import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { readDocument } from '../utils/firebaseUtils';
import { STATUSES,COLLECTIONS } from '../constants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Spinner } from 'react-bootstrap';
import './KycStepper.css'

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: 'green',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: 'green',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));


const stages = [STATUSES.SUBMITTED, STATUSES.UNDER_REVIEW, STATUSES.REVIEWED, STATUSES.VERIFIED];
const map = {
  [STATUSES.SUBMITTED]: 0,
  [STATUSES.UNDER_REVIEW]: 1,
  [STATUSES.REVIEWED]: 2,
  [STATUSES.VERIFIED]: 3,
  [STATUSES.VERIFICATION_FAILED]: 3
};


const KycStepper = ({ kycList }) => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [kycDataMap, setKycDataMap] = useState({});
  const [expandedKycId, setExpandedKycId] = useState({});



  const theme = createTheme({
    palette: {
      mode: isDarkModeOn ? 'dark' : 'light',
      primary: {
        main: isDarkModeOn ? '#90caf9' : '#1976d2', // Adjust primary color for dark and light mode
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      for (const kycId of Object.keys(kycList)) {
        try {
          const data = await readDocument(COLLECTIONS.USER_KYC, kycId);
          setKycDataMap(prevState => ({
            ...prevState,
            [kycId]: data
          }));

          setExpandedKycId(prevState => ({
            ...prevState,
            [kycId]: false
          }));
          
        } catch (error) {
          console.error(`Error fetching KYC data for KYC ID ${kycId}:`, error);
        }
      }
    };
    fetchData();
  }, [kycList]);

  const handleExpand = (kycId) => {

    setExpandedKycId(prevState => ({
      ...prevState,
      [kycId]: true
    }));
    
   
  };
  
  const handleCollapse = (kycId) => {
    setExpandedKycId(prevState => ({
      ...prevState,
      [kycId]: false
    }));
    
    
  };
  

  console.log(kycDataMap,expandedKycId)


  return (
    <ThemeProvider theme={theme}>
      <div >
        {Object.keys(kycList).map((kycId) => (
          
            

          <Paper key={kycId} sx={{ textAlign: 'center', marginBottom: "1rem" }} elevation={2}>
            <Typography variant="h5" component="p">Kyc application Status : {kycList[kycId]}</Typography>
            <br></br>
            <Typography variant="subtitle1" component="p" gutterBottom>KYC Id : {kycId}</Typography> 
            <Stepper activeStep={(map[kycList[kycId]])} alternativeLabel connector={<QontoConnector />}>
            
              {stages.map((stage, index) => (

               
                <Step key={index}>
                  <StepLabel error={stage === STATUSES.VERIFIED && kycList[kycId] === STATUSES.VERIFICATION_FAILED}>
                    {stage === STATUSES.VERIFIED&& kycList[kycId] === STATUSES.VERIFICATION_FAILED? (
                      <p>Failed Verification</p>
                    ) : (
                      stage
                    )}
                  </StepLabel>
                </Step>
              ))}
              
            </Stepper>
            {kycDataMap && kycDataMap[kycId] ? (
              expandedKycId[kycId] === true ? (
                <div>
                  <br></br>
                  <div className="form-container">
                    <table>
                      <tbody>
                        {Object.keys(kycDataMap[kycId]).map((key, index) => (
                          <React.Fragment key={index}>
                            <tr className="form-row">
                              <td className="form-label">{toPascalCase(key)}</td>
                              <td className="form-value">{kycDataMap[kycId][key]}</td>
                            </tr>
                            {index !== Object.keys(kycDataMap[kycId]).length - 1 && <Divider variant="middle" />}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>


                  <ExpandLessIcon onClick={() => handleCollapse(kycId)} />
                </div>
              ) : (
                <ExpandMoreIcon onClick={() => handleExpand(kycId)} />
              )
            ) : (
              <Spinner size="small" />
            )}

          </Paper>
          
        ))}
      </div>
    </ThemeProvider>
  );
};

function toPascalCase(str) {
  return str.replace(/(\w)(\w*)/g, function(_, firstChar, rest) {
    return firstChar.toUpperCase() + rest.toLowerCase();
  });
}


export default KycStepper;
