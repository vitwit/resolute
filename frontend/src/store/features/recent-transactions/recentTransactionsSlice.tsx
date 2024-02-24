'use client';

import { TxStatus } from '@/types/enums';
import { ERR_UNKNOWN } from '@/utils/errors';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import recentTransactionsService from './recentTransactionsService';
import { updateIBCStatus } from '@/utils/localStorage';

interface RecentTransactionsState {
  txns: {
    data: ParsedTransaction[];
    status: TxStatus;
    error: string;
  };
}

const initialState: RecentTransactionsState = {
  txns: {
    data: [],
    error: '',
    status: TxStatus.INIT,
  },
};

export const getRecentTransactions = createAsyncThunk(
  'recent-txns/get-recent-txns',
  async (
    data: {
      addresses: {
        address: string;
        chain_id: string;
      }[];
      module: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await recentTransactionsService.recentTransactions({
        payload: data.addresses,
        module: data.module,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({
          message: error?.response?.data?.message || ERR_UNKNOWN,
        });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const recentTransactionsSlice = createSlice({
  name: 'recentTransactions',
  initialState,
  reducers: {
    resetRecentTxns: (state) => {
      state.txns.data = [];
      state.txns.error = '';
      state.txns.status = TxStatus.INIT;
    },
    updateIBCTransaction: (
      state,
      action: PayloadAction<UpdateIBCTransactionInputs>
    ) => {
      const { txHash, address } = action.payload;
      const allTransactions = state.txns.data;
      const updatedAllTransactions = allTransactions.map((tx) => {
        if (tx.txhash === txHash) {
          return { ...tx, isIBCPending: false };
        }
        return tx;
      });
      state.txns.data = updatedAllTransactions;

      updateIBCStatus(address, txHash);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecentTransactions.pending, (state) => {
        state.txns.status = TxStatus.PENDING;
        state.txns.error = '';
      })
      .addCase(getRecentTransactions.fulfilled, (state, action) => {
        state.txns.status = TxStatus.IDLE;
        const txnsData = action.payload.data;
        txnsData.map(() => {
           
        })
        state.txns.data = action.payload.data;
        state.txns.error = '';
      })
      .addCase(getRecentTransactions.rejected, (state, action) => {
        state.txns.status = TxStatus.REJECTED;
        state.txns.data = [];
        const payload = action.payload as { message: string };
        state.txns.error = payload.message || '';
      });
  },
});

export const { resetRecentTxns } = recentTransactionsSlice.actions;

export default recentTransactionsSlice.reducer;
