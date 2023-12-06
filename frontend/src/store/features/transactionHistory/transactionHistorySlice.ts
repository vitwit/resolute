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
      state.allTransactions = [
        ...transactions,
        ...(state.allTransactions || []),
      ];
      state.chains[chainID] = [
        ...transactions,
        ...(state.chains[chainID] || []),
      ];
      addTransanctions(transactions, address);
    },

    loadTransactions: (
      state,
      action: PayloadAction<LoadTransactionsInputs>
    ) => {
      const { address } = action.payload;
      const transactions = getTransactions(address);
      state.allTransactions = transactions;
      const chains: { [key: string]: Transaction[] } = {};
      transactions.forEach((tx) => {
        const { chainID } = tx;
        if (!chains[chainID]) chains[chainID] = [];
        chains[chainID] = [...chains[chainID], tx];
      });
      state.chains = chains;
    },
  },
});

export const { addTransactions, loadTransactions } =
  transactionHistorySlice.actions;

export default transactionHistorySlice.reducer;
