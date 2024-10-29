import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Typography, Paper, ThemeProvider, createTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { readDocument } from '../utils/firebaseUtils';
import { STATUSES, COLLECTIONS } from '../constants';
import './KycStepper.css';

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

const KycStepper = ({ kycId, status }) => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [kycData, setKycData] = useState({});

  console.log(status)

  const theme = createTheme({
    palette: {
      mode: isDarkModeOn ? 'dark' : 'light',
      primary: {
        main: isDarkModeOn ? '#90caf9' : '#1976d2',
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readDocument(COLLECTIONS.USER_KYC, kycId);
        setKycData(data);
      } catch (error) {
        console.error(`Error fetching KYC data for KYC ID ${kycId}:`, error);
      }
    };
    fetchData();
  }, [kycId]);


  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ textAlign: 'center', marginBottom: '1rem' }} elevation={2}>
        <Typography variant="h5" component="p">Application Status: {status}</Typography>
        <br/>
        <Stepper activeStep={map[status]} alternativeLabel connector={<QontoConnector />}>
          {stages.map((stage, index) => (
            <Step key={index}>
              <StepLabel error={stage === STATUSES.VERIFIED && status === STATUSES.VERIFICATION_FAILED}>
                {stage === STATUSES.VERIFIED && status === STATUSES.VERIFICATION_FAILED ? 'Failed Verification' : stage}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <br/>
      </Paper>
    </ThemeProvider>
  );
};

export default KycStepper;
