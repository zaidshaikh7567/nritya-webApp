import React, { useEffect } from 'react';
import { storage,gMapApiKey } from '../config';
import { selectRefreshLocation } from '../redux/selectors/refreshLocationSelector';
import { useSelector, useDispatch } from 'react-redux';
import { refreshLocation } from '../redux/actions/refreshLocationAction.js';

const LocationComponent = () => {
  const dispatch = useDispatch();
  const selectedLocation = useSelector(selectRefreshLocation);
  useEffect(() => {
    const askForLocationPermission = () => {
      //const permission = window.confirm('This app would like to access your location. Allow?');
      getLocation();
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showCity, handleLocationError);
      } else {
        alert('Geolocation is not supported by this browser or permission not granted');
      }
    };

    const showCity = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      localStorage.setItem('browserLocation', JSON.stringify({'latitude':latitude,'longitude':longitude}));

      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${gMapApiKey.key}`;
      console.log(url)
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          const city = data.results[0].address_components.find((component) =>
            component.types.includes('locality')
          ).long_name;
          dispatch(refreshLocation(city))
          localStorage.setItem('browserLocation', city);
          console.log(`Your city is ${city}.`);

        })
        .catch((error) => console.log(error));
    };

    const handleLocationError = (error) => {
      console.log('Error getting location:', error.message);
    };

    askForLocationPermission();
  }, []);

  // You can customize the rendering as needed
};

export default LocationComponent;
