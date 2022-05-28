import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FeegrantBasicMsg, FeegrantPeriodicMsg, FeegrantRevokeMsg } from '../../txns/proto';
import feegrantService from './feegrantService';
import { fee, signAndBroadcastProto } from '../../txns/execute';
import { setError, setTxHash } from '../common/commonSlice';

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
    status: 'idle',
    type: '',
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
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = FeegrantBasicMsg(data.granter, data.grantee, data.denom, data.spendLimit, data.expiration)
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
      return rejectWithValue(error.response)
    }
  }
);

export const txGrantPeriodic = createAsyncThunk(
  'feegrant/tx-periodic',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = FeegrantPeriodicMsg(data.granter, data.grantee, data.denom, data.spendLimit, data.expiration,
        data.period, data.periodSpendLimit)
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
      return rejectWithValue(error.response)
    }
  }
);

export const txRevoke = createAsyncThunk(
  'feegrant/tx-revoke',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = FeegrantRevokeMsg(data.granter, data.grantee)
      const result = await signAndBroadcastProto([msg], fee(data.denom, data.feeAmount), "", data.rpc)
      if (result?.code === 0) {
        dispatch(getGrantsByMe({
          baseURL: data.baseURL, granter: data.granter
        }
        ))
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
      return rejectWithValue(error.response)
    }
  }
);

export const feegrantSlice = createSlice({
  name: 'feegrant',
  initialState,
  reducers: {
    resetAlerts: (state) => {
      state.errState = {
        status: 'idle',
        message: '',
        type: ''
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
        state.tx.status = `pending`
        state.tx.type = `basic`

      })
      .addCase(txFeegrantBasic.fulfilled, (state, _) => {
        state.tx.status = `idle`
        state.tx.type = `basic`
      })
      .addCase(txFeegrantBasic.rejected, (state, _) => {
        state.tx.status = `rejected`
        state.tx.type = 'basic'
      })

    builder
      .addCase(txGrantPeriodic.pending, (state) => {
        state.tx.status = `pending`
        state.tx.type = `periodic`

      })
      .addCase(txGrantPeriodic.fulfilled, (state, _) => {
        state.tx.status = `idle`
        state.tx.type = `periodic`
      })
      .addCase(txGrantPeriodic.rejected, (state, _) => {
        state.tx.status = `rejected`
        state.tx.type = 'periodic'
      })


    builder
      .addCase(txRevoke.pending, (state) => {
        state.tx.status = `pending`
        state.tx.type = `revoke`

      })
      .addCase(txRevoke.fulfilled, (state, _) => {
        state.tx.status = `idle`
        state.tx.type = `revoke`
      })
      .addCase(txRevoke.rejected, (state, _) => {
        state.tx.status = `rejected`
        state.tx.type = 'revoke'
      })
  },
});

export const { resetAlerts } = feegrantSlice.actions;

export default feegrantSlice.reducer;
