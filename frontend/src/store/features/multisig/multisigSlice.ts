'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import multisigService from './multisigService';

const initialState = {
  multisigAccounts: {
    status: 'idle',
    accounts: [],
    txnCounts: {},
    total: 0,
  },
};

export const getMultisigAccounts = createAsyncThunk(
  'multisig/getMultisigAccounts',
  async (address: string, { rejectWithValue }) => {
    try {
      const response = await multisigService.getAccounts(address);
      return response.data;
    } catch (error) {
      return rejectWithValue('SOMETHING_WRONG');
    }
  }
);

export const multisigSlice = createSlice({
  name: 'multisig',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMultisigAccounts.pending, (state) => {
        state.multisigAccounts.status = 'pending';
        state.multisigAccounts.accounts = [];
        state.multisigAccounts.total = 0;
        state.multisigAccounts.txnCounts = {};
      })
      .addCase(getMultisigAccounts.fulfilled, (state, action) => {
        state.multisigAccounts.accounts = action.payload?.data?.accounts || [];
        state.multisigAccounts.total = action.payload?.data?.total;
        state.multisigAccounts.txnCounts =
          action.payload?.data?.pending_txns || {};
        state.multisigAccounts.status = 'idle';
      })
      .addCase(getMultisigAccounts.rejected, (state) => {
        state.multisigAccounts.status = 'rejected';
        state.multisigAccounts.accounts = [];
      });
  },
});

export default multisigSlice.reducer;
