// actions/studioGeolocationActions.js

import { ADD_STUDIO_GEOLOCATION, UPDATE_STUDIO_GEOLOCATION } from '../actionTypes';

export const addStudioGeolocation = (studioId, geolocationData) => ({
  type: ADD_STUDIO_GEOLOCATION,
  payload: { studioId, geolocationData },
});

export const updateStudioGeolocation = (studioId, geolocationData) => ({
  type: UPDATE_STUDIO_GEOLOCATION,
  payload: { studioId, geolocationData },
});
