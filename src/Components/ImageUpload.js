import React, { useState,useEffect } from "react";
import shortid from "shortid";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { storage } from '../config';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 


const ImageUpload = ({entityId,storageFolder, maxImageCount, updateMode }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]); // Track new files to be added
  const [deletedFiles, setDeletedFiles] = useState([]); // Track deleted files
  const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn
  console.log("Received props=> entityId:", entityId, "|storageFolder:", storageFolder);
  console.log("enitity id ",entityId)
  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  useEffect(() => {
    console.log("Fetching image for",entityId)
    if(entityId){
      fetchStudioImages(entityId); // Fetch images when component mounts
    }
  }, [entityId]);

  useEffect(() => {
    console.log("Selected files:", selectedFiles);
  }, [selectedFiles]);

  const handleInputChange = (e) => {
    console.log("handleInputChange")
    const files = Array.from(e.target.files);
    const updatedFiles = [];
    console.log("file array ",files.length)
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedFiles.push({
          id: shortid.generate(),
          filename: file.name,
          filetype: file.type,
          fileimage: reader.result,
          datetime: file.lastModifiedDate.toLocaleString("en-IN"),
          filesize: filesizes(file.size),
          file: file, // Store the actual file object
        });

        if (updatedFiles.length === files.length) {
          setSelectedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
          setNewFiles(updatedFiles);
          console.log("New files in total",setNewFiles.length)
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleDeleteSelectedFile = (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      const fileToDelete = selectedFiles.find((file) => file.id === id);
      setDeletedFiles((prevDeletedFiles) => [...prevDeletedFiles, fileToDelete]);
      setSelectedFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== id)
      );
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    console.log("inside handleUploadSubmit ",entityId)
    if(!entityId){
      alert("No studio selected");
    }else if (selectedFiles.length > 0) {
      
        try {
          if(deletedFiles.length>0){
            console.log(deletedFiles," Deleting....")
            for (const fileToDelete of deletedFiles) {
              const fileRefToDelete = ref(storage, `${storageFolder}/${entityId}/${fileToDelete.filename}`);
              await deleteObject(fileRefToDelete);
            }
          }
          
          if(newFiles.length>0){
            console.log(newFiles.length,"New Files adding..")
            for (const newFileData of newFiles) {
              const folderPath = `${storageFolder}/${entityId}`;
              const fileRef = ref(storage, `${folderPath}/${newFileData.file.name}`);
              await uploadBytes(fileRef, newFileData.file);
            }
          }
          alert("Images Uploaded/Deleted")
          //setSelectedFiles([]);
          //setNewFiles([]);
          //setDeletedFiles([]);
  
          e.target.reset();
  
          
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      

      //setSelectedFiles([]);
    } else {
      alert("Please select a file.");
    }

    e.target.reset();
  };

  const handleDeleteFile = async (id, filename) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const folderPath = `${storageFolder}/${entityId}`; // Replace entityId with the actual user ID

        const fileRef = ref(storage, `${folderPath}/${filename}`);
        await deleteObject(fileRef);

        setUploadedFiles((prevFiles) =>
          prevFiles.filter((file) => file.id !== id)
        );
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };


  const fetchStudioImages = async (entityId) => {
    setSelectedFiles([]);
    setNewFiles([]);
    setDeletedFiles([]);
    try {
      const folderPath = `${storageFolder}/${entityId}`;
      console.log(folderPath)
      const folderRef = ref(storage, folderPath);
      const fileList = await listAll(folderRef);

      const files = await Promise.all(
        fileList.items.map(async (fileRef) => {
          const downloadURL = await getDownloadURL(fileRef);

          return {
            id: fileRef.name,
            filename: fileRef.name,
            fileURL: downloadURL,
          };
        })
      );
      console.log('File fetching',files);
      setUploadedFiles(files); // Update the uploadedFiles state with fetched data
      setSelectedFiles(files);
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };

  return (
    <div className="fileupload-view" style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      <div className="row justify-content-center m-0" style={{ flex: '1',justifyContent: 'center' }}>
        <div className="col-md-6" style={{ flex: '1' ,justifyContent: 'center'}}>
          <div className="card mt-5">
            <div className="card-body" style={{ backgroundColor: isDarkModeOn ? '#333333' : 'white' }}>
              <div className="kb-data-box">
                <div className="kb-modal-data-title">
                  <div className="kb-data-title" style={{justifyContent:'center',flex: '1'}}>
                    <h6>Image Upload</h6>
                  </div>
                </div>
                <form onSubmit={handleUploadSubmit} style={{  backgroundColor: isDarkModeOn ? '#333333' : 'white'}}>
                  <div className="kb-file-upload">
                    <div className="file-upload-box">
                      <input
                        type="file"
                        id="fileupload"
                        className="file-upload-input"
                        onChange={handleInputChange}
                        multiple
                      />

                    </div>
                  </div>
                  <div className="kb-attach-box mb-3">
                  <div className="row">
                    {selectedFiles.length > 0 ? (
                      selectedFiles.map((file) => (
                        <div key={file.id} className="col-6 col-md-3 mb-3">
                          <div className="card">
                            {file.filename.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
                              
                              
                              <img
                                src={file.fileimage ? file.fileimage: file.fileURL}
                                alt={file.filename}
                                className="card-img-top"
                                style={{ maxHeight: "150px", objectFit: "cover" }}
                              />
                            ) : (
                              <div className="card-body">
                                <i className="far fa-file-alt"></i>
                              </div>
                            )}
                            <div className="card-footer">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteSelectedFile(file.id)}
                              >
                                X
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center">
                        <p>No images selected</p>
                      </div>
                    )}
                  </div>

                  </div>

                  
                  <div className="kb-buttons-box">
                    <button
                      type="submit"
                      className="btn form-submit"
                      style={{ backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white'  }}
                      
                    >
                      Upload
                    </button>
                  </div>
                </form>
                {selectedFiles.length > 0 && (
                  <div className="kb-attach-box" hidden>
                    <div className="row">
                    <hr />
                    {selectedFiles.map((file) => (
                      <div key={file.id} className="col-6 col-md-3 mb-3">
                      <div className="card">
                        {file.filename.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
                          <img
                            src={file.fileimage}
                            alt={file.filename}
                            className="card-img-top"
                            style={{ maxHeight: "150px", objectFit: "cover" }}
                          />
                        ) : (
                          <div className="card-body">
                            <i className="far fa-file-alt"></i>
                          </div>
                        )}
                      </div>
                    </div>
                    ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Set default prop values
ImageUpload.defaultProps = {
  maxImageCount: 5, // Default maximum image count
  updateMode: false,
};

export default ImageUpload;