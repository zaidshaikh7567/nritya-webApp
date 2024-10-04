import { gMapApiKey } from '../config';

export const getBrowserLocation = () => {
  // const askForLocationPermission = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(showCity, handleLocationError);
  //   } else {
  //     alert('Geolocation is not supported by this browser or permission not granted');
  //   }
  // };

  // const showCity = (position) => {
  //   const latitude = position.coords.latitude;
  //   const longitude = position.coords.longitude;
  //   localStorage.setItem('browserGeoLoc', JSON.stringify({ latitude: latitude, longitude: longitude }));

  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${gMapApiKey.key}`;
  //   console.log(url);
  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       const addressComponents = data.results[0].address_components;

  //       // Log or store the entire address
  //       const completeAddress = addressComponents.map((component) => component.long_name).join(', ');
  //       console.log(`Your address is ${completeAddress}`);

  //       // Log or store specific components, e.g., country, state, city
  //       const city = addressComponents.find((component) => component.types.includes('locality')).long_name;
  //       const state = addressComponents.find((component) => component.types.includes('administrative_area_level_1')).long_name;
  //       const country = addressComponents.find((component) => component.types.includes('country')).long_name;
  //       localStorage.setItem('filterLocation', city);
  //       console.log(`Your address is City: ${city}`);
  //       console.log(`Your address is State: ${state}`);
  //       console.log(`Your address is Country: ${country}`);
  //       localStorage.setItem('browserLocation', city);
  //     })
  //     .catch((error) => console.log(error));
  // };

  // const handleLocationError = (error) => {
  //   console.log('Error getting location:', error.message);
  // };

  // askForLocationPermission();




  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        localStorage.setItem('browserGeoLoc', JSON.stringify({ latitude: latitude, longitude: longitude }));

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${gMapApiKey.key}`;
        console.log(url);
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            const addressComponents = data.results[0].address_components;

            // Log or store the entire address
            const completeAddress = addressComponents.map((component) => component.long_name).join(', ');
            console.log(`Your address is ${completeAddress}`);

            // Log or store specific components, e.g., country, state, city
            const city = addressComponents.find((component) => component.types.includes('locality')).long_name;
            const state = addressComponents.find((component) => component.types.includes('administrative_area_level_1')).long_name;
            const country = addressComponents.find((component) => component.types.includes('country')).long_name;
            localStorage.setItem('filterLocation', city);
            console.log(`Your address is City: ${city}`);
            console.log(`Your address is State: ${state}`);
            console.log(`Your address is Country: ${country}`);
            localStorage.setItem('browserLocation', city);
            resolve(city);
          })
          .catch((error) => {
            console.log(error)
            reject('Failed to get current location');
          });
      });
    } else {
      reject('Geolocation is not supported by this browser or permission not granted');
    }
  });
};
