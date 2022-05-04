import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SendMsg } from '../../txns/proto';
import bankService from './bankService';
import { fee, signAndBroadcastAmino } from '../../txns/execute';

const initialState = {
  balances: {
    list: [],
    status: 'idle',
    errMsg: '',
  },
  balance: {
    balance: {},
    status: 'idle',
    errMsg: '',
  },
  tx: {
    send: {
      status: 'idle',
      txHash: '',
      errMsg: '',
    }
  }

};

export const getBalances = createAsyncThunk(
  'bank/balances',
  async (data) => {
    const response = await bankService.balances(data.baseURL, data.address, data.pagination);
    return response.data;
  }
);

export const getBalance = createAsyncThunk(
  'bank/balance',
  async (data) => {
    const response = await bankService.balance(data.baseURL, data.address, data.denom);
    return response.data;
  }
);

export const txAuthSend = createAsyncThunk(
  'bank/tx-send',
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      const msg = SendMsg(data.from, data.to, data.amount, data.denom)
      const result = await signAndBroadcastAmino([msg], fee(data.denom, data.feeAmount), data.memo, data.chainId, data.rpc)
      if (result?.code === 0) {
      return fulfillWithValue({txHash: result?.transactionHash});
      } else {
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
);

export const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBalances.pending, (state) => {
        state.balances.status = 'loading';
        state.balances.errMsg = ''

      })
      .addCase(getBalances.fulfilled, (state, action) => {
        state.balances.status = 'idle';
        state.balances.list = action.payload.balances
        state.balances.errMsg = ''
      })
      .addCase(getBalances.rejected, (state, action) => {
        state.balances.status = 'rejected';
        state.balances.errMsg = action.error.message
      })

      builder
      .addCase(getBalance.pending, (state) => {
        state.balance.status = 'loading';
        state.balance.errMsg = ''

      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.balance.status = 'idle';
        state.balance.balance = action.payload.balance
        state.balance.errMsg = ''
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.balance.status = 'rejected';
        state.balance.errMsg = action.error.message
      })


      builder
      .addCase(txAuthSend.pending, (state) => {
        state.tx.send.status = 'pending';
        state.tx.send.errMsg = '';
        state.tx.send.txHash = '';

      })
      .addCase(txAuthSend.fulfilled, (state, action) => {
        state.tx.send.status = 'idle';
        state.tx.send.errMsg = '';
        state.tx.send.txHash = action.payload.txHash;
      })
      .addCase(txAuthSend.rejected, (state, action) => {
        state.tx.send.status = 'rejected';
        state.tx.send.errMsg = action.error.message;
      })

      
  },
});

export default bankSlice.reducer;
