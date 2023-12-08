// rootReducer.js
import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import darkModeReducer from './darkModeReducer';
import refreshLocationReducer from './refreshLocationReducer';

const rootReducer = combineReducers({
  counter: counterReducer,
  darkMode: darkModeReducer,
  refreshLocation: refreshLocationReducer,

  // Add other reducers here
});

export default rootReducer;
