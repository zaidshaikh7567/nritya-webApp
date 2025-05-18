import CryptoJS from "crypto-js";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  createTheme,
  CssBaseline,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";

import indianCities from "../cities.json";
import indianStates from "../states.json";
import { postData } from "../utils/common";
import { useAuth } from "../context/AuthContext";
import KycStepper from "../Components/KycStepper";
import { useLoader } from "../context/LoaderContext";
import UserCard from "../Components/profile/UserCard";
import { validateField } from "../utils/validationUtils";
import { useSnackbar } from "../context/SnackbarContext";
import { BASEURL_PROD, COLLECTIONS, STATUSES, STORAGES } from "../constants";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import FileInputWithNumber from "../Components/profile/FileInputWithNumber";
import {
  deleteAllImagesInFolder2,
  updateDocumentFields,
  uploadImages4,
} from "../utils/firebaseUtils";

const FORM_FIELD_HEIGHT = 56;

const cardData = [
  ["Transactions", "All", "#/transactions"],
  ["My Bookings", "All", "#/myBookings"],
  ["Instructors", "Creator", "#/modifyInstructors"],
  ["Studios", "Creator", "#/modifyStudios"],
  ["Dashboard", "Creator", "#/creatorDashboard"],
];

const locationOptions = indianCities.cities;
const stateOptions = indianStates.states;

const initialValues = {
  first_name: "",
  middle_last_name: "",
  street_address: "",
  city: "",
  state_province: "",
  zip_pin_code: "",
  country: "India",
  aadhar: "",
  aadharFile: null,
  gstin: "",
  gstinFile: null,
  phone_number: "",
  profileFile: null,
  tncAgreed: false,
  comments: "",
  status: STATUSES.SUBMITTED,
  hash: "",
};

function UserPage() {
  const user_id = JSON.parse(localStorage.getItem("userInfo"))?.UserId;
  const currentUserEmail = JSON.parse(localStorage.getItem("userInfo"))?.email;
  const currentName = JSON.parse(localStorage.getItem("userInfo"))?.displayName;
  const kycId = `${user_id}_Kyc`;

  const { currentUser } = useAuth();
  const showSnackbar = useSnackbar();
  const { setIsLoading } = useLoader();
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const [isCreator, setIsCreator] = useState(false);
  const [kycDoc, setKycDoc] = useState(null);
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isStateDisabled, setIsStateDisabled] = useState(false);

  const handleChange2 = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (!["checkbox", "file"].includes(type)) {
      const error = validateField(name, value);

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleChange = async (e) => {
    const { name, value, type, checked, files } = e.target;
    console.log("name", BASEURL_PROD, user_id);
    // validate field if not checkbox/file
    if (!["checkbox", "file"].includes(type)) {
      const error = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }

    // update formData
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));

    // if pincode is being entered and reaches 6 digits
    if (name === "zip_pin_code" && value.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = await response.json();
        if (data[0].Status === "Success") {
          const stateName = data[0].PostOffice[0].State;
          console.log("State Name:", stateName);
          setFormData((prevData) => ({
            ...prevData,
            state_province: stateName,
          }));
          setIsStateDisabled(true); // disable state field
        } else {
          console.error("Invalid Pincode");
          setIsStateDisabled(false);
        }
      } catch (err) {
        console.error("Failed to fetch state", err);
        setIsStateDisabled(false);
      }
    }

    // if pincode is edited back to less than 6 digits, re-enable state field
    if (name === "zip_pin_code" && value.length < 6) {
      setIsStateDisabled(false);
    }
  };

  const calculateHash = (data) => {
    const filteredData = Object.keys(data).filter(
      (key) => !["aadharFile", "gstinFile", "hash", "status"].includes(key)
    );
    const sortedData = filteredData
      .sort()
      .map((key) => `${key}:${data[key]}`)
      .join("|");
    return CryptoJS.SHA256(sortedData).toString();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(false);

      const formFields = Object.keys(formData).filter(
        (key) =>
          !["hash", "status", "country", "comments", "UserId"].includes(key)
      );

      let isValid = true;
      let errorMessages = [];
      let errorNum = 0;

      formFields.forEach((field) => {
        let error = validateField(field, formData[field]);

        if (error) {
          isValid = false;
          errorNum = errorNum + 1;
          errorMessages.push(`${errorNum}: ${error}`);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error,
          }));
        }
      });

      if (!isValid) {
        return alert(
          `Please correct the following errors before submitting:\n\n${errorMessages.join(
            "\n"
          )}`
        );
      }

      const newHash = calculateHash(formData);

      const notifyEmails = currentUserEmail;
      const metaData = {
        user_name: currentName,
        user_id: user_id,
      };

      if (!kycDoc || kycDoc.hash !== newHash) {
        const dbPayload = {
          ...formData,
          hash: newHash,
          //aadharFile: undefined,
          //gstinFile: undefined,
        };
        await postData(dbPayload, COLLECTIONS.USER_KYC, notifyEmails, metaData);
      }

      if (formData.aadharFile) {
        await deleteAllImagesInFolder2(
          STORAGES.CREATORS_KYC_DOCUMENTS,
          user_id,
          "Aadhar"
        );

        await uploadImages4(
          STORAGES.CREATORS_KYC_DOCUMENTS,
          formData.aadharFile,
          user_id,
          "Aadhar",
          () => {},
          () => {}
        );
      }

      if (formData.gstinFile) {
        await deleteAllImagesInFolder2(
          STORAGES.CREATORS_KYC_DOCUMENTS,
          user_id,
          "Gst"
        );

        await uploadImages4(
          STORAGES.CREATORS_KYC_DOCUMENTS,
          formData.gstinFile,
          user_id,
          "Gst",
          () => {},
          () => {}
        );
      }

      await updateDocumentFields(COLLECTIONS.USER, user_id, {
        KycIdList: { [kycId]: formData.status },
      });

      event.target.reset();
      setFormData((prev) => ({
        ...prev,
        hash: newHash,
        status: STATUSES.SUBMITTED,
      }));

      showSnackbar("Your KYC details are submitted successfully", "success");
    } catch (error) {
      showSnackbar("Failed to submit your KYC details", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCreatorMode = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${BASEURL_PROD}crud/getUserMode/${currentUser.uid}`
        );
        const data = await res.json();
        if (data) {
          const creatorMode = data.data;
          setIsCreator(creatorMode);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.uid) {
      fetchCreatorMode();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchKycData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`${BASEURL_PROD}crud/getKycDoc/${kycId}`);
        const responseJson = await response.json();
        const kycDoc = responseJson.kyc_data;

        if (kycDoc) {
          setKycDoc(kycDoc);
          setFormData({
            ...kycDoc,
            status: kycDoc.status || STATUSES.SUBMITTED,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchKycData();
  }, [kycId]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container>
        {formData?.hash && <UserCard formData={formData} />}

        {!formData?.hash && (
          <Typography
            variant="body1"
            sx={{
              my: 3,
              fontSize: "35px",
              color: isDarkModeOn ? "white" : "black",
              fontFamily: "Nunito Sans",
            }}
          >
            Verify Yourself
          </Typography>
        )}

        {formData?.hash && <KycStepper status={formData.status} />}

        {formData?.hash && formData?.status === "Verified" && (
          <Grid container rowGap={3} columnGap={3} sx={{ my: 3 }}>
            {cardData.map(([name, type, link], index) => {
              if (type === "Creator" && !isCreator) return null;

              return (
                <Grid
                  item
                  key={index}
                  component="a"
                  href={link}
                  xs={12}
                  sm={3}
                  md={2}
                  sx={{
                    bgcolor: isDarkModeOn ? "#00000040" : "white",
                    color: isDarkModeOn ? "white" : "black",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: "14px",
                    textAlign: "center",
                    fontSize: "17.12px",
                    letterSpacing: "1.3px",
                    fontFamily: "Nunito Sans",

                    "&:hover": {
                      bgcolor: "#67569E",
                      color: "white",
                    },
                  }}
                >
                  {name}
                </Grid>
              );
            })}
          </Grid>
        )}

        {formData?.hash && formData?.status === "Verification Failed" && (
          <Typography
            variant="body1"
            sx={{
              my: 3,
              fontSize: "35px",
              color: isDarkModeOn ? "white" : "black",
              fontFamily: "Nunito Sans",
            }}
          >
            Re-enter valid details for verification
          </Typography>
        )}

        {(!formData?.hash || formData?.status === "Verification Failed") && (
          <Paper
            elevation={2}
            sx={{
              my: 3,
              p: 3,
              borderRadius: 2,
              bgcolor: isDarkModeOn ? "#00000040" : "unset",
            }}
          >
            {formData.comments && (
              <Typography variant="subtitle1" component="p" sx={{ mb: 3 }}>
                {formData.comments || "Comment from verifier of KYC data"}
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    First Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    sx={{ height: FORM_FIELD_HEIGHT }}
                    variant="outlined"
                    InputLabelProps={{ shrink: false }}
                    placeholder="Enter first name"
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Last Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="middle_last_name"
                    value={formData.middle_last_name}
                    onChange={handleChange}
                    sx={{ height: FORM_FIELD_HEIGHT }}
                    variant="outlined"
                    placeholder="Enter last name"
                    error={!!errors.middle_last_name}
                    helperText={errors.middle_last_name}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Address
                  </Typography>
                  <TextField
                    fullWidth
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleChange}
                    sx={{ height: FORM_FIELD_HEIGHT }}
                    placeholder="Enter address"
                    error={!!errors.street_address}
                    helperText={errors.street_address}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    City
                  </Typography>
                  <FormControl error={!!errors.city} fullWidth>
                    <Select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ height: FORM_FIELD_HEIGHT }}
                    >
                      <MenuItem value="">Select city</MenuItem>
                      {locationOptions.map((city, index) => (
                        <MenuItem key={index} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.city && (
                      <FormHelperText>{errors.city}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    State
                  </Typography>
                  <FormControl error={!!errors.state_province} fullWidth>
                    <Select
                      name="state_province"
                      value={formData.state_province}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ height: FORM_FIELD_HEIGHT }}
                      disabled={isStateDisabled}
                    >
                      <MenuItem value="">Select state</MenuItem>
                      {stateOptions.map((state, index) => (
                        <MenuItem key={index} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.state_province}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Pincode
                  </Typography>
                  <TextField
                    fullWidth
                    name="zip_pin_code"
                    value={formData.zip_pin_code}
                    onChange={handleChange}
                    type="number"
                    sx={{ height: FORM_FIELD_HEIGHT }}
                    placeholder="Enter pincode"
                    error={!!errors.zip_pin_code}
                    helperText={errors.zip_pin_code}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FileInputWithNumber
                    label="Aadhar Number"
                    numberFieldName="aadhar"
                    fileFieldName="aadharFile"
                    value={formData.aadhar}
                    errors={errors}
                    onChange={handleChange}
                    onFileChange={handleChange}
                    fileName={formData.aadharFile?.name || ""}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FileInputWithNumber
                    label="GST Number"
                    numberFieldName="gstin"
                    fileFieldName="gstinFile"
                    value={formData.gstin}
                    errors={errors}
                    onChange={handleChange}
                    onFileChange={handleChange}
                    fileName={formData.gstinFile?.name || ""}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    type="tel"
                    sx={{ height: FORM_FIELD_HEIGHT }}
                    placeholder="Enter phone number"
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Profile Picture
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      height: FORM_FIELD_HEIGHT,
                      color: isDarkModeOn ? "white" : "black",
                      borderColor: isDarkModeOn ? "#ffffff3b" : "#0000003b",
                      "&:hover": {
                        borderColor: isDarkModeOn ? "#ffffff3b" : "#0000003b",
                      },
                    }}
                  >
                    Upload
                    <input
                      type="file"
                      name="profileFile"
                      hidden
                      onChange={handleChange}
                    />
                  </Button>
                  {formData.profileFile && (
                    <Box sx={{ fontSize: 12, marginTop: 1, color: "gray" }}>
                      Selected file: {formData.profileFile.name}
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Checkbox
                    checked={formData.tncAgreed}
                    onChange={handleChange}
                    name="tncAgreed"
                  />
                  <Typography component="span" sx={{ mr: 0.5 }}>
                    I agree to the
                  </Typography>
                  <Typography
                    component="a"
                    href="#/npoliciesStudio"
                    sx={{
                      color: isDarkModeOn ? "lightblue" : "blue",
                      textDecoration: "none",
                    }}
                  >
                    Terms and Conditions. Click to read.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={
                      formData.status === "Verified" || !formData.tncAgreed
                    }
                    sx={{
                      bgcolor: "#67569E",
                      color: "white",
                      textTransform: "capitalize",
                      "&:hover": { bgcolor: "#67569E", color: "white" },
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default UserPage;
