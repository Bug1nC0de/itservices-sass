import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  progress: null,
  file_url: null,
};

const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setFileUrl: (state, actions) => {
      state.file_url = actions.payload;
    },
    clearStorage: () => initialState,
  },
});

export const { setProgress, setFileUrl, clearStorage } = storageSlice.actions;

export default storageSlice.reducer;
