import React, { useState } from "react";
import { Form, Button, Col, Row, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { addDoc, collection } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { COLLECTIONS } from "../constants";
import { STORAGES } from "../constants";
import { db } from "../config";
import { storage } from "../config";
import { postData } from "../utils/common";
import danceStyles from "../danceStyles.json";
import { Autocomplete, TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const handleProfilePictureChange = async (file, userId) => {
  console.log("Inside handleProfilePictureChange");
  try {
    // Delete old files in the storage folder
    const storageFolder = STORAGES.INSTRUCTORIMAGES; // Replace with your desired storage folder name
    const folderPath = `${storageFolder}/${userId}`;
    const storageRef = ref(storage, folderPath);
    console.log("handleProfilePictureChange ", storageFolder, folderPath);

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
    throw error; // Propagate the error up
  }
};

function InstructorAdd() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image
  const [toUploadImage, setToUploadImage] = useState(null);
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);

  const danceStylesOptions = danceStyles.danceStyles;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setToUploadImage(file);
    }
  };

  const handleDanceStylesChange = (event, value) => {
    setSelectedDanceStyles(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Hi");
    let createdBy = null;
    if (
      JSON.parse(localStorage.getItem("userInfo")) &&
      JSON.parse(localStorage.getItem("userInfo")).UserId
    ) {
      createdBy = JSON.parse(localStorage.getItem("userInfo")).UserId;
    }
    if (!createdBy) {
      console.log("Created by not found");
      alert("User not found");
    }
    const currentUserEmail = JSON.parse(
      localStorage.getItem("userInfo")
    )?.email;
    console.log(createdBy);
    try {
      const instructorData = {
        name: e.target.name.value,
        danceStyles: selectedDanceStyles?.join(",") || "",
        experience: e.target.experience.value,
        age: e.target.age.value,
        email: e.target.email.value,
        description: e.target.description.value,
        facebook: e.target.facebook.value,
        instagram: e.target.instagram.value,
        twitter: e.target.twitter.value,
        youtube: e.target.youtube.value,
        createdBy: createdBy,
        ownedBy: null,
      };

      const notifyEmails = currentUserEmail;
      const metaData = {
        entity_name: e.target.name.value,
      };
      const response = await postData(
        instructorData,
        COLLECTIONS.INSTRUCTORS,
        notifyEmails,
        metaData
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Instructor added:", result, result?.id);

        if (selectedImage && toUploadImage && result.id) {
          // const file = e.target.files[0];
          const imageUrl = await handleProfilePictureChange(
            toUploadImage,
            result.id
          );
          console.log("Profile picture uploaded:", imageUrl);
        }
      } else {
        console.error("Error adding instructor:", response.statusText);
      }

      console.log("Instructor added successfully");
      alert("Instructor added successfully");
    } catch (error) {
      alert("Error", error);
    }
  };

  const darkTheme = createTheme({
    palette: {
      mode: isDarkModeOn ? "dark" : "light",
    },
  });

  return (
    <div
      style={{
        backgroundColor: isDarkModeOn ? "#202020" : "white",
        color: isDarkModeOn ? "white" : "black",
      }}
    >
      <Row>
        <Col md={4}>
          <h1
            style={{
              backgroundColor: isDarkModeOn ? "#202020" : "white",
              color: isDarkModeOn ? "white" : "black",
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            Add Dance Teacher
          </h1>
        </Col>
      </Row>
      <Form className="mt-4" onSubmit={handleSubmit}>
        <Row className="gy-3">
          <Col md={4} className="text-center">
            <Form.Group controlId="formFile">
              <Form.Label>
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
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt="Selected"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: selectedImage ? "block" : "none",
                      }}
                    />
                  ) : (
                    <span style={{ color: "white", fontSize: "1rem" }}>
                      No Image
                    </span>
                  )}
                </div>
              </Form.Label>
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
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </Form.Group>
          </Col>

          <Col md={8}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                style={{
                  backgroundColor: isDarkModeOn ? "#333" : "",
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
                    style={{
                      backgroundColor: isDarkModeOn ? "#333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Experience (Years)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter experience"
                    name="experience"
                    style={{
                      backgroundColor: isDarkModeOn ? "#333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

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
                placeholder="Enter email ID of instructor"
                name="email"
                style={{
                  backgroundColor: isDarkModeOn ? "#333" : "",
                  color: isDarkModeOn ? "white" : "black",
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            name="description"
            style={{
              backgroundColor: isDarkModeOn ? "#333333" : "",
              color: isDarkModeOn ? "white" : "black",
            }}
            required
          />
        </Row>
        <Form.Label>Social Links</Form.Label>
        <Row>
          <Col>
            <FaFacebook
              size={30}
              style={{ color: isDarkModeOn ? "white" : "black" }}
            />
            <Form.Control
              type="text"
              placeholder="Enter Facebook profile URL"
              name="facebook"
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
            />
          </Col>
          <Col>
            <FaInstagram
              size={30}
              style={{ color: isDarkModeOn ? "white" : "black" }}
            />
            <Form.Control
              type="text"
              placeholder="Enter Instagram profile URL"
              name="instagram"
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
            />
          </Col>
          <Col>
            <FaTwitter
              size={30}
              style={{ color: isDarkModeOn ? "white" : "black" }}
            />
            <Form.Control
              type="text"
              placeholder="Enter Twitter profile URL"
              name="twitter"
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
            />
          </Col>
          <Col>
            <FaYoutube
              size={30}
              style={{ color: isDarkModeOn ? "white" : "black" }}
            />
            <Form.Control
              type="text"
              placeholder="Enter Youtube channel URL"
              name="youtube"
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
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default InstructorAdd;
