import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { signAndBroadcastAmino, fee } from '../../txns/execute';
import distService from './distributionService';
import { WithdrawAllRewardsMsg } from '../../txns/proto';

const initialState = {
  delegatorRewards: {
    list: [],
    status: 'idle',
    errMsg: '',
    pagination: {},
  },
  tx: {
    status: 'idle',
    errMsg: '',
    txHash: '',
  }

};

export const txWithdrawAllRewards = createAsyncThunk(
  'distribution/withdraw-all-rewards',
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      const msgs = []
      for (let i=0;i<data.msgs.length;i++) {
        const msg = data.msgs[i]
        msgs.push(WithdrawAllRewardsMsg(msg.delegator,msg.validator))
      }      
      const result = await signAndBroadcastAmino(msgs, fee(data.denom, data.feeAmount), data.chainId, data.rpc)
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


export const getDelegatorTotalRewards = createAsyncThunk(
  'distribution/totalRewards',
  async (data) => {
    const response = await distService.delegatorRewards(data.baseURL, data.address, data.pagination);
    return response.data;
  }
);


export const distSlice = createSlice({
  name: 'distribution',
  initialState,
  reducers: {
    resetTx: (state) => {
      state.tx = initialState.tx
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDelegatorTotalRewards.pending, (state) => {
        state.delegatorRewards.status = 'pending';
        state.delegatorRewards.errMsg = ''
        state.delegatorRewards.list = []
        state.delegatorRewards.pagination = {}

      })
      .addCase(getDelegatorTotalRewards.fulfilled, (state, action) => {
        state.delegatorRewards.status = 'idle';
        state.delegatorRewards.list = action.payload.rewards
        state.delegatorRewards.pagination = action.payload.pagination
        state.delegatorRewards.errMsg = ''
      })
      .addCase(getDelegatorTotalRewards.rejected, (state, action) => {
        state.delegatorRewards.status = 'rejected';
        state.delegatorRewards.errMsg = action.error.message
      })


      builder
      .addCase(txWithdrawAllRewards.pending, (state) => {
        state.tx.status = 'pending';
        state.tx.errMsg = '';
        state.tx.txHash = '';

      })
      .addCase(txWithdrawAllRewards.fulfilled, (state, action) => {
        state.tx.status = 'idle';
        state.tx.errMsg = '';
        state.tx.txHash = action.payload.txHash;
      })
      .addCase(txWithdrawAllRewards.rejected, (state, action) => {
        state.tx.status = 'rejected';
        state.tx.errMsg = action.error.message;
      })

      
  },
});

export const { resetTx } = distSlice.actions;
export default distSlice.reducer;
