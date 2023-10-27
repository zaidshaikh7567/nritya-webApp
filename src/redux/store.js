// store.js
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/rootReducer';

// Add any middleware you want to use, for example, Redux Thunk
import thunk from 'redux-thunk';

const middleware = [thunk];

const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;
