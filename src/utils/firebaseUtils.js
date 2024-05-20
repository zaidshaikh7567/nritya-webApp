import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, getDocs, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../config';
import { getStorage,ref,listAll,getDownloadURL,uploadBytes, deleteObject  } from "firebase/storage";
import { storage } from '../config';
  
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

  // Function to delete images
export const deleteImages = async (storageFolder,imagesToDelete,entityId) => {
    /*
    Description: Deletes specific images associated with the given entityId.

    Args:
      imagesToDelete <array>: An array of image objects to be deleted.
      storageFolder <string>: The folder path in the storage where the images are stored.
      entityId <string>: UserId,StudioId like thing.
    */
    await Promise.all(imagesToDelete.map(async (file) => {
      const fileRefToDelete = ref(storage, `${storageFolder}/${entityId}/${file.filename}`);
      await deleteObject(fileRefToDelete);
    }));
  };

  // Function to upload new images
export const uploadImages = async (storageFolder, newImages, entityId) => {
    /*
    Description: Uploads new images associated with the given entityId.

    Args:
      newImages <array>: An array of new image objects to be uploaded.
      storageFolder <string>: The folder path in the storage where the images are stored.
      entityId <string>: UserId,StudioId like thing.
    */
   console.log(storageFolder,entityId)
    await Promise.all(newImages.map(async (newFileData) => {
      const folderPath = `${storageFolder}/${entityId}`;
      const fileRef = ref(storage, `${folderPath}/${newFileData.file.name}`);
      await uploadBytes(fileRef, newFileData.file);
    }));
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
  
  export const getAllImagesInFolder = async (storageFolder) => {
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

