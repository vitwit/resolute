import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authzService from './authzService';
import { fee, signAndBroadcastProto } from '../../txns/execute';
import { AuthzSendGrantMsg, AuthzGenericGrantMsg, AuthzRevokeMsg } from '../../txns/proto';
import { setError, setTxHash } from '../common/commonSlice';

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
      status: 'idle',
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
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = AuthzSendGrantMsg(data.granter, data.grantee, data.denom, data.spendLimit, data.expiration)
      const result = await signAndBroadcastProto([msg], fee(data.denom, data.feeAmount), "", data.rpc)
      if (result?.code === 0) {
        dispatch(setTxHash({
          hash: result?.transactionHash
        }))
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(setError({
          type: 'error',
          message: result?.rawLog
        }))
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(setError({
        type: 'error',
        message: error.message
      }))
      return rejectWithValue(error.message)
    }
  }
);

export const txAuthzRevoke = createAsyncThunk(
  'authz/tx-revoke',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = AuthzRevokeMsg(data.granter, data.grantee, data.typeURL)
      const result = await signAndBroadcastProto([msg], fee(data.denom, data.feeAmount), "", data.rpc);
      if (result?.code === 0) {
        dispatch(setTxHash({
          hash: result?.transactionHash
        }))
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(setError({
          type: 'error',
          message: result?.rawLog
        }))
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(setError({
        type: 'error',
        message: error.message
      }))
      return rejectWithValue(error.message)
    }
  }
);

export const txAuthzGeneric = createAsyncThunk(
  'authz/tx-generic',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = AuthzGenericGrantMsg(data.granter, data.grantee, data.typeUrl, data.expiration)
      const result = await signAndBroadcastProto([msg], fee(data.denom, data.feeAmount), "", data.rpc)
      if (result?.code === 0) {
        dispatch(setTxHash({
          hash: result?.transactionHash
        }))
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(setError({
          type: 'error',
          message: result?.rawLog
        }))
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(setError({
        type: 'error',
        message: error.message
      }))
      return rejectWithValue(error.message);
    }
  }
);



export const authzSlice = createSlice({
  name: 'authz',
  initialState,
  reducers: {
    resetAlerts: (state) => {
      state.tx = {
        grant: {
          status: 'idle',
          errMsg: '',
          txHash: '',
        },
        revoke: {
          status: 'idle',
          errMsg: '',
          txHash: '',
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGrantsToMe.pending, (state) => {
        state.grantsToMe.status = 'pending';
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
        state.grantsByMe.status = 'pending';
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
        state.tx.status = `pending`

      })
      .addCase(txAuthzSend.fulfilled, (state, _) => {
        state.tx.status = `idle`
      })
      .addCase(txAuthzSend.rejected, (state, _) => {
        state.tx.status = `rejected`
      })

    builder
      .addCase(txAuthzGeneric.pending, (state) => {
        state.tx.status = `pending`;
      })
      .addCase(txAuthzGeneric.fulfilled, (state, _) => {
        state.tx.status = `idle`
      })
      .addCase(txAuthzGeneric.rejected, (state, _) => {
        state.tx.status = `rejected`
      })

    builder
      .addCase(txAuthzRevoke.pending, (state) => {
        state.tx.status = `pending`

      })
      .addCase(txAuthzRevoke.fulfilled, (state, _) => {
        state.tx.status = `idle`
      })
      .addCase(txAuthzRevoke.rejected, (state, _) => {
        state.tx.status = `rejected`
      })
  },
});

export const {resetAlerts} = authzSlice.actions;

export default authzSlice.reducer;
