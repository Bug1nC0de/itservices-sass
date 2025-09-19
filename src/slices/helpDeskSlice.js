import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: null,
  unassigned_tickets: null,
  pending_tickets: null,
  still_active: null,
  closed_tickets: null,
  client_tickets: null,
  user_tickets: null,
  ticket: null,
  texts: null,
  time_on_tickets: null,
  most_active: null,
};

const helpdeskSlice = createSlice({
  name: 'helpdesk',
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setPendingTickets: (state, action) => {
      state.pending_tickets = action.payload;
    },
    setMostActiveClients: (state, action) => {
      state.most_active = action.payload;
    },
    setStillActive: (state, action) => {
      state.still_active = action.payload;
    },
    setClosedTickets: (state, action) => {
      state.closed_tickets = action.payload;
    },
    setUnAssignedTickets: (state, action) => {
      state.unassigned_tickets = action.payload;
    },
    setClientTickets: (state, action) => {
      state.client_tickets = action.payload;
    },
    setUserTickets: (state, action) => {
      state.user_tickets = action.payload;
    },
    setTicket: (state, action) => {
      state.ticket = action.payload;
    },
    setTexts: (state, action) => {
      state.texts = action.payload;
    },
    setTimeOnTickets: (state, action) => {
      state.time_on_tickets = action.payload;
    },
    resetHelpdesk: () => initialState,
  },
});

export const {
  setTickets,
  setPendingTickets,
  setMostActiveClients,
  setStillActive,
  setClosedTickets,
  setClientTickets,
  setUserTickets,
  setTicket,
  setTexts,
  resetHelpdesk,
  setUnAssignedTickets,
  setTimeOnTickets,
} = helpdeskSlice.actions;

export default helpdeskSlice.reducer;
