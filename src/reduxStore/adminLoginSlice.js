import { createSlice } from '@reduxjs/toolkit';

const storedAdminLogin = localStorage.getItem('adminLogin');
const adminLoginSlice = createSlice({
  name: 'adminLogin',
  initialState: {
    value:storedAdminLogin ? JSON.parse(storedAdminLogin) : false,
  },
  reducers: {
    adminLoginFn: (state) => {
      state.value = true;
      localStorage.setItem('adminLogin', true);
    },
    adminLogoutFn: (state) => {
      state.value = false;
      localStorage.setItem('adminLogin', false);
    },
  },
});

export const { adminLoginFn, adminLogoutFn } = adminLoginSlice.actions;

export default adminLoginSlice.reducer;
