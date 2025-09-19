import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  suppliers: null,
  supplier: null,
  vetted_suppliers: null,
  supplier_apps: null,
};

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setSuppliers: (state, action) => {
      state.suppliers = action.payload;
    },
    setSupplier: (state, action) => {
      state.supplier = action.payload;
    },
    setVettedSuppliers: (state, action) => {
      state.vetted_suppliers = action.payload;
    },
    setSupplierApps: (state, action) => {
      state.supplier_apps = action.payload;
    },
    resetSuppliersSlice: () => initialState,
  },
});

export const {
  setSuppliers,
  setSupplier,
  resetSuppliersSlice,
  setVettedSuppliers,
  setSupplierApps,
} = supplierSlice.actions;

export default supplierSlice.reducer;
