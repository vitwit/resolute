'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addTransanctions, getTransactions } from '@/utils/localStorage';

type TransactionHistoryState = {
  [chainID: string]: Transaction[];
};

const initialState: TransactionHistoryState = {};

export const transactionHistorySlice = createSlice({
  name: 'transactionHistory',
  initialState,
  reducers: {
    addTransactions: (state, action: PayloadAction<AddTransanctionInputs>) => {
      const { transactions, address, chainID } = action.payload;
      state[chainID] = [...state[chainID], ...transactions];
      addTransanctions(chainID, address, transactions);
    },
    loadTransactions: (
      state,
      action: PayloadAction<LoadTransactionsInputs>
    ) => {
      const { chains } = action.payload;
      chains.forEach((chain) => {
        const { chainID, address } = chain;
        state[chainID] = getTransactions(chainID, address);
      });
    },
    loadChainTransactions: (
      state,
      action: PayloadAction<{ chainID: string; address: string }>
    ) => {
      const { chainID, address } = action.payload;
      state[chainID] = getTransactions(chainID, address);
    },
  },
});

export const { addTransactions, loadTransactions, loadChainTransactions } =
  transactionHistorySlice.actions;

export default transactionHistorySlice.reducer;
