import React, { useState, useEffect } from 'react';
import { db } from '../config';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import StarRating from './StarRating';

function Ratings({ userID, studioID }) {
  const [rating, setRating] = useState(-1);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    // Fetch the average rating from the Studio collection
    const fetchAverageRating = async () => {
      try {
        const studioRef = doc(db, 'Studio', studioID);
        const studioSnapshot = await getDoc(studioRef);

        if (studioSnapshot.exists()) {
          const studioData = studioSnapshot.data();
          setAverageRating(studioData.avgRating);
        }

        // Fetch and set the user's rating if userID is available
        if (userID) {
          const ratingRef = doc(db, 'Ratings', `${userID}_${studioID}`);
          const ratingSnapshot = await getDoc(ratingRef);

          if (ratingSnapshot.exists()) {
            const userRating = ratingSnapshot.data().rating;
            setRating(userRating);
          } else {
            // User hasn't rated this studio yet
            setRating(-1);
          }
        }
      } catch (error) {
        console.error('Error fetching average rating:', error);
      }
    };

    fetchAverageRating();
  }, [studioID, userID]);

  const handleRatingChange = async (newRating) => {
    // Check if userID is null, and if so, do not proceed with rating updates
    if (!userID) {
      // Redirect to the login page if userID is null
      window.location.href = '#/login'; // Modify this URL to the actual login page URL
      return;
    }

    // Update the rating in the Rating collection in Firebase
    const ratingRef = doc(db, 'Ratings', `${userID}_${studioID}`);
    const ratingData = {
      userID,
      studioID,
      rating: newRating,
    };
  
    try {
      // Check if the document already exists in Ratings collection
      const ratingSnapshot = await getDoc(ratingRef);
  
      if (ratingSnapshot.exists()) {
        // Document exists, get the old rating
        const oldRating = ratingSnapshot.data().rating;

        // Fetch the current studio data from Firestore
        const studioRef = doc(db, 'Studio', studioID);
        const studioSnapshot = await getDoc(studioRef);
  
        if (studioSnapshot.exists()) {
          const studioData = studioSnapshot.data();
  
          // Calculate the new totalRating, ratedBy, and avgRating, considering the possibility of missing fields
          let totalRating = studioData.totalRating || 0;
          let ratedBy = studioData.ratedBy || 0;
          let avgRating = studioData.avgRating || 0;
  
          // Subtract the old rating and add the new rating
          totalRating = totalRating - oldRating + newRating;
          avgRating = totalRating / ratedBy;
  
          // Update the studio data in Firestore
          await updateDoc(studioRef, {
            totalRating,
            ratedBy,
            avgRating,
          });
  
          // Update the rating in Ratings collection
          await updateDoc(ratingRef, ratingData);
  
          // Update the local state with the new rating and averageRating
          setRating(newRating);
          setAverageRating(avgRating);
        } else {
          console.error('Studio document does not exist.');
        }
      } else {
        // Document doesn't exist, create it
        await setDoc(ratingRef, ratingData);
  
        // Fetch the current studio data from Firestore
        const studioRef = doc(db, 'Studio', studioID);
        const studioSnapshot = await getDoc(studioRef);
  
        if (studioSnapshot.exists()) {
          const studioData = studioSnapshot.data();
  
          // Calculate the new totalRating, ratedBy, and avgRating, considering the possibility of missing fields
          let totalRating = studioData.totalRating || 0;
          let ratedBy = studioData.ratedBy || 0;
          let avgRating = studioData.avgRating || 0;
  
          // Add the new rating
          totalRating += newRating;
          ratedBy += 1;
          avgRating = ratedBy > 0 ? totalRating / ratedBy : 0;
  
          // Update the studio data in Firestore
          await updateDoc(studioRef, {
            totalRating,
            ratedBy,
            avgRating,
          });
  
          // Update the local state with the new rating and averageRating
          setRating(newRating);
          setAverageRating(avgRating);
        } else {
          console.error('Studio document does not exist.');
        }
      }
    } catch (error) {
      console.error('Error updating rating or studio data:', error);
    }
  };
  
  return (
    <div>
      <p>
        {userID ? (
          `${rating !== -1 ? "" : 'You have not rated this studio yet.'}`
        ) : (
          <a href="#/login">
            <StarRating rating={rating} onRatingChange={handleRatingChange} />
          </a>
        )}
      </p>
      <StarRating rating={averageRating} viewMode={true} />
      {userID ? <StarRating rating={rating} onRatingChange={handleRatingChange} viewMode={false}/> : null}
    </div>
  );
}

export default Ratings;
