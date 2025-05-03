import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import shortid from "shortid";
import { ref as firebaseRef, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../config';
import { useSelector } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { deleteAllImagesInFolder,deleteImages,uploadImages} from '../utils/firebaseUtils'
import { Card, CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from "../context/SnackbarContext";
import { STORAGES } from "../constants";
import { useLoader } from "../context/LoaderContext";


const ImageUpload = forwardRef(({entityId,storageFolder,title, maxImageCount=10, minImageCount, updateMode, disable }, ref) => {
  const { setIsLoading } = useLoader();
  const showSnackbar = useSnackbar();
  const imageInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]); // Track new files to be added
  const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn
  //console.log("Received props=> entityId:", entityId, "|storageFolder:", storageFolder);
  const [progressDelete, setProgressDelete] = useState(-1);
  const [progressUpdate, setProgressUpdate] = useState(-1);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);

  console.log("Kyc enitity id ",entityId, disable)
  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  useEffect(() => {
   // console.log("Fetching image for",entityId)
    if(entityId){
      fetchStudioImages(entityId); // Fetch images when component mounts
    }
  }, [entityId]);

  useEffect(() => {
   // console.log("Selected files:", selectedFiles);
    if (maxImageCount && selectedFiles.length > maxImageCount) {
      const truncatedFiles = selectedFiles.slice(0, maxImageCount);
      alert(`Exceeded maxImageCount, keeping first ${maxImageCount} files.`);
      imageInputRef.current.value = null;
      setSelectedFiles(truncatedFiles);
    }
  }, [selectedFiles, maxImageCount]);
  

  const handleInputChange = (e) => {
    // console.log("handleInputChange")
    const files = Array.from(e.target.files);
    const updatedFiles = [];
    // console.log("file array ",files.length)
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
          imageInputRef.current.value = null;
          // console.log("New files in total",setNewFiles.length)
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleDeleteSelectedFile = (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      setSelectedFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== id)
      );
    }
  };

  const handleUploadSubmit = async () => {
    if (!entityId) {
      alert("No studio selected");
      return;
    }

    setProgressDelete(-1);
    setProgressUpdate(-1);

    try {
      setIsLoading(true);
      if (maxImageCount === 1 && selectedFiles.length >= minImageCount) {
        // Delete all previous images in the folder
        await deleteAllImagesInFolder(storageFolder, entityId);
        await uploadImages(storageFolder,newFiles, entityId, setProgressUpdate);
        showSnackbar("Image uploaded successfully", "success");
        setIsUploadSuccessful(true);
      } else {
        // Calculate images to delete and add
        const { imagesToDelete, newImages } = calculateDelta(selectedFiles, uploadedFiles);

        if (minImageCount && newImages.length < minImageCount) {
          showSnackbar(`Minimum ${minImageCount} image(s) are required`, "error");
          return;
        }

        // Delete images if there are any
        if (imagesToDelete.length > 0) {
          await deleteImages(storageFolder, imagesToDelete, entityId, setProgressDelete);
          showSnackbar("Image(s) deleted successfully", "success");
        }

        // Upload new images if there are any
        if (newImages.length > 0) {
          await uploadImages(storageFolder, newImages, entityId, setProgressUpdate);
          showSnackbar("Image(s) uploaded successfully", "success");
        }
        setIsUploadSuccessful(true);
      }

      imageInputRef.current.value = null;
      // alert("Images Uploaded/Deleted");
    } catch (error) {
      setIsUploadSuccessful(false);
      console.error("Error uploading/deleting images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to calculate images to delete and new images to upload
  const calculateDelta = (selectedFiles, uploadedFiles) => {
    const selectedFileIds = selectedFiles.map(file => file.id);
    const uploadedFileIds = uploadedFiles.map(file => file.id);

    const imagesToDelete = uploadedFiles.filter(file => !selectedFileIds.includes(file.id));
    const newImages = selectedFiles.filter(file => !uploadedFileIds.includes(file.id));

    return { imagesToDelete, newImages };
  };


  const fetchStudioImages = async (entityId) => {
    setSelectedFiles([]);
    setNewFiles([]);
    try {
      const folderPath = `${storageFolder}/${entityId}`;
      console.log(folderPath)
      const folderRef = firebaseRef(storage, folderPath);
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
      // console.log('File fetching',files);
      setUploadedFiles(files); // Update the uploadedFiles state with fetched data
      setSelectedFiles(files);
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    isValid: () => {
      if (minImageCount === 0) return true;
      return isUploadSuccessful
    },
  }));

  return (
    <div className="fileupload-view" style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      <div className="row justify-content-center m-0" style={{ flex: '1',justifyContent: 'center' }}>
        <div className="col-md-6" style={{ flex: '1' ,justifyContent: 'center'}}>
          <div className="card mt-5">
            <div className="card-body" style={{ backgroundColor: isDarkModeOn ? '#333333' : 'white' }}>
              <div className="kb-data-box">
                <div className="kb-modal-data-title">
                  <div className="kb-data-title" style={{justifyContent:'center',flex: '1'}}>
                    <h4 style={{textTransform:'none'}}>{title}</h4>
                    <p>Max no of image(s):{maxImageCount} {storageFolder === STORAGES.STUDIOIMAGES && <p>Add at least 5 images</p>}</p>
                  </div>
                </div>
                <div style={{  backgroundColor: isDarkModeOn ? '#333333' : 'white'}}>
                  <div className="kb-file-upload">
                    <div className="file-upload-box">
                      <input
                        ref={imageInputRef}
                        type="file"
                        id="fileupload"
                        className="file-upload-input"
                        onChange={handleInputChange}
                        multiple
                      />

                    </div>
                  </div>
                  <br></br>
                  <div className="kb-attach-box mb-3">
                  <div className="row">
                    {entityId && selectedFiles.length > 0 ? (
                      selectedFiles.map((file) => (
                        
                        <div key={file.id} className="col-6 col-md-3 mb-3" style={{ position: 'relative' }}>
                          
                          <Card sx={{ maxWidth: 345 }}>
                            {file.filename.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
                              <div style={{ position: 'relative' }}>
                                <img
                                  src={file.fileimage ? file.fileimage : file.fileURL}
                                  alt={file.filename}
                                  className="card-img-top"
                                  style={{ maxHeight: "150px", objectFit: "cover" }}
                                />
                                <IconButton
                                  aria-label="delete"
                                  disabled={disable}
                                  onClick={() => handleDeleteSelectedFile(file.id)}
                                  style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                                >
                                  <DeleteIcon style={{color:"ff0000"}}/>
                                </IconButton>
                              </div>
                            ) : (
                              <CardContent>
                                <i className="far fa-file-alt"></i>
                              </CardContent>
                            )}
                          </Card>
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
                      type="button"
                      className="btn div-submit"
                      style={{ backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white'  }}
                      onClick={handleUploadSubmit}
                      disabled={disable}
                    >
                      Image Upload
                    </button>
                  </div>
                </div>
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
              { progressDelete >= 0 && (
                    <div>
                        <p style={{ color: isDarkModeOn ? '#fff' : '#000' }}>
                            Deleting images... {progressDelete.toFixed(2)}%
                        </p>
                        <progress 
                            value={progressDelete} 
                            max="100" 
                            style={{
                                color: isDarkModeOn ? '#fff' : '#000'
                            }}
                        >
                            {progressDelete.toFixed(2)}%
                        </progress>
                    </div>
                )}

                { progressUpdate >= 0 && (
                    <div>
                        <p style={{ color: isDarkModeOn ? '#fff' : '#000' }}>
                            Uploading images... {progressUpdate.toFixed(2)}%
                        </p>
                        <progress 
                            value={progressUpdate} 
                            max="100" 
                            style={{
                                color: isDarkModeOn ? '#fff' : '#000'
                            }}
                        >
                            {progressUpdate.toFixed(2)}%
                        </progress>
                    </div>
                )}

                            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Set default prop values
ImageUpload.defaultProps = {
  maxImageCount: 5, // Default maximum image count
  updateMode: false,
  disable:false,
};

export default ImageUpload;