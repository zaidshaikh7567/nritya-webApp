import { configureStore } from '@reduxjs/toolkit';
import adminLoginReducer from './adminLoginSlice';

const store = configureStore({
  reducer: {
    adminLogin: adminLoginReducer,
  },
});

export default store;
