import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  client: null,
  users: null,
  branches: [],
  branch_info: null,
  departments: [],
  department_info: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setClient: (state, action) => {
      state.client = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setBranches: (state, action) => {
      state.branches = action.payload;
    },
    setBranchInfo: (state, action) => {
      state.branch_info = action.payload;
    },
    setDepartments: (state, action) => {
      state.departments = action.payload;
    },
    setDepartmentInfo: (state, action) => {
      state.department_info = action.payload;
    },
    resetUserState: () => initialState,
  },
});

export const {
  setClient,
  setUsers,
  setBranches,
  setBranchInfo,
  setDepartments,
  setDepartmentInfo,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
