import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MUIButton from "@mui/material/Button";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";

const SuccessMessage = ({ StudioId }) => {
  const navigate = useNavigate();
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const form = document.getElementById("addStudioForm");

  const studioName = form?.studioName?.value;
  const streetName = form?.street?.value;
  const city = form?.city?.value;

  const navigateToStudio = () => {
    navigate(`/studio/${StudioId}`);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12"> {/* Change col-md-5 to col-md-12 */}
          <div className="_success message-box">
            <i className="fa fa-check-circle" aria-hidden="true"></i>
            <h4
              style={{
                textTransform: "none",
                marginTop: "1rem",
                color: isDarkModeOn ? "white" : "black",
              }}
            >
              Your studio {studioName} (Studio ID: {StudioId}), located at {streetName} in {city} has been registered successfully 🎉
            </h4>
            <MUIButton
              sx={{ mt: 1, px: 3, color: 'white', bgcolor: '#735EAB', textTransform: 'none', "&:hover": { bgcolor: "#735EAB" }, "&:active": { bgcolor: "#735EAB" } }}
              variant="text"
              onClick={() => navigateToStudio()}
            >
              Check Now
            </MUIButton>
          </div>
        </div>
      </div>
      <hr />

      <style jsx>{`
        ._success {
          padding: 45px;
          width: 100%;
          text-align: center;
          margin: 30px auto;
        }

        ._success i {
          font-size: 55px;
          color: #28a745;
        }

        ._success h2 {
          margin-bottom: 12px;
          font-size: 30px;
          font-weight: 300;
          line-height: 1.2;
          margin-top: 10px;
        }

        ._success p {
          margin-bottom: 0px;
          font-size: 18px;
          color: #495057;
          font-weight: 100;
        }
      `}</style>
    </div>
  );
};

export default SuccessMessage;
