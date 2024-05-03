// rootReducer.js
import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import darkModeReducer from './darkModeReducer';
import refreshLocationReducer from './refreshLocationReducer';
import studioGeolocationReducer from './studioGeolocationReducer';


const rootReducer = combineReducers({
  counter: counterReducer,
  darkMode: darkModeReducer,
  refreshLocation: refreshLocationReducer,
  studioGeolocation: studioGeolocationReducer,

  // Add other reducers here
});

export default rootReducer;
