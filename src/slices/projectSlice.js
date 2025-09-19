import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  project: null,
  project_next: null,
  project_milestone: null,
  projects: null,
  client_projects: null,
  next: null,
  milestones: null,
  feature: null,
  texts: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload;
    },
    setProjectNext: (state, action) => {
      state.project_next = action.payload;
    },
    setProjectMileStone: (state, action) => {
      state.project_milestone = action.payload;
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setClientProjects: (state, action) => {
      state.client_projects = action.payload;
    },
    setNext: (state, action) => {
      state.next = action.payload;
    },
    setMilestones: (state, action) => {
      state.milestones = action.payload;
    },
    setFeature: (state, action) => {
      state.feature = action.payload;
    },
    setTexts: (state, action) => {
      state.texts = action.payload;
    },
    resetProjects: () => initialState,
  },
});

export const {
  setProject,
  setProjectNext,
  setProjectMileStone,
  setProjects,
  setClientProjects,
  setNext,
  setMilestones,
  setFeature,
  setTexts,
  resetProjects,
} = projectSlice.actions;

export default projectSlice.reducer;
