import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, getDocs, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../config';
import {ref,listAll,getDownloadURL,uploadBytes, deleteObject, uploadBytesResumable  } from "firebase/storage";
import { storage } from '../config';
import { BASEURL_DEV, BASEURL_PROD } from '../constants';
import secureLocalStorage from 'react-secure-storage';

export const setCreatorMode = async (uid) => {
  const BASEURL = BASEURL_PROD;
  const url = `${BASEURL}crud/getUserMode/${uid}`;
  //console.log("creatorMode uid", uid, url);
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      let mode = false;
      if (data.data === true) {
        mode = true;
      }
      //console.log("setCreatorMode: Is User a creator?", mode);
      secureLocalStorage.setItem('CreatorMode', mode);
    } else {
      console.log("Error: ", data.message || "Unknown error");
      //secureLocalStorage.setItem('CreatorMode', false);
    }
    
  } catch (error) {
    console.log("Error fetching user mode: ", error);
    secureLocalStorage.setItem('CreatorMode', false);
  }
}

export const fetchStudioEntities = async (studioId, entityType, setState) => {
  const BASE_URL = BASEURL_PROD;
  try {
    const url = `${BASE_URL}crud/asscoiatedEntities/${studioId}/${entityType}/`;
    console.log(url)
    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      setState(data.data);
    } else {
      console.error(`Error fetching ${entityType}:`, data.error);
    }
  } catch (error) {
    console.error(`Error fetching ${entityType}:`, error);
  }
};


export const getCreatorMode = async () => {
  try{
    const mode = secureLocalStorage.getItem('CreatorMode');
    console.log("getCreatorMode ",mode)
    if (mode){
      return mode
    }else{
      return false
    }
  } 
  catch(error){
    console.log(" error");
    return false
  }
}

export const setGetCreatorModeOnMount = async (uid) => {
  await setCreatorMode(uid);
  return await getCreatorMode();
};


// Read operation with image URL
export const readDocumentWithImageUrl = async (collectionName, productId) => {
    console.log("Debug ",`${collectionName}/${productId}`)
    const storagePath = `${collectionName}/${productId}`;
    const folderRef = ref(storage,storagePath);
    try {
        const result = await listAll(folderRef);
        if (result.items.length > 0) {
            const firstFileRef = result.items[0];
            const url = await getDownloadURL(firstFileRef);
            console.log('Debug URL:', url);
            return url;
          } else {
            console.log('Debug No files found in the folder.');
            return null;
          }
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };

// Read operation
export const readDocument = async (collectionName, documentId) => {
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot.exists() ? docSnapshot.data() : null;
};

// Create or Update operation
export const saveDocument = async (collectionName, documentId, data) => {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, data, { merge: true });
    return data;
};


export const handleSavePostOTPSuccess = async (collectionName, documentId, phoneNumber) => {
  const docRef = doc(db, collectionName, documentId);
  await updateDoc(docRef, {isPhoneNumberVerified:true,phoneNumber});
  return true;
};

// Update specific fields in a document
export const updateDocumentFields = async (collectionName, documentId, fields) => {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, fields);
    return { id: documentId, ...fields };
};

// Delete operation
export const deleteDocument = async (collectionName, documentId) => {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    return { id: documentId };
};

// Query operation
export const queryDocuments = async (collectionName, conditions) => {
    const q = query(collection(db, collectionName, conditions));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const queryDocumentsCount = async (collectionName,field,operation,value) => {
    console.log("Hiii ",collectionName,field,operation,value)
    const q = query(collection(db, collectionName), where(field,operation,value));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};


  // Function to delete all images in a folder
export  const deleteAllImagesInFolder = async (storageFolder, entityId) => {
    /*
    Description: Deletes all images in the specified folder associated with the given entityId.

    Args:
      storageFolder <string>: The folder path in the storage where the images are stored.
      entityId <string>: The unique identifier of the entity whose images are to be deleted eg UserId,StudioId like thing.
    */
    const folderPath = `${storageFolder}/${entityId}`;
    const folderRef = ref(storage, folderPath);
    const fileList = await listAll(folderRef);

    await Promise.all(fileList.items.map(async (fileRef) => {
      await deleteObject(fileRef);
    }));
  };

    // Function to delete all images in a folder
  export  const deleteAllImagesInFolder2 = async (storageFolder, entityId,subfolder) => {
    /*
    Description: Deletes all images in the specified folder associated with the given entityId.

    Args:
      storageFolder <string>: The folder path in the storage where the images are stored.
      entityId <string>: The unique identifier of the entity whose images are to be deleted eg UserId,StudioId like thing.
    */
    const folderPath = `${storageFolder}/${entityId}/${subfolder}`;
    const folderRef = ref(storage, folderPath);
    const fileList = await listAll(folderRef);

    await Promise.all(fileList.items.map(async (fileRef) => {
      await deleteObject(fileRef);
    }));
  };

  // Function to delete images
export const deleteImages = async (storageFolder,imagesToDelete,entityId,setProgress,thirdFolder=null) => {
    /*
    Description: Deletes specific images associated with the given entityId.

    Args:
      imagesToDelete <array>: An array of image objects to be deleted.
      storageFolder <string>: The folder path in the storage where the images are stored.
      entityId <string>: UserId,StudioId like thing.
    */
    const total = imagesToDelete.length;
    let done = 0;
    await Promise.all(imagesToDelete.map(async (file) => {
      let folderPath = `${storageFolder}/${entityId}/${file.filename}`;
      if (thirdFolder){
         folderPath = `${storageFolder}/${entityId}/${thirdFolder}/${file.filename}`;
      }
      const fileRefToDelete = ref(storage, folderPath);
      await deleteObject(fileRefToDelete);
      done += 1;
      setProgress((done / total) * 100);
    }));
  };

  // Function to upload new images
export const uploadImages = async (storageFolder, newImages, entityId,setProgress,thirdFolder=null) => {
    /*
    Description: Uploads new images associated with the given entityId.

    Args:
      newImages <array>: An array of new image objects to be uploaded.
      storageFolder <string>: The folder path in the storage where the images are stored.
      entityId <string>: UserId,StudioId like thing.
    */
   console.log(storageFolder,entityId)
   const total = newImages.length;
    let done = 0;
    await Promise.all(newImages.map(async (newFileData) => {
      let folderPath = `${storageFolder}/${entityId}`;
      if (thirdFolder){
         folderPath = `${storageFolder}/${entityId}/${thirdFolder}`;
      }
      const fileRef = ref(storage, `${folderPath}/${newFileData.file.name}`);
      await uploadBytes(fileRef, newFileData.file);
      done += 1;
      setProgress((done / total) * 100);
    }));
  };

  export const uploadImages2 = async (storageFolder, newImages, entityId, thirdFolder = null) => {
    /*
    Description: Uploads new images associated with the given entityId.
  
    Args:
      newImages <FileList or Array>: An array of File objects to be uploaded.
      storageFolder <string>: The folder path in the storage where the images are stored.
      entityId <string>: UserId, StudioId, etc.
      thirdFolder <string|null>: Optional subfolder.
    */

    let folderPath = `${storageFolder}/${entityId}`;
    if (thirdFolder){
      folderPath = `${storageFolder}/${entityId}/${thirdFolder}`;
    }
    console.log(newImages.name)
    const storageRef =  ref(storage, `${folderPath}/${newImages.name}`);
    uploadBytesResumable(storageRef, newImages).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
  };

  export const uploadImages3 = async (storageFolder, newImages, entityId, thirdFolder = null) => {
    /*
    Description: Uploads new images associated with the given entityId.
  
    Args:
      newImages <FileList or Array>: An array of File objects to be uploaded.
      storageFolder <string>: The folder path in the storage where the images are stored.
      entityId <string>: UserId, StudioId, etc.
      thirdFolder <string|null>: Optional subfolder.
    */

    let folderPath = `${storageFolder}/${entityId}`;
    if (thirdFolder){
      folderPath = `${storageFolder}/${entityId}/${thirdFolder}`;
    }
    console.log(newImages.name)
    const storageRef =  ref(storage, `${folderPath}/${newImages.name}`);
    const uploadTask = uploadBytesResumable(storageRef, newImages);
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
    
  };


  export const uploadImages4 = async (storageFolder, newImages, entityId, thirdFolder = null, onProgress, onComplete) => {
    /*
    Description: Uploads new images associated with the given entityId.
  
    Args:
      newImages <FileList or Array>: An array of File objects to be uploaded.
      storageFolder <string>: The folder path in the storage where the images are stored.
      entityId <string>: UserId, StudioId, etc.
      thirdFolder <string|null>: Optional subfolder.
    */

    let folderPath = `${storageFolder}/${entityId}`;
    if (thirdFolder){
      folderPath = `${storageFolder}/${entityId}/${thirdFolder}`;
    }
    console.log(newImages,newImages.name)
    const storageRef =  ref(storage, `${folderPath}/${newImages.name}`);
    const uploadTask = uploadBytesResumable(storageRef, newImages);
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const totalBytes = snapshot.totalBytes;
        const bytesTransferred = snapshot.bytesTransferred;
        const progress = totalBytes > 0 ? ((bytesTransferred / totalBytes) * 100).toFixed(2) : -1;
        onProgress(progress);
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          onComplete(downloadURL);
        });

      }
    );
    
  };


 export const uploadOneImageAndGetURL = async (storageFolder, file, entityId) => {
    try {
      const folderPath = `${storageFolder}/${entityId}/${file.name}`;
      console.log(folderPath)
      const fileRef = ref(storage, folderPath);
      
      await uploadBytes(fileRef, file);
  
      const imageUrl = await getDownloadURL(fileRef);
      console.log(imageUrl)
      return imageUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; 
    }
  };
  
  export const getAllFilesFromFolder = async (storageFolder) => {
    const folderPath = `${storageFolder}`;
    const folderRef = ref(storage, folderPath);
    
    try {
        const fileList = await listAll(folderRef);

        const imageUrlsComprehensive = await Promise.all(
          fileList.items.map(async (fileRef) => {
            const downloadURL = await getDownloadURL(fileRef);
  
            return {
              id: fileRef.name,
              filename: fileRef.name,
              fileURL: downloadURL,
            };
          })
        );

        // return imageUrls;
        return imageUrlsComprehensive
    } catch (error) {
        console.error('Error retrieving images:', error);
        throw error;
    }
};

