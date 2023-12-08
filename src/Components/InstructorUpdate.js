import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import {doc, getDoc, updateDoc, collection, where, query, getDocs} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { COLLECTIONS } from '../constants';
import { STORAGES } from '../constants';
import { db, storage } from '../config';

function InstructorUpdate({ instructors, setInstructors }) {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toUploadImage, setToUploadImage] = useState(null);

  // Handle instructor selection from dropdown
  const handleInstructorSelection = async (event) => {
    event.preventDefault();
    const instructorId = event.target.value;
    console.log(instructorId);
    const instructorDoc = await getDoc(doc(db, COLLECTIONS.INSTRUCTORS, instructorId));
    setSelectedInstructor({
      id: instructorDoc.id,
      ...instructorDoc.data(),
    });
    //console.log(selectedInstructor);
  };

  useEffect(() => {
    if (selectedInstructor) {
      console.log("Instructor id changes : ",selectedInstructor.id)
      const userId = selectedInstructor.id
      //console.log(userId)
      if (userId) {
        const storagePath = `${STORAGES.INSTRUCTORIMAGES}/${userId}`;
        const folderRef = ref(storage, storagePath);
    
        try {
          listAll(folderRef)
            .then((result) => {
              if (result.items.length > 0) {
                const firstFileRef = result.items[0];
                getDownloadURL(firstFileRef)
                  .then((url) => {
                    setSelectedImage(url);
                    setToUploadImage(url);
                    console.log("Image selected: ",selectedImage);
                  })
                  .catch((error) => {
                    console.error('Error fetching studio icon:', error);
                  });
              } else {
                console.log('No files found in the folder.');
                setSelectedImage(null);
                setToUploadImage(null);
              }
            })
            .catch((error) => {
              console.error('Error listing files in the folder:', error);
            });
        } catch (error) {
          console.error('Error fetching studio icon:', error);
        }
      }
      //setSelectedInstructors((selectedStudio.instructorsNames));
      // setSelectedImage
    }
  }, [selectedInstructor]);

  // Handle image change
  const handleImageChangeUpdate = (e) => {
    console.log("Selected file new:");
    const file = e.target.files[0];
    console.log("Selected file:", file);

    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setToUploadImage(file);
    }
  };

  // Handle form submission for updating instructor
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!selectedInstructor) {
      alert('Please select an instructor to update.');
      return;
    }

    try {
      // Update instructor details
      const updatedInstructorData = {
        name: e.target.name.value,
        danceStyles: e.target.danceStyles.value,
        experience: e.target.experience.value,
        age: e.target.age.value,
        email: e.target.email.value,
        description: e.target.description.value,
        facebook: e.target.facebook.value,
        instagram: e.target.instagram.value,
        twitter: e.target.twitter.value,
        youtube: e.target.youtube.value,
      };

      // Merge the updated details into the selected instructor
      setSelectedInstructor((prevInstructor) => ({
        ...prevInstructor,
        ...updatedInstructorData,
      }));

      // Update data in Firestore
      await updateDoc(doc(db, COLLECTIONS.INSTRUCTORS, selectedInstructor.id), updatedInstructorData);

      // Handle profile picture change
      if (selectedImage && toUploadImage) {
        const imageUrl = await handleProfilePictureChange(toUploadImage, selectedInstructor.id);
        console.log('Profile picture uploaded:', imageUrl);
      }

      console.log('Instructor updated successfully');
      alert('Instructor updated successfully');
    } catch (error) {
      console.error('Error updating instructor', error);
      alert('Error updating instructor');
    }
  };

  // Handle profile picture change
  const handleProfilePictureChange = async (file, userId) => {
    try {
      // Delete old files in the storage folder
      const storageFolder = STORAGES.INSTRUCTORIMAGES;
      const folderPath = `${storageFolder}/${userId}`;
      const storageRef = ref(storage, folderPath);

      const itemsToDelete = await listAll(storageRef);
      itemsToDelete.items.forEach(async (itemRef) => {
        await deleteObject(itemRef);
      });

      // Upload the new file
      const fileRef = ref(storage, `${folderPath}/${file.name}`);
      await uploadBytes(fileRef, file);

      // Get the updated download URL for the uploaded image
      const imageUrl = await getDownloadURL(fileRef);

      // Return the profile picture URL
      return imageUrl;
    } catch (error) {
      console.error('Error handling profile picture:', error);
      throw error;
    }
  };


  return (
    <div>
      <h1>Update Dance Teacher</h1>
      <Form onSubmit={handleUpdateSubmit}>
        <Form.Control
          as="select"
          onChange={handleInstructorSelection}
          style={{
            backgroundColor: isDarkModeOn ? '#333333' : '',
            color: isDarkModeOn ? 'white' : 'black',
          }}
        >
          <option
            style={{
              backgroundColor: isDarkModeOn ? '#333333' : '',
              color: isDarkModeOn ? 'white' : 'black',
            }}
          >
            Select an instructor
          </option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {`${instructor.name} - ${instructor.id}`}
            </option>
          ))}
        </Form.Control>

          
            <Row>
              <Col md={4}>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>
                    <div
                      style={{
                        width: '20rem',
                        height: '20rem',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        margin: 'auto',
                        position: 'relative',
                        backgroundColor: isDarkModeOn ? '#d3d3d3' : 'black',
                      }}
                    >
                      {selectedImage && (
                        <Image
                          src={selectedImage}
                          alt="Selected"
                          style={{
                            width: '100%',
                            height: '100%',
                            display: selectedImage ? 'block' : 'none',
                          }}
                        />
                      )}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                        <span style={{ marginBottom: '2px', fontSize: '2rem' }}></span>
                        <input
                          type="file"
                          id="fileInput"
                          name="picture"
                          accept="image/*"
                          style={{ }}
                          onChange={handleImageChangeUpdate}
                        />
                      </label>
                    </div>
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  defaultValue={selectedInstructor ? selectedInstructor.name :""}
                  style={{
                    backgroundColor: isDarkModeOn ? '#333333' : '',
                    color: isDarkModeOn ? 'white' : 'black',
                  }}
                />

                <Form.Label>Dance Styles</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter dance styles"
                  name="danceStyles"
                  defaultValue={selectedInstructor ? selectedInstructor.danceStyles:""}
                  style={{
                    backgroundColor: isDarkModeOn ? '#333333' : '',
                    color: isDarkModeOn ? 'white' : 'black',
                  }}
                />

                <Form.Label>Experience</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter experience (in years)"
                  name="experience"
                  defaultValue={selectedInstructor?selectedInstructor.experience:""}
                  style={{
                    backgroundColor: isDarkModeOn ? '#333333' : '',
                    color: isDarkModeOn ? 'white' : 'black',
                  }}
                />

                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter age"
                  name="age"
                  defaultValue={selectedInstructor? selectedInstructor.age:""}
                  style={{
                    backgroundColor: isDarkModeOn ? '#333333' : '',
                    color: isDarkModeOn ? 'white' : 'black',
                  }}
                />

                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email Id of instructor"
                  name="email"
                  defaultValue={selectedInstructor?selectedInstructor.email:""}
                  style={{
                    backgroundColor: isDarkModeOn ? '#333333' : '',
                    color: isDarkModeOn ? 'white' : 'black',
                  }}
                />
              </Col>
            </Row>

            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              name="description"
              defaultValue={selectedInstructor?selectedInstructor.description:""}
              style={{
                backgroundColor: isDarkModeOn ? '#333333' : '',
                color: isDarkModeOn ? 'white' : 'black',
              }}
            />

            <Form.Label>Social Links</Form.Label>
            <Row>
              <Col>
                <FaFacebook size={30} />
                <Form.Control
                  type="text"
                  placeholder="Enter Facebook profile URL"
                  name="facebook"
                  defaultValue={selectedInstructor?selectedInstructor.facebook:""}
                  style={{
                    backgroundColor: isDarkModeOn ? '#333333' : '',
                    color: isDarkModeOn ? 'white' : 'black',
                  }}
                />
              </Col>
              <Col>
                <FaInstagram size={30} />
                <Form.Control
                  type="text"
                  placeholder="Enter Instagram profile URL"
                  name="instagram"
                  defaultValue={selectedInstructor?selectedInstructor.instagram:""}
                  style={{
                    backgroundColor: isDarkModeOn ? '#333333' : '',
                    color: isDarkModeOn ? 'white' : 'black',
                  }}
                />
              </Col>
              <Col>
                <FaTwitter size={30} />
                <Form.Control
                  type="text"
                  placeholder="Enter Twitter profile URL"
                  name="twitter"
                  defaultValue={selectedInstructor?selectedInstructor.twitter:""}
                  style={{
                    backgroundColor: isDarkModeOn ? '#333333' : '',
                    color: isDarkModeOn ? 'white' : 'black',
                  }}
                />
              </Col>
              <Col>
                <FaYoutube size={30} />
                <Form.Control
                  type="text"
                  placeholder="Enter Youtube channel URL"
                  name="youtube"
                  defaultValue={selectedInstructor?selectedInstructor.youtube:""}
                  style={{
                    backgroundColor: isDarkModeOn ? '#333333' : '',
                    color: isDarkModeOn ? 'white' : 'black',
                  }}
                />
              </Col>
            </Row>

            <Button
              variant="primary"
              type="submit"
              style={{
                backgroundColor: isDarkModeOn ? '#892CDC' : 'black',
                color: 'white',
              }}
            >
              Update Instructor
            </Button>
          
        
      </Form>
    </div>
  );
}

export default InstructorUpdate;
