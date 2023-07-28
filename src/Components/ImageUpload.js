import React, { useState } from "react";
import shortid from "shortid";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { storage } from '../config';

const ImageUpload = ({studioId}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  console.log("Studio",studioId)
  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = [];

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

   const handleUploadSubmit = async (e) => {
    e.preventDefault();
    console.log("inside handleUploadSubmit ")
    if (selectedFiles.length > 0) {
      for (const fileData of selectedFiles) {
        try {
          const folderPath = `StudioImages/${studioId}`; // Replace studioId with the actual user ID

          const fileRef = ref(storage, `${folderPath}/${fileData.file.name}`);
          console.log(fileRef)
          await uploadBytes(fileRef, fileData.file);
          
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }

      setSelectedFiles([]);
    } else {
      alert("Please select a file.");
    }

    e.target.reset();
  };

  const handleDeleteFile = async (id, filename) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const folderPath = `StudioImages/${studioId}`; // Replace studioId with the actual user ID

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

  // Fetch all images of a user using their studioId
  const fetchStudioImages = async () => {
    try {
      const folderPath = `StudioImages/${studioId}`; // Replace studioId with the actual user ID

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

      setUploadedFiles(files);
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };

  return (
    <div className="fileupload-view">
      <div className="row justify-content-center m-0">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <div className="kb-data-box">
                <div className="kb-modal-data-title">
                  <div className="kb-data-title">
                    <h6>Multiple Image Upload</h6>
                  </div>
                </div>
                <form onSubmit={handleUploadSubmit}>
                  <div className="kb-file-upload">
                    <div className="file-upload-box">
                      <input
                        type="file"
                        id="fileupload"
                        className="file-upload-input"
                        onChange={handleInputChange}
                        multiple
                      />
                      <span>
                        Drag and drop or{" "}
                        <span className="file-link">Choose your files</span>
                      </span>
                    </div>
                  </div>
                  <div className="kb-attach-box mb-3">
                    {selectedFiles.map((file) => (
                      <div className="file-atc-box" key={file.id}>
                        {file.filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                          <div className="file-image">
                            <img
                              src={file.fileimage}
                              alt={file.filename}
                              className="preview-image"
                              style={{maxHeight:"300px",maxWidth:"100%" }}
                            />
                            <br />
                            <button
                              type="button"
                              className="file-delete-btn"
                              onClick={() => handleDeleteSelectedFile(file.id)}
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="file-image file-icon">
                            <i className="far fa-file-alt"></i>
                          </div>
                        )}
                        <div className="file-detail">
                          <h6>{file.filename}</h6>
                          <p>
                            <span>Size: {file.filesize}</span>
                            <span className="ml-2">
                              Modified Time: {file.datetime}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="kb-buttons-box">
                    <button
                      type="submit"
                      className="btn btn-primary form-submit"
                    >
                      Upload
                    </button>
                  </div>
                </form>
                {uploadedFiles.length > 0 && (
                  <div className="kb-attach-box">
                    <hr />
                    {uploadedFiles.map((file) => (
                      <div className="file-atc-box" key={file.id}>
                        {file.filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                          <div className="file-image">
                            <img
                              src={file.fileURL}
                              alt={file.filename}
                              className="preview-image"
                            />
                          </div>
                        ) : (
                          <div className="file-image file-icon">
                            <i className="far fa-file-alt"></i>
                          </div>
                        )}
                        <div className="file-detail">
                          <h6>{file.filename}</h6>
                          <p>
                            <span>Size: {file.filesize}</span>
                            <span className="ml-3">
                              Modified Time: {file.datetime}
                            </span>
                          </p>
                          <div className="file-actions">
                            <button
                              className="file-action-btn"
                              onClick={() => handleDeleteFile(file.id, file.filename)}
                            >
                              Delete
                            </button>
                            <a
                              href={file.fileURL}
                              className="file-action-btn"
                              download={file.filename}
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default ImageUpload;