'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addTransactions as addTxsInLocalStorage,
  getTransactions,
  updateIBCStatus,
} from '@/utils/localStorage';
import { trackTx } from '../ibc/ibcSlice';

type TransactionHistoryState = {
  chains: { [chainID: string]: Transaction[] };
  allTransactions: Transaction[];
};

const initialState: TransactionHistoryState = {
  chains: {},
  allTransactions: [],
};

export const loadTransactions = createAsyncThunk(
  'transactions/load',
  async (data: LoadTransactionsInputs, { dispatch }) => {
    const transactions = getTransactions(data.address);
    transactions.forEach((tx) => {
      if (tx.isIBCPending) {
        dispatch(
          trackTx({
            chainID: tx.chainID,
            txHash: tx.transactionHash,
          })
        );
      }
    });
    return transactions;
  }
);

export const transactionHistorySlice = createSlice({
  name: 'transactionHistory',
  initialState,
  reducers: {
    addTransactions: (state, action: PayloadAction<AddTransactionInputs>) => {
      const { transactions, chainID, address } = action.payload;
      state.allTransactions = [
        ...transactions,
        ...(state.allTransactions || []),
      ];
      state.chains[chainID] = [
        ...transactions,
        ...(state.chains[chainID] || []),
      ];
      addTxsInLocalStorage(transactions, address);
    },

    updateIBCTransaction: (
      state,
      action: PayloadAction<UpdateIBCTransactionInputs>
    ) => {
      const { txHash, chainID, address } = action.payload;
      const allTransactions = state.allTransactions;
      const updatedAllTransactions = allTransactions.map((tx) => {
        if (tx.transactionHash === txHash) {
          return { ...tx, isIBCPending: false };
        }
        return tx;
      });
      state.allTransactions = updatedAllTransactions;

      const chainTransactions = state.chains[chainID] || [];
      const updatedChainTransactions = chainTransactions.map((tx) => {
        if (tx.transactionHash === txHash) {
          return { ...tx, isIBCPending: false };
        }
        return tx;
      });
      state.chains[chainID] = updatedChainTransactions;

      updateIBCStatus(address, txHash);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadTransactions.pending, () => {})
      .addCase(loadTransactions.fulfilled, (state, action) => {
        const transactions = action.payload;
        state.allTransactions = transactions;
        const chains: { [key: string]: Transaction[] } = {};
        transactions.forEach((tx) => {
          const { chainID } = tx;
          if (!chains[chainID]) chains[chainID] = [];
          chains[chainID] = [...chains[chainID], tx];
        });
        state.chains = chains;
      })
      .addCase(loadTransactions.rejected, () => {});
  },
});

export const { addTransactions, updateIBCTransaction } =
  transactionHistorySlice.actions;

export default transactionHistorySlice.reducer;
