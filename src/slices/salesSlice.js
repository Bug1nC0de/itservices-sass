import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lead: null,
  leads: null,
  closed_leads: null,
  loading: true,
  notes: null,
  follow: null,
  done: null,
  scheduled: null,
  lead_notes: [],
  leadFollowUps: [],
  collabCacheAdd: [],
  collabCacheRemove: [],
  client: null,
  fileUploadStatus: 0,
  leadFileUrl: null,
  texts: null,
  collab_leads: null,
  myContacts: null,
  reviewContacts: null,
  items: [],
  quote: null,
  invoice: null,
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setLead: (state, action) => {
      state.lead = action.payload;
    },
    setLeads: (state, action) => {
      state.leads = action.payload;
    },
    setClosedLeads: (state, action) => {
      state.closed_leads = action.payload;
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    setFollow: (state, action) => {
      state.follow = action.payload;
    },
    setDone: (state, action) => {
      state.done = action.payload;
    },
    setScheduled: (state, action) => {
      state.scheduled = action.payload;
    },
    setLeadNotes: (state, action) => {
      state.lead_notes = action.payload;
    },
    setLeadFollowUps: (state, action) => {
      state.leadFollowUps = action.payload;
    },
    setCollabCachedAdd: (state, action) => {
      state.collabCacheAdd = action.payload;
    },
    setCollabCachedRemove: (state, action) => {
      state.collabCacheRemove = action.payload;
    },
    setClient: (state, action) => {
      state.client = action.payload;
    },
    setFileUploadStatus: (state, action) => {
      state.fileUploadStatus = action.payload;
    },
    setLeadFileUrl: (state, action) => {
      state.leadFileUrl = action.payload;
    },
    setTexts: (state, action) => {
      state.texts = action.payload;
    },
    setCollabLeads: (state, action) => {
      state.collab_leads = action.payload;
    },
    setMyContacts: (state, action) => {
      state.myContacts = action.payload;
    },
    setReviewContacts: (state, action) => {
      state.reviewContacts = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setQuote: (state, action) => {
      state.quote = action.payload;
    },
    setInvoice: (state, action) => {
      state.invoice = action.payload;
    },
    resetSales: () => initialState,
  },
});

export const {
  setLead,
  setLeads,
  setCollabLeads,
  setClosedLeads,
  setNotes,
  setFollow,
  setDone,
  setLeadFollowUps,
  setCollabCachedAdd,
  setCollabCachedRemove,
  setClient,
  setFileUploadStatus,
  setLeadFileUrl,
  setMyContacts,
  setReviewContacts,
  setItems,
  setQuote,
  setInvoice,
  setScheduled,
  setTexts,
  setLeadNotes,
  resetSales,
} = salesSlice.actions;

export default salesSlice.reducer;
