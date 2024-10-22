import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { saveDocument, updateDocumentFields, readDocument, uploadImages4, deleteAllImagesInFolder2, getAllFilesFromFolder } from '../utils/firebaseUtils.js';
import { STATUSES, COLLECTIONS, STORAGES } from '../constants.js';
import KycStepper from './KycStepper.js';
import CryptoJS from 'crypto-js';
import { validateField } from '../utils/validationUtils';
import './Kyc.css';
import { LinearProgress, Typography } from '@mui/material';

const names_map = new Map([
  ["first_name" , "First Name"],
  ["middle_last_name" , "Middle & Last Name"],
  ["phone_number" , "Phone Number"],
  ["street_address" , "Street Address"],
  ["city" , "City"],
  ["state_province" , "State"],
  ["state" , "State"],
  ["zip_pin_code" , "PIN Code/ZIP"],
  ["aadhar" , "Aadhar Number"],
  ["gstin" , "GST Number"],
  ["comments" , "Remark(s)"]
  ])

  const orderedKeys = [
    ['first_name'],
    ['middle_last_name'],
    ['phone_number'],
    ['street_address'],
    ['city'],
    ['state_province', 'state'], // Include this key, either of them is present
    ['zip_pin_code']
];

function Kyc() {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_last_name: '',
    phone_number: '',
    street_address: '',
    city: '',
    state_province: '',
    zip_pin_code: '',
    country: 'India',
    aadhar: '',
    gstin: '',
    comments : '',
    status: STATUSES.SUBMITTED,
    tncAgreed: false,
    hash: '',
  });
  const [kycData, setKycData] = useState(null);
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [errors, setErrors] = useState({});
  const user_id = JSON.parse(localStorage.getItem('userInfo')).UserId;
  const kycId = `${user_id}_Kyc`;
  const [filesAadhar, setFilesAadhar] = useState(null);
  const [filesGst, setFilesGst] = useState(null);
  const [newFilesAadhar, setNewFilesAadhar] = useState([]);
  const [newFilesGst, setNewFilesGst] = useState([]);
  const [hasTextChanged, setHasTextChanged] = useState(false);
  const [progressAadhar, setProgressAadhar] = useState(-1);
  const [progressGst, setProgressGst] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const calculateHash = (data) => {
    const filteredData = Object.keys(data).filter(key => key !== 'hash' && key !== 'status');
    const sortedData = filteredData.sort().map(key => `${key}:${data[key]}`).join('|');
  // Calculate hash using SHA-256
    return CryptoJS.SHA256(sortedData).toString();
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Perform field validation as the user types
    const error = validateField(name, value);
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  
    // Update form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAadharUpload = (e) => {
    setNewFilesAadhar(e.target.files[0]);  // Store the new files
    setHasTextChanged(true);            // Mark that a change has occurred
  };
  
  const handleGstUpload = (e) => {
    setNewFilesGst(e.target.files[0]);  // Store the new files
    setHasTextChanged(true);         // Mark that a change has occurred
  };

  const handleTnCAgreement = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tncAgreed: e.target.checked,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {

      const formFields = Object.keys(formData).filter(
          (key) => !['hash', 'status', 'country', 'comments', 'UserId'].includes(key)
      );

      let isValid = true;
      let errorMessages = [];
      let errorNum = 0;

      formFields.forEach((field) => {
          const error = validateField(field, formData[field]);
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

      // If there are errors, prompt the user and stop the submission
      if (!isValid) {
          alert(`Please correct the following errors before submitting:\n\n${errorMessages.join('\n')}`);
          return;
      }


      const kycDoc = await readDocument(COLLECTIONS.USER_KYC, kycId);
      const newHash = calculateHash(formData);
      console.log(newHash,kycDoc?.hash)
      if (kycDoc) {
        if (kycDoc.hash !== newHash) {
          await updateDocumentFields(COLLECTIONS.USER_KYC, kycId, {
            ...formData,
            hash: newHash,
          });
          //alert("KYC updated successfully");
        } else {
          //alert("No changes detected");
        }
      } else {
        // If no KYC record exists, create a new one
        await saveDocument(COLLECTIONS.USER_KYC, kycId, {
          ...formData,
          UserId: user_id,
          hash: newHash,
        });
        //alert("KYC added successfully");
      }
      /*
      if (newFilesAadhar) {
        // Delete old files in the folder and upload the new files for Aadhar
        console.log(newFilesAadhar)
        await uploadImages3(STORAGES.CREATORS_KYC_DOCUMENTS, newFilesAadhar, user_id, "Aadhar");
        alert("Aadhar files uploaded successfully");
      }
  
      if (newFilesGst) {
        // Delete old files in the folder and upload the new files for GST
        await uploadImages3(STORAGES.CREATORS_KYC_DOCUMENTS, newFilesGst, user_id, "Gst");
        alert("GST files uploaded successfully");
      }
        */
      if (newFilesAadhar) {
        console.log(newFilesAadhar)
        await deleteAllImagesInFolder2(STORAGES.CREATORS_KYC_DOCUMENTS,user_id,"Aadhar");
        setProgressAadhar(0)
        await uploadImages4(
          STORAGES.CREATORS_KYC_DOCUMENTS,
          newFilesAadhar,
          user_id,
          "Aadhar",
          (progress) => setProgressAadhar(progress), // Update Aadhar progress state
          (url) => {
            setFilesAadhar(url); // Reset or update state if necessary
            console.log(url);
          }
        );
        //alert("Aadhar files uploaded successfully");
      }
  
      if (newFilesGst) {
        console.log(newFilesGst)
        await deleteAllImagesInFolder2(STORAGES.CREATORS_KYC_DOCUMENTS,user_id,"Gst");
        setProgressGst(0);
        await uploadImages4(
          STORAGES.CREATORS_KYC_DOCUMENTS,
          newFilesGst,
          user_id,
          "Gst",
          (progress) => setProgressGst(progress), // Update GST progress state
          (url) => {
            setFilesGst(url); // Collect download URLs
            console.log(url);
            //setNewFilesGst(null); // Reset or update state if necessary
          }
        );
        //alert("GST files uploaded successfully");
      }
  
  

      await updateDocumentFields(COLLECTIONS.USER, user_id, {
        KycIdList: { [kycId]: formData.status },
      });

      event.target.reset();
    } catch (error) {
      console.error("Error processing KYC: ", error);
    } finally{
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchKycData = async () => {
      const kycDoc = await readDocument(COLLECTIONS.USER_KYC, kycId);
      if (kycDoc) {
        setKycData(kycDoc);
        setFormData({ ...kycDoc, status: kycDoc.status || STATUSES.SUBMITTED });
      } else {
        setKycData(null);
      }
    };
    const fetchKycImages = async () => {
      const folder_path = `${STORAGES.CREATORS_KYC_DOCUMENTS}/${user_id}`
      try {
        // Fetch both Aadhar and GST files concurrently
        const [aadharFiles, gstFiles] = await Promise.all([
                  getAllFilesFromFolder(`${folder_path}/Aadhar/`),
                  getAllFilesFromFolder(`${folder_path}/Gst/`)
        ]);

        // Check if files are fetched successfully
        if (aadharFiles && aadharFiles.length > 0) {
            setFilesAadhar(aadharFiles);
        } else {
            setFilesAadhar(null); // Set to empty if no files found
            console.warn("No Aadhar documents found.");
        }

        if (gstFiles && gstFiles.length > 0) {
            setFilesGst(gstFiles);
        } else {
            setFilesGst(null); // Set to empty if no files found
            console.warn("No GST documents found.");
        }
      } catch (error) {
          console.error("Error fetching KYC documents:", error);
      }

    }

    fetchKycData();
    fetchKycImages();
  }, [kycId]);
  const excludedKeys = ['status', 'hash', 'country', 'tncAgreed', 'comments', 'UserId', 'gstin', 'aadhar'];
  return (
    <div style={{ color: isDarkModeOn ? 'white' : 'black' }}>
      <Container className="glassmorphic-container" style={{ margin: 'auto', border: isDarkModeOn ? '1px solid white' : '1px solid black', borderRadius: '5px', padding: '20px' }}>
        <Form onSubmit={handleSubmit}>
          <h1 style={{ color: isDarkModeOn ? 'white' : 'black', textTransform: 'capitalize' }}>Verify yourself</h1>
          <div className="row">
          { orderedKeys.map((fields) => {
              // Check which field is present in formData and not excluded
              const availableField = fields.find(field => !excludedKeys.includes(field) && formData[field] !== undefined);
              
              // If an available field is found, render it
              return availableField ? (
                  <div className="col-md-6 col-lg-4" key={availableField}>
                      <Form.Group controlId={`formBasic${availableField}`}>
                          <Typography style={{color: isDarkModeOn ? 'white' : 'black'}}>{names_map.get(availableField)}</Typography>
                          <Form.Control
                              type={availableField === 'age' || availableField === 'phone_number' ? 'number' : 'text'}
                              placeholder={`Enter ${names_map.get(availableField)}`}
                              name={availableField}
                              value={formData[availableField]}
                              onChange={handleChange}
                              required
                              className="glassmorphic-input"
                              style={{
                                  backgroundColor: isDarkModeOn ? '#181818' : '#e5e5e5',
                                  color: isDarkModeOn ? 'white' : 'black',
                              }}
                          />
                          {errors[availableField] && <span style={{ color: 'red' }}>{errors[availableField]}</span>} {/* Show validation error */}
                      </Form.Group>
                  </div>
              ) : null; // Return null if no field is available
          })}

          </div>
          <div className="row">
            <div className="col-md-6 col-lg-4">
              <Form.Group controlId="formBasicAadhar">
                <Form.Label style={{color: isDarkModeOn ? 'white' : 'black'}}>Aadhar</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    placeholder="Enter Aadhar Number"
                    name="aadhar"
                    className="glassmorphic-input"
                    value={formData.aadhar}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: isDarkModeOn ? '#181818' : '#e5e5e5',
                      color: isDarkModeOn ? 'white' : 'black',
                      marginRight: '10px'
                    }}
                  />
                  <Button disable={formData.status === "Verified"} variant="light" onClick={() => document.getElementById('aadharUpload').click()} style={{ 
                         
                        padding: '0.5rem', 
                        backgroundColor: isDarkModeOn ? '#333' : '#f8f9fa', // Dark mode background
                        color: isDarkModeOn ? 'white' : 'black', // Dark mode text color
                        cursor: 'pointer'
                    }}>
                    Upload
                  </Button>
                  <input
                    type="file"
                    id="aadharUpload"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => handleAadharUpload(e)}
                  />
                </div>
                {filesAadhar && filesAadhar.length > 0 && filesAadhar[0].fileURL ? (
                  <Button 
                      variant="link" 
                      style={{ color: '#007bff', textDecoration: 'none' }} 
                      onClick={() => window.open(filesAadhar[0].fileURL, '_blank')}
                  >
                      Download Aadhar Document
                  </Button>
              ) : (
               <p style={{color: isDarkModeOn ? 'white' : 'black'}}>{newFilesAadhar?.name || "No new Aadhar file uploaded."}</p>
              )}
              </Form.Group>
              {errors['aadhar'] && <span style={{ color: 'red' }}>{errors['aadhar']}</span>}
              <div>
                {progressAadhar>=0&&<>
                  <progress value={progressAadhar} max="100" /> 
                  <p>{progressAadhar}% uploaded</p>
                </>}
              </div>
              

            </div>
          </div>
          <div className="row">         
            <div className="col-md-6 col-lg-4">
              <Form.Group controlId="formBasicGst">
                <Form.Label style={{color: isDarkModeOn ? 'white' : 'black'}}>GST</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    placeholder="Enter GST Number"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    className="glassmorphic-input"
                    required
                    style={{
                      backgroundColor: isDarkModeOn ? '#181818' : '#e5e5e5',
                      color: isDarkModeOn ? 'white' : 'black',
                      marginRight: '10px'
                    }}
                  />
                  <Button disable={formData.status === "Verified"} variant="light" onClick={() => document.getElementById('gstUpload').click()}  style={{ 
                         
                         padding: '0.5rem', 
                        backgroundColor: isDarkModeOn ? '#333' : '#f8f9fa', // Dark mode background
                        color: isDarkModeOn ? 'white' : 'black', // Dark mode text color
                        cursor: 'pointer'
                    }}>
                    Upload
                  </Button>
                  <input
                    type="file"
                    id="gstUpload"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => handleGstUpload(e)}
                  />
                </div>
                {filesGst && filesGst.length > 0 && filesGst[0].fileURL ? (
                  <Button 
                      variant="link" 
                      style={{ color: '#007bff', textDecoration: 'none' }} 
                      onClick={() => window.open(filesGst[0].fileURL, '_blank')}
                  >
                      Download GST Document
                  </Button>
              ) : (
                   <p style={{color: isDarkModeOn ? 'white' : 'black'}}> {newFilesGst?.name || "No new GST file uploaded."}</p>
              )}
              </Form.Group>
              {errors['gstin'] && <span style={{ color: 'red' }}>{errors['gstin']}</span>}
              <div>
                {progressGst>=0&&<>
                  <progress value={progressGst} max="100" /> 
                  <p>{progressGst}% uploaded</p>
                </>}
              </div>
              
            </div>
          </div>

          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="tnc-switch" checked={formData.tncAgreed}
            onChange={handleTnCAgreement}/>
            <label class="form-check-label" for="exampleCheck1">
            <span style={{color: isDarkModeOn ? 'white' : 'black'}}>
                I agree to the <a href="#/npoliciesStudio" style={{ color: isDarkModeOn ? 'lightblue' : 'blue' }}>Terms and Conditions. Click to read.</a>
              </span>
            </label>
          </div>
          <br/>
          {formData.comments && (
            <div className="col-md-12 col-lg-12">
              <br/>
              <Form.Group controlId="formBasicComments">
                <Form.Label>{names_map.get('comments')}</Form.Label>
                <Form.Control
                  as="textarea"
                  name="comments"
                  value={formData.comments}
                  readOnly
                  style={{
                    backgroundColor: isDarkModeOn ? '#181818' : '#e5e5e5',
                    color: isDarkModeOn ? 'white' : 'black'
                  }}
                />
              </Form.Group>
            </div>
          )}
          <Button variant="info" type="submit" disabled={formData.status === "Verified" || !formData.tncAgreed}          >
            Submit
          </Button>

        </Form>
        {isSubmitting && <LinearProgress/>}
        <br/>
        <>
          {formData.hash && <KycStepper kycId={kycId} status={formData.status} />}
        </>
      </Container>
      <br />
    </div>
    
  );
}

export default Kyc;
