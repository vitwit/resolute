'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addTransanctions, getTransactions } from '@/utils/localStorage';

type TransactionHistoryState = {
  chains: { [chainID: string]: Transaction[] };
  allTransactions: Transaction[];
};

const initialState: TransactionHistoryState = {
  chains: {},
  allTransactions: [],
};

export const transactionHistorySlice = createSlice({
  name: 'transactionHistory',
  initialState,
  reducers: {
    addTransactions: (state, action: PayloadAction<AddTransanctionInputs>) => {
      const { transactions, chainID, address } = action.payload;
      state.allTransactions = [...state.allTransactions, ...transactions];
      state.chains[chainID] = [...state.chains[chainID], ...transactions];
      addTransanctions(transactions, address);
    },

    loadTransactions: (
      state,
      action: PayloadAction<LoadTransactionsInputs>
    ) => {
      const { address } = action.payload;
      const transactions = getTransactions(address);
      state.allTransactions = transactions;
      transactions.forEach((tx) => {
        const { chainID } = tx;
        if (!state.chains[chainID]) state.chains[chainID] = [];
        state.chains[chainID] = [...state.chains[chainID], tx];
      });
    },
  },
});

export const { addTransactions, loadTransactions } =
  transactionHistorySlice.actions;

export default transactionHistorySlice.reducer;
