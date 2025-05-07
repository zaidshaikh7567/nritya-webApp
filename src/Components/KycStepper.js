import { useSelector } from "react-redux";
import { Stepper, Step, StepLabel } from "@mui/material";

import { STATUSES } from "../constants";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";

const stages = [
  STATUSES.SUBMITTED,
  STATUSES.UNDER_REVIEW,
  STATUSES.REVIEWED,
  STATUSES.VERIFIED,
];
const map = {
  [STATUSES.SUBMITTED]: 0,
  [STATUSES.UNDER_REVIEW]: 1,
  [STATUSES.REVIEWED]: 2,
  [STATUSES.VERIFIED]: 3,
  [STATUSES.VERIFICATION_FAILED]: 3,
};

const KycStepper = ({ status }) => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const primaryColor = "#67569E";
  const textColor = isDarkModeOn ? "white" : "black";

  return (
    <Stepper
      activeStep={map[status]}
      alternativeLabel
      sx={{
        my: 3,
        "& .MuiStepLabel-iconContainer .Mui-completed": {
          color: primaryColor,
        },
        "& .MuiStepLabel-iconContainer .Mui-active": {
          color: primaryColor,
        },
        "& .MuiStepLabel-label": {
          color: textColor,
          letterSpacing: "0.85px",
          fontFamily: "Nunito Sans",
          fontWeight: 500,
          fontSize: "16.98px",

          "&.Mui-error": {
            color: "error.main",
          },
        },
      }}
    >
      {stages.map((stage, index) => (
        <Step key={index}>
          <StepLabel
            error={
              stage === STATUSES.VERIFIED &&
              status === STATUSES.VERIFICATION_FAILED
            }
          >
            {stage === STATUSES.VERIFIED &&
            status === STATUSES.VERIFICATION_FAILED
              ? "Failed Verification"
              : stage}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default KycStepper;
