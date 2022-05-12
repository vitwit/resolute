import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FeegrantBasicMsg, FeegrantRevokeMsg } from '../../txns/proto';
import feegrantService from './feegrantService';
import { fee, signAndBroadcastProto } from '../../txns/execute';

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
  tx: {
    basicGrant: {
      status: 'idle',
      errMsg: '',
      successMsg: ''
    },
    periodicGrant: {
      status: 'idle',
      errMsg: '',
      successMsg: ''
    },
    revokeGrant: {
      status: 'idle',
      errMsg: '',
      successMsg: ''
    }
  }
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
      const msg = FeegrantBasicMsg(data.granter, data.grantee,data.denom, data.spendLimit, data.expiration)
      const result = await signAndBroadcastProto([msg], fee(data.denom, data.feeAmount), "", data.rpc)
      if (result?.code === 0) {
        return fulfillWithValue({txHash: result?.transactionHash});
        } else {
          return rejectWithValue(result?.rawLog);
        }
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
);

export const txGrantPeriodic = createAsyncThunk(
  'feegrant/tx-periodic',
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      const msg = FeegrantBasicMsg(data.granter, data.grantee, data.typeUrl, data.expiration)
      const result = await signAndBroadcastProto([msg], fee(data.denom, data.feeAmount), "", data.rpc)
      if (result?.code === 0) {
        return fulfillWithValue({txHash: result?.transactionHash});
        } else {
          return rejectWithValue(result?.rawLog);
        }
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
);

export const txRevoke = createAsyncThunk(
  'feegrant/tx-revoke',
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      const msg = FeegrantRevokeMsg(data.granter, data.grantee)
      const result = await signAndBroadcastProto([msg], fee(data.denom, data.feeAmount), "", data.rpc)
      if (result?.code === 0) {
        return fulfillWithValue({txHash: result?.transactionHash});
        } else {
          return rejectWithValue(result?.rawLog);
        }
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
);

export const feegrantSlice = createSlice({
  name: 'feegrant',
  initialState,
  reducers: {
    resetAlerts: (state) => {
      state.tx = {
        errState: {
          message: '',
          type: '',
        },
        basicGrant: {
          status: 'idle',
          errMsg: '',
          successMsg: ''
        },
        periodicGrant: {
          status: 'idle',
          errMsg: '',
          successMsg: ''
        },
        revokeGrant: {
          status: 'idle',
          errMsg: '',
          successMsg: ''
        }
      }
  },
  },
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
        state.grantsToMe.grants = action.payload?.allowances
        state.grantsToMe.pagination = action.payload?.pagination
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
        state.grantsByMe.grants = action.payload?.allowances
        state.grantsByMe.pagination = action.payload?.pagination
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


      // txns
      builder
      .addCase(txFeegrantBasic.pending, (state) => {
        state.tx.basicGrant.status = `pending`
        state.tx.basicGrant.errMsg = ``
        state.tx.basicGrant.successMsg = ``

      })
      .addCase(txFeegrantBasic.fulfilled, (state, action) => {
        state.tx.basicGrant.status = `idle`
        state.tx.basicGrant.errMsg = ``
        state.tx.basicGrant.successMsg =  action.payload.txHash;
      })
      .addCase(txFeegrantBasic.rejected, (state, action) => {
        state.tx.basicGrant.status = `rejected`
        state.tx.basicGrant.errMsg = action.payload || action.error.message
        state.tx.basicGrant.successMsg = ``
      })

      builder
      .addCase(txGrantPeriodic.pending, (state) => {
        state.tx.periodicGrant.status = `pending`
        state.tx.periodicGrant.errMsg = ``
        state.tx.periodicGrant.successMsg = ``

      })
      .addCase(txGrantPeriodic.fulfilled, (state, action) => {
        state.tx.periodicGrant.status = `idle`
        state.tx.periodicGrant.errMsg = ``
        state.tx.periodicGrant.successMsg =  action.payload.txHash;
      })
      .addCase(txGrantPeriodic.rejected, (state, action) => {
        state.tx.periodicGrant.status = `rejected`
        state.tx.periodicGrant.errMsg = action.payload || action.error.message
        state.tx.periodicGrant.successMsg = ``
      })


      builder
      .addCase(txRevoke.pending, (state) => {
        state.tx.revokeGrant.status = `pending`
        state.tx.revokeGrant.errMsg = ``
        state.tx.revokeGrant.successMsg = ``

      })
      .addCase(txRevoke.fulfilled, (state, action) => {
        state.tx.revokeGrant.status = `idle`
        state.tx.revokeGrant.errMsg = ``
        state.tx.revokeGrant.successMsg =  action.payload.txHash;
      })
      .addCase(txRevoke.rejected, (state, action) => {
        state.tx.revokeGrant.status = `rejected`
        state.tx.revokeGrant.errMsg = action.payload || action.error.message
        state.tx.revokeGrant.successMsg = ``
      })
  },
});

export const {resetAlerts} = feegrantSlice.actions;

export default feegrantSlice.reducer;
