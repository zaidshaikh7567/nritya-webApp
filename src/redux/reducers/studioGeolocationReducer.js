// reducers/studioGeolocationReducer.js

import { ADD_STUDIO_GEOLOCATION, UPDATE_STUDIO_GEOLOCATION } from '../actionTypes';

const initialState = {};

const studioGeolocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_STUDIO_GEOLOCATION:
    case UPDATE_STUDIO_GEOLOCATION:
      const { studioId, geolocationData } = action.payload;
      return {
        ...state,
        [studioId]: geolocationData,
      };
    default:
      return state;
  }
};

export default studioGeolocationReducer;
