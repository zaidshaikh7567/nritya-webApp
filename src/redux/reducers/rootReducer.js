// rootReducer.js
import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import darkModeReducer from './darkModeReducer';

const rootReducer = combineReducers({
  counter: counterReducer,
  darkMode: darkModeReducer,
  // Add other reducers here
});

export default rootReducer;
