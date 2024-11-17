import { COLORS, SERVER_URLS,BASEURL_DEV,BASEURL_PROD } from "../constants";

export async function postData(dbPayload, collection_name, notify, metadata) {
  const BASEURL = BASEURL_PROD;
  const endpoint = 'crud/newEntity/'; // Define your endpoint here
  const authToken = localStorage.getItem("authToken");
  try {
    const response = await fetch(BASEURL + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        data: dbPayload,
        collection_name: collection_name,
        notify: notify,
        metadata : metadata,
      }),
    });

    if (!response.ok) {
      console.log('Error in postData:', response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error in postData:', error);
    throw error;
  }
}

export async function putData(dbPayload, collection_name, entity_id, notify = null, metadata = null) {
  const BASEURL = BASEURL_PROD;
  const endpoint = `crud/updateEntity/${entity_id}`;
  const authToken = localStorage.getItem("authToken");
  try {
    const response = await fetch(BASEURL + endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        data: dbPayload,
        collection_name: collection_name,
        notify: notify,
        metadata : metadata,
      }),
    });

    if (!response.ok) {
      console.log('Error in postData:', response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error in postData:', error);
    throw error;
  }
}

export const getRandomColor = () => {
  const colorKeys = Object.keys(COLORS);
  const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
  return COLORS[randomKey];
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const bookEntity = async (bookingData) => {
  const url = `${SERVER_URLS.CLOUD}bookings/bookEntity/`; 

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: bookingData.userId,
        entityType: bookingData.entityType,
        entityId: bookingData.entityId,
        associatedStudioId: bookingData.associatedStudioId,
        emailLearner: bookingData.emailLearner,
        personsAllowed: bookingData.personsAllowed,
        pricePerPerson: bookingData.pricePerPerson,
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Booking successful:', result);
      return result;  // Return the successful result
    } else {
      console.error('Booking failed:', result);
      return result;  // Return null or an error message
    }
    
  } catch (error) {
    console.error('Error occurred while booking:', error);
    return null;  // Return null or an error message
  }
};


// Function to decode a Unicode (UTF-8) encoded string back to the original text
export const decodeUnicode = (unicodeString) => {
  const utf8Encoded = unicodeString.split('').map((c) => c.charCodeAt(0));
  const textDecoder = new TextDecoder();
  return textDecoder.decode(new Uint8Array(utf8Encoded));
};

export const convertToHtmlEntities= (text) =>{
  return text.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
      return '&#' + i.charCodeAt(0) + ';';
  });
}

export const getYoutubeVideoId = (link)=> {
  console.log("MediaDisplay", link)
  if (!link){
    return null
  }
  const text = link.trim();
  const youtubeRegExp = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w\-]+)/;
  const match = text.match(youtubeRegExp);
  let videoId = null;

  if (match) {
    videoId = match[1];
  }
  console.log("MediaDisplay", videoId)
  return videoId
}

export const gradientStyles = [
  { background: 'linear-gradient(to bottom right, #FFD700, #FFA500)', color: 'black' },
  { background: 'linear-gradient(to bottom right, #00BFFF, #1E90FF)', color: 'black' },
  { background: 'linear-gradient(to bottom right, #32CD32, #008000)', color: 'white' },
  { background: 'linear-gradient(to bottom right, #FFA500, #FF4500)', color: 'black' },
  { background: 'linear-gradient(to bottom right, #DC143C, #8B0000)', color: 'white' },
  { background: 'linear-gradient(to bottom right, #000000, #2F4F4F)', color: 'white' },
];