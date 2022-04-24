import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchGrantsByMe, fetchGrantsToMe } from './feegrantAPI';

const initialState = {
  grantsToMe: {
    status: 'idle',
    errMsg: '',
    grants: []
  },
  grantsByMe: {
    status: 'idle',
    errMsg: '',
    grants: []
  },
};

export const getGrantsToMe = createAsyncThunk(
  'feegrant/grantsToMe',
  async (data) => {
    const response = await fetchGrantsToMe(data.baseURL, data.grantee, data.key, data.limit, 2);
    return response.data;
  }
);

export const getGrantsByMe = createAsyncThunk(
  'feegrant/grantsByMe',
  async (data) => {
    const response = await fetchGrantsByMe(data.baseURL, data.granter, data.key, data.limit, 2);
    return response.data;
  }
);

export const feegrantSlice = createSlice({
  name: 'feegrant',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGrantsToMe.pending, (state) => {
        state.grantsToMe.status = 'loading';
        state.grantsToMe.errMsg = ''

      })
      .addCase(getGrantsToMe.fulfilled, (state, action) => {
        state.grantsToMe.status = 'idle';
        state.grantsToMe.grants = action.payload
        state.grantsToMe.errMsg = ''
      })
      .addCase(getGrantsToMe.rejected, (state, action) => {
        state.grantsToMe.status = 'rejected';
        state.grantsToMe.errMsg = action.error.message
      })

      builder
      .addCase(getGrantsByMe.pending, (state) => {
        state.grantsByMe.status = 'loading';
        state.grantsByMe.errMsg = ''

      })
      .addCase(getGrantsByMe.fulfilled, (state, action) => {
        state.grantsByMe.status = 'idle';
        state.grantsByMe.grants = action.payload
        state.grantsByMe.errMsg = ''
      })
      .addCase(getGrantsByMe.rejected, (state, action) => {
        state.grantsByMe.status = 'rejected';
        state.grantsByMe.errMsg = action.error.message
      })
  },
});

export const { feegrant } = feegrantSlice.actions;

export default feegrantSlice.reducer;
