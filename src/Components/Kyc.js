import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { saveDocument, updateDocumentFields, readDocument } from '../utils/firebaseUtils.js';
import { STATUSES, COLLECTIONS } from '../constants.js';
import KycStepper from './KycStepper.js';
import CryptoJS from 'crypto-js';

function Kyc() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phoneNumber: '',
    status: STATUSES.SUBMITTED,
    hash: '', // Added for storing hash
  });
  const [kycData, setKycData] = useState(null);
  const isDarkModeOn = useSelector(selectDarkModeStatus);

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
              key !== 'status' && key !== 'hash' && key !== 'country' && key !== 'UserId' && (
                <div className="col-md-6 col-lg-4" key={key}>
                  <Form.Group controlId={`formBasic${key}`}>
                    <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                    <Form.Control
                      type={key === 'age' || key === 'phoneNumber' ? 'number' : 'text'}
                      placeholder={`Enter ${key}`}
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
