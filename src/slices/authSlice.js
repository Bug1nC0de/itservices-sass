import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  location: localStorage.getItem('browser-location')
    ? localStorage.getItem('browser-location')
    : null,
  orders: null,
  contract: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    removeCredentials: (state) => {
      state.userInfo = null;
      state.orders = null;
      state.contract = null;
      localStorage.removeItem('userInfo');
    },
    setLocation: (state, action) => {
      state.location = action.payload;
      localStorage.setItem('browser-location', action.payload);
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setContract: (state, action) => {
      state.contract = action.payload;
    },
  },
});

export const {
  setCredentials,
  removeCredentials,
  setLocation,
  setOrders,
  setContract,
} = authSlice.actions;

export default authSlice.reducer;
