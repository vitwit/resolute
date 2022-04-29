import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchBalances, fetchBalance } from './bankAPI';

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

};

export const getBalances = createAsyncThunk(
  'bank/balances',
  async (data) => {
    const response = await fetchBalances(data.baseURL, data.address, data.key, data.limit);
    return response.data;
  }
);

export const getBalance = createAsyncThunk(
  'bank/balance',
  async (data) => {
    const response = await fetchBalance(data.baseURL, data.address, data.denom);
    return response.data;
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

      
  },
});

export const { balances, balance } = bankSlice.actions;

export default bankSlice.reducer;
