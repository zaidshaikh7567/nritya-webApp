import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { saveDocument, updateDocumentFields, readDocument } from '../utils/firebaseUtils.js';
import { STATUSES, COLLECTIONS } from '../constants.js';
import KycStepper from './KycStepper.js';
import CryptoJS from 'crypto-js';
import { validateField } from '../utils/validationUtils';

const names_map = new Map([
  ["first_name" , "First Name"],
  ["middle_last_name" , "Middle & Last Name"],
  ["phone_number" , "Phone Number"],
  ["street_address" , "Street Address"],
  ["city" , "City"],
  ["state_province" , "State"],
  ["zip_pin_code" , "PIN Code/ZIP"],
  ["aadhar" , "Aadhar Number"],
  ["gstin" , "GST Number"],
  ["comments" , "Remark(s)"]
  ])

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
    hash: '',
  });
  const [kycData, setKycData] = useState(null);
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [errors, setErrors] = useState({});
  const user_id = JSON.parse(localStorage.getItem('userInfo')).UserId;
  const kycId = `${user_id}_Kyc`;

  const calculateHash = (data) => {
    const filteredData = Object.keys(data).filter(key => key !== 'hash' && key !== 'status');
    const sortedData = filteredData.sort().map(key => `${key}:${data[key]}`).join('|');
  // Calculate hash using SHA-256
    return CryptoJS.SHA256(sortedData).toString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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

      if (kycDoc) {
        if (kycDoc.hash !== newHash) {
          await updateDocumentFields(COLLECTIONS.USER_KYC, kycId, {
            ...formData,
            hash: newHash,
          });
          alert("KYC updated successfully");
        } else {
          alert("No changes detected");
        }
      } else {
        // If no KYC record exists, create a new one
        await saveDocument(COLLECTIONS.USER_KYC, kycId, {
          ...formData,
          UserId: user_id,
          hash: newHash,
        });
        alert("KYC added successfully");
      }

      await updateDocumentFields(COLLECTIONS.USER, user_id, {
        KycIdList: { [kycId]: formData.status },
      });

      event.target.reset();
    } catch (error) {
      console.error("Error processing KYC: ", error);
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

    fetchKycData();
  }, [kycId]);

  return (
    <div style={{ color: isDarkModeOn ? 'white' : 'black' }}>
      <Container style={{ margin: 'auto', border: isDarkModeOn ? '1px solid white' : '1px solid black', borderRadius: '5px', padding: '20px' }}>
        <Form onSubmit={handleSubmit}>
          <h1 style={{ color: isDarkModeOn ? 'white' : 'black', textTransform: 'capitalize' }}>Verify yourself</h1>
          <div className="row">
            { Object.keys(formData).map((key) => (
              key !== 'status' && key !== 'hash' && key !== 'country'&& key !== 'comments' && key !== 'UserId' && (
                <div className="col-md-6 col-lg-4" key={key}>
                  <Form.Group controlId={`formBasic${key}`}>
                    <Form.Label>{names_map.get(String(key))}</Form.Label>
                    <Form.Control
                      type={key === 'age' || key === 'phone_number' ? 'number' : 'text'}
                      placeholder={`Enter ${names_map.get(String(key))}`}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: isDarkModeOn ? '#181818' : '#e5e5e5', color: isDarkModeOn ? 'white' : 'black' }}
                    />
                  </Form.Group>
                </div>
              )
            ))}
          </div>
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

          <br/>
          <Button variant="success" type="submit" disabled={formData.status === "Verified"}>
            Submit
          </Button>

        </Form>
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
