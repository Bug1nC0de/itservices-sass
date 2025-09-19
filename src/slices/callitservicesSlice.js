import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: null,
  ticket: null,
  ticketTexts: null,
  projects: null,
  project: null,
  projectTexts: null,
};

const callITServicesSlice = createSlice({
  name: 'callitservices',
  initialState,
  reducers: {
    setITTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setITTicket: (state, action) => {
      state.ticket = action.payload;
    },
    setITProjects: (state, action) => {
      state.projects = action.payload;
    },
    setITProject: (state, action) => {
      state.project = action.payload;
    },
    setTicketTexts: (state, action) => {
      state.ticketTexts = action.payload;
    },
    setProjectTexts: (state, action) => {
      state.projectTexts = action.payload;
    },
    resetITServices: () => initialState,
  },
});

export const {
  setITTickets,
  setITTicket,
  setITProjects,
  setITProject,
  setTicketTexts,
  setProjectTexts,
  resetITServices,
} = callITServicesSlice.actions;

export default callITServicesSlice.reducer;
