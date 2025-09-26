import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  services: null,
  client: null,
  docServices: null,
  quotes: null,
  invoices: null,
  info: null,
};

const accountingSlice = createSlice({
  name: 'accounting',
  initialState,
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setClient: (state, action) => {
      state.client = action.payload;
    },
    setDocServices: (state, action) => {
      state.docServices = action.payload;
    },
    setQuotes: (state, action) => {
      state.quotes = action.payload;
    },
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    setInfo: (state, action) => {
      state.info = action.payload;
    },
    resetAccounting: () => initialState,
  },
});

export const {
  setServices,
  setClient,
  setDocServices,
  setQuotes,
  setInvoices,
  setInfo,
} = accountingSlice.actions;

export default accountingSlice.reducer;
