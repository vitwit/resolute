import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import feegrantService from './feegrantService';

const initialState = {
  grantsToMe: {
    status: 'idle',
    grants: []
  },
  errState: {
    message: '',
    type: 'success',
  },
  grantsByMe: {
    status: 'idle',
    grants: []
  },
};

export const getGrantsToMe = createAsyncThunk(
  'feegrant/grantsToMe',
  async (data) => {
    const response = await feegrantService.grantsToMe(data.baseURL, data.grantee, data.pagination);
    return response.data;
  }
);

export const getGrantsByMe = createAsyncThunk(
  'feegrant/grantsByMe',
  async (data) => {
    const response = await feegrantService.grantsByMe(data.baseURL, data.granter, data.pagination);
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
        state.errState = {
          message: '',
          type: 'success',
        }

      })
      .addCase(getGrantsToMe.fulfilled, (state, action) => {
        state.grantsToMe.status = 'idle';
        state.grantsToMe.grants = action.payload
        state.errState = {
          message: '',
          type: 'success',
        }
      })
      .addCase(getGrantsToMe.rejected, (state, action) => {
        state.grantsToMe.status = 'rejected';
        state.errState = {
          message: action.error.message,
          type: 'error',
        }
      })

      builder
      .addCase(getGrantsByMe.pending, (state) => {
        state.grantsByMe.status = 'loading';
        state.errState = {
          message: '',
          type: 'error',
        }

      })
      .addCase(getGrantsByMe.fulfilled, (state, action) => {
        state.grantsByMe.status = 'idle';
        state.grantsByMe.grants = action.payload
        state.errMsg = {
          message: '',
          type: 'success',
        }
      })
      .addCase(getGrantsByMe.rejected, (state, action) => {
        state.grantsByMe.status = 'rejected';
        state.errMsg = {
          message: action.error.message,
          type: 'error',
        }
      })
  },
});

export default feegrantSlice.reducer;
