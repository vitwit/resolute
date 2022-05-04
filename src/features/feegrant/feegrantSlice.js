import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FeegrantBasicMsg } from '../../txns/proto';
import feegrantService from './feegrantService';
import { fee, signAndBroadcastProto } from '../../txns/execute';
import { AuthzSendGrantMsg, SendMsg, AuthzGenericGrantMsg } from '../../txns/proto';

const initialState = {
  grantsToMe: {
    status: 'idle',
    grants: []
  },
  errState: {
    message: '',
    type: '',
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


export const txFeegrantBasic = createAsyncThunk(
  'feegrant/tx-basic',
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      const msg = FeegrantBasicMsg(data.granter, data.grantee, data.expiration)
      const result = await signAndBroadcastProto([msg], fee(data.denom, data.feeAmount), data.memo, data.rpc)
      return fulfillWithValue({payload: result});
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
);

export const txAuthzGeneric = createAsyncThunk(
  'feegrant/tx-generic',
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log(data)
      const msg = AuthzGenericGrantMsg(data.granter, data.grantee, data.typeUrl, data.expiration)
      console.log(msg)
      const result = await signAndBroadcastProto([msg], fee(data.denom, data.feeAmount), data.memo, data.rpc)
      return fulfillWithValue({payload: result});
    } catch (error) {
      return rejectWithValue(error.response)
    }
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
          type: '',
        }

      })
      .addCase(getGrantsToMe.fulfilled, (state, action) => {
        state.grantsToMe.status = 'idle';
        state.grantsToMe.grants = action.payload
        state.errState = {
          message: '',
          type: '',
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
          type: '',
        }

      })
      .addCase(getGrantsByMe.fulfilled, (state, action) => {
        state.grantsByMe.status = 'idle';
        state.grantsByMe.grants = action.payload
        state.errState = {
          message: '',
          type: '',
        }
      })
      .addCase(getGrantsByMe.rejected, (state, action) => {
        state.grantsByMe.status = 'rejected';
        state.errState = {
          message: action.error.message,
          type: 'error',
        }
      })
  },
});

export default feegrantSlice.reducer;
