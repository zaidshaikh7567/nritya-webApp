import React, { useState, useEffect } from "react";
import { Form, Button, Col, Row, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { COLLECTIONS } from "../constants";
import { STORAGES } from "../constants";
import { db, storage } from "../config";
import { putData } from "../utils/common";
import { createTheme, ThemeProvider } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";
import danceStyles from "../danceStyles.json";

function InstructorUpdate({ instructors, setInstructors }) {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toUploadImage, setToUploadImage] = useState(null);
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);

  const danceStylesOptions = danceStyles.danceStyles;

  const darkTheme = createTheme({
    palette: {
      mode: isDarkModeOn ? "dark" : "light",
    },
  });

  const handleDanceStylesChange = (event, value) => {
    setSelectedDanceStyles(value);
  };

  // Handle instructor selection from dropdown
  const handleInstructorSelection = async (event) => {
    event.preventDefault();
    const instructorId = event.target.value;
    ////console.log(instructorId);
    const instructorDoc = await getDoc(
      doc(db, COLLECTIONS.INSTRUCTORS, instructorId)
    );
    const instructorData = instructorDoc.data();
    setSelectedInstructor({
      id: instructorDoc.id,
      ...instructorData,
    });
    setSelectedDanceStyles(instructorData?.danceStyles?.split?.(",") || []);
    //////console.log(selectedInstructor);
  };

  useEffect(() => {
    if (selectedInstructor) {
      ////console.log("Instructor id changes : ",selectedInstructor.id)
      const userId = selectedInstructor.id;
      //////console.log(userId)
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
                    ////console.log("Image selected: ",selectedImage);
                  })
                  .catch((error) => {
                    console.error("Error fetching studio icon:", error);
                  });
              } else {
                ////console.log('No files found in the folder.');
                setSelectedImage(null);
                setToUploadImage(null);
              }
            })
            .catch((error) => {
              console.error("Error listing files in the folder:", error);
            });
        } catch (error) {
          console.error("Error fetching studio icon:", error);
        }
      }
      //setSelectedInstructors((selectedStudio.instructorsNames));
      // setSelectedImage
    }
  }, [selectedInstructor]);

  // Handle image change
  const handleImageChangeUpdate = (e) => {
    ////console.log("Selected file new:");
    const file = e.target.files[0];
    ////console.log("Selected file:", file);

    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setToUploadImage(file);
    }
  };

  // Handle form submission for updating instructor
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!selectedInstructor) {
      alert("Please select an instructor to update.");
      return;
    }

    try {
      // Update instructor details
      const updatedInstructorData = {
        name: e.target.name.value,
        danceStyles: selectedDanceStyles?.join?.(",") || "",
        experience: e.target.experience.value,
        age: e.target.age.value,
        email: e.target.email.value,
        description: e.target.description.value,
        facebook: e.target.facebook.value,
        instagram: e.target.instagram.value,
        twitter: e.target.twitter.value,
        youtube: e.target.youtube.value,
      };

      const response = await putData(
        updatedInstructorData,
        COLLECTIONS.INSTRUCTORS,
        selectedInstructor.id
      );

      if (response.ok) {
        // Merge the updated details into the selected instructor
        setSelectedInstructor((prevInstructor) => ({
          ...prevInstructor,
          ...updatedInstructorData,
        }));

        if (selectedImage && toUploadImage) {
          const imageUrl = await handleProfilePictureChange(
            toUploadImage,
            selectedInstructor.id
          );
          ////console.log('Profile picture uploaded:', imageUrl);
        }

        ////console.log('Instructor updated successfully');
        alert("Instructor updated successfully");
      } else {
        console.error("Error adding instructor:", response.statusText);
      }

      /*

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
        ////console.log('Profile picture uploaded:', imageUrl);
      }

      ////console.log('Instructor updated successfully');
      alert('Instructor updated successfully');
      */
    } catch (error) {
      console.error("Error updating instructor", error);
      alert("Error updating instructor");
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
      console.error("Error handling profile picture:", error);
      throw error;
    }
  };

  return (
    <div>
      <h1
        style={{
          color: isDarkModeOn ? "white" : "black",
          textTransform: "capitalize",
        }}
      >
        Update Dance Teacher
      </h1>
      <Form className="mt-4" onSubmit={handleUpdateSubmit}>
        <Form.Control
          as="select"
          onChange={handleInstructorSelection}
          style={{
            backgroundColor: isDarkModeOn ? "#333333" : "",
            color: isDarkModeOn ? "white" : "black",
            height: "auto",
            marginBottom: "1rem",
          }}
        >
          <option
            style={{
              backgroundColor: isDarkModeOn ? "#333333" : "",
              color: isDarkModeOn ? "white" : "black",
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

        <Row className="gy-3">
          <Col md={4} className="text-center">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>
                <Row>
                  <div
                    style={{
                      width: "18rem",
                      height: "18rem",
                      borderRadius: "1rem",
                      overflow: "hidden",
                      margin: "auto",
                      backgroundColor: isDarkModeOn ? "#d3d3d3" : "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedImage && (
                      <Image
                        src={selectedImage}
                        alt="Selected"
                        style={{
                          width: "100%",
                          height: "100%",
                          display: selectedImage ? "block" : "none",
                        }}
                      />
                    )}
                  </div>
                </Row>
              </Form.Label>
              {/* <Row> */}
              <div className="mt-3">
                <label
                  htmlFor="fileInput"
                  className="btn btn-primary"
                  style={{
                    cursor: "pointer",
                    borderRadius: "14px",
                    textTransform: "capitalize",
                  }}
                >
                  Image +
                  <input
                    type="file"
                    id="fileInput"
                    name="picture"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChangeUpdate}
                  />
                </label>
              </div>

              {/* <div style={{ textAlign: "center" }}>
                  <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                    <span
                      style={{ marginBottom: "2px", fontSize: "2rem" }}
                    ></span>
                    <input
                      type="file"
                      id="fileInput"
                      name="picture"
                      accept="image/*"
                      style={{}}
                      onChange={handleImageChangeUpdate}
                    />
                  </label>
                </div> */}
              {/* </Row> */}
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                defaultValue={selectedInstructor ? selectedInstructor.name : ""}
                style={{
                  backgroundColor: isDarkModeOn ? "#333333" : "",
                  color: isDarkModeOn ? "white" : "black",
                }}
              />
            </Form.Group>

            <Row className="mt-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter age"
                    name="age"
                    defaultValue={
                      selectedInstructor ? selectedInstructor.age : ""
                    }
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Experience</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter experience (in years)"
                    name="experience"
                    defaultValue={
                      selectedInstructor ? selectedInstructor.experience : ""
                    }
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* <Form.Label>Dance Styles</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter dance styles"
              name="danceStyles"
              defaultValue={
                selectedInstructor ? selectedInstructor.danceStyles : ""
              }
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
            /> */}

            <Form.Group className="mt-3">
              <Form.Label>Dance Styles</Form.Label>
              <ThemeProvider theme={darkTheme}>
                <Autocomplete
                  style={{
                    backgroundColor: isDarkModeOn ? "#333333" : "",
                    color: isDarkModeOn ? "white" : "black",
                  }}
                  multiple
                  options={danceStylesOptions}
                  value={selectedDanceStyles}
                  onChange={handleDanceStylesChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      placeholder="Select Dance Styles"
                      style={{
                        backgroundColor: isDarkModeOn ? "#333333" : "",
                        color: isDarkModeOn ? "white" : "black",
                      }}
                    />
                  )}
                />
              </ThemeProvider>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email Id of instructor"
                name="email"
                defaultValue={
                  selectedInstructor ? selectedInstructor.email : ""
                }
                style={{
                  backgroundColor: isDarkModeOn ? "#333333" : "",
                  color: isDarkModeOn ? "white" : "black",
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter description"
          name="description"
          defaultValue={
            selectedInstructor ? selectedInstructor.description : ""
          }
          style={{
            backgroundColor: isDarkModeOn ? "#333333" : "",
            color: isDarkModeOn ? "white" : "black",
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
              defaultValue={
                selectedInstructor ? selectedInstructor.facebook : ""
              }
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
            />
          </Col>
          <Col>
            <FaInstagram size={30} />
            <Form.Control
              type="text"
              placeholder="Enter Instagram profile URL"
              name="instagram"
              defaultValue={
                selectedInstructor ? selectedInstructor.instagram : ""
              }
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
            />
          </Col>
          <Col>
            <FaTwitter size={30} />
            <Form.Control
              type="text"
              placeholder="Enter Twitter profile URL"
              name="twitter"
              defaultValue={
                selectedInstructor ? selectedInstructor.twitter : ""
              }
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
            />
          </Col>
          <Col>
            <FaYoutube size={30} />
            <Form.Control
              type="text"
              placeholder="Enter Youtube channel URL"
              name="youtube"
              defaultValue={
                selectedInstructor ? selectedInstructor.youtube : ""
              }
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
            />
          </Col>
        </Row>

        <Button
          variant="primary"
          type="submit"
          style={{
            backgroundColor: isDarkModeOn ? "#892CDC" : "black",
            color: "white",
          }}
        >
          Update Instructor
        </Button>
      </Form>
    </div>
  );
}

export default InstructorUpdate;
