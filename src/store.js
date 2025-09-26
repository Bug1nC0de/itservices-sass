import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import helpDeskReducer from './slices/helpDeskSlice';
import clientReducer from './slices/clientSlice';
import salesReducer from './slices/salesSlice';
import todoReducer from './slices/todoSlice';
import projectReducer from './slices/projectSlice';
import supplierReducer from './slices/supplierSlice';
import storageReducer from './slices/storageSlice';
import callITServicesReducer from './slices/callitservicesSlice';
import accountingReducer from './slices/accountingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    helpdesk: helpDeskReducer,
    clients: clientReducer,
    sales: salesReducer,
    todos: todoReducer,
    projects: projectReducer,
    suppliers: supplierReducer,
    storage: storageReducer,
    callitservices: callITServicesReducer,
    accounting: accountingReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
});

export default store;
