import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clients: null,
  client: null,
  users: null,
  user: null,
  branches: null,
  departments: null,
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    setClient: (state, action) => {
      state.client = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setClientBranches: (state, action) => {
      state.branches = action.payload;
    },
    setClientDepartments: (state, action) => {
      state.departments = action.payload;
    },
    resetClient: () => initialState,
  },
});

export const {
  setClients,
  setClient,
  setUsers,
  setUser,
  setClientBranches,
  setClientDepartments,
  resetClient,
} = clientSlice.actions;

export default clientSlice.reducer;
