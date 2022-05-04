import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authzService from './authzService';
import { fee, signAndBroadcastProto } from '../../txns/execute';
import { AuthzSendGrantMsg, AuthzGenericGrantMsg, AuthzRevokeMsg } from '../../txns/proto';

const initialState = {
  grantsToMe: {
    status: 'idle',
    errMsg: '',
    grants: [],
    pagination: {}
  },
  grantsByMe: {
    status: 'idle',
    errMsg: '',
    grants: [],
    pagination: {}
  },
  tx: {
    sendGrant: {
      status: 'idle',
      errMsg: '',
      successMsg: ''
    },
    genericGrant: {
      status: 'idle',
      errMsg: '',
      successMsg: ''
    }
  }
};

export const getGrantsToMe = createAsyncThunk(
  'authz/grantsToMe',
  async (data) => {
    const response = await authzService.grantsToMe(data.baseURL, data.grantee, data.pagination);
    return response.data;
  }
);

export const getGrantsByMe = createAsyncThunk(
  'authz/grantsByMe',
  async (data) => {
    const response = await authzService.grantsByMe(data.baseURL, data.granter, data.pagination);
    return response.data;
  }
);

export const txAuthzSend = createAsyncThunk(
  'authz/tx-send',
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      const msg = AuthzSendGrantMsg(data.granter, data.grantee, data.denom, data.spendLimit, data.expiration)
      console.log(msg)
      const result = await signAndBroadcastProto([msg], fee(data.denom, data.feeAmount), data.memo, data.rpc)
      return fulfillWithValue({payload: result});
    } catch (error) {
      return rejectWithValue(error)
    }
  }
);

export const txAuthzRevoke = createAsyncThunk(
  'authz/tx-revoke',
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      const msg = AuthzRevokeMsg(data.granter, data.grantee, data.typeURL)
      const result = await signAndBroadcastProto([msg], fee(data.denom, data.feeAmount), data.memo, data.rpc);
      console.log(result);
      return fulfillWithValue({payload: result});
    } catch (error) {
      console.log(error);
      return rejectWithValue(error)
    }
  }
);

export const txAuthzGeneric = createAsyncThunk(
  'authz/tx-generic',
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log(data)
      const msg = AuthzGenericGrantMsg(data.granter, data.grantee, data.typeUrl, data.expiration)
      console.log(msg)
      const result = await signAndBroadcastProto([msg], fee(data.denom, data.feeAmount), data.memo, data.rpc)
      return fulfillWithValue({payload: result});
    } catch (error) {
      return rejectWithValue(error)
    }
  }
);



export const authzSlice = createSlice({
  name: 'authz',
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
        state.grantsToMe.grants = action.payload.grants
        state.grantsToMe.pagination = action.payload.pagination
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
        state.grantsByMe.grants = action.payload.grants
        state.grantsByMe.pagination = action.payload.pagination
        state.grantsByMe.errMsg = ''
      })
      .addCase(getGrantsByMe.rejected, (state, action) => {
        state.grantsByMe.status = 'rejected';
        state.grantsByMe.errMsg = action.error.message
      })



      builder
      .addCase(txAuthzSend.pending, (state) => {
        state.tx.sendGrant.status = `pending`
        state.tx.sendGrant.errMsg = ``
        state.tx.sendGrant.successMsg = ``

      })
      .addCase(txAuthzSend.fulfilled, (state, action) => {
        console.log(action)
        state.tx.sendGrant.status = `idle`
        state.tx.sendGrant.errMsg = ``
        state.tx.sendGrant.successMsg = ``
      })
      .addCase(txAuthzSend.rejected, (state, action) => {
        console.log(action)
        state.tx.sendGrant.status = `rejected`
        state.tx.sendGrant.errMsg = ``
        state.tx.sendGrant.successMsg = ``
      })

      builder
      .addCase(txAuthzGeneric.pending, (state) => {
        state.tx.genericGrant.status = `pending`
        state.tx.genericGrant.errMsg = ``
        state.tx.genericGrant.successMsg = ``

      })
      .addCase(txAuthzGeneric.fulfilled, (state, action) => {
        console.log(action)
        state.tx.genericGrant.status = `idle`
        state.tx.genericGrant.errMsg = ``
        state.tx.genericGrant.successMsg = ``
      })
      .addCase(txAuthzGeneric.rejected, (state, action) => {
        console.log(action)
        state.tx.genericGrant.status = `rejected`
        state.tx.genericGrant.errMsg = ``
        state.tx.genericGrant.successMsg = ``
      })
  },
});

export default authzSlice.reducer;
