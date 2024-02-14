'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addTransactions as addTxsInLocalStorage,
  getTransactions,
  updateIBCStatus,
} from '@/utils/localStorage';
import { trackTx } from '../ibc/ibcSlice';
import txnService from './transactionHistoryService';
import { NewTransaction } from '@/utils/transaction';

type TransactionHistoryState = {
  chains: { [chainID: string]: Transaction[] };
  allTransactions: Transaction[];
  txns: any;
};

const initialState: TransactionHistoryState = {
  chains: {},
  allTransactions: [],
  txns: [],
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
            cosmosAddress: data.address,
          })
        );
      }
    });
    return transactions;
  }
);

export const getBankSendTxns = createAsyncThunk(
  'transactions/bank-send-txns',
  async (
    data: {
      senderAddress: string;
      baseURL: string;
      chainID: string;
      cosmosAddress: string;
    },
    { dispatch }
  ) => {
    const result = await txnService.fetchBankSendTxns({
      baseURL: data.baseURL,
      senderAddress: data.senderAddress,
    });
    const { tx_responses, txs } = result.data;
    if (data.chainID === 'osmosis-1') {
      console.log(tx_responses, txs);
    }
    for (let i = 0; i < txs.length; i++) {
      const {
        code,
        height,
        raw_log: rawLog,
        gas_wanted: gasWanted,
        gaw_user: gasUsed,
        timestamp: time,
        txhash: transactionHash,
      } = tx_responses[i];
      console.log('=================');
      console.log(tx_responses[i]);
      const { memo, messages } = txs[i].body;
      const { fee } = txs[i].auth_info;

      const newTx = {
        code,
        height,
        rawLog,
        gasWanted,
        time,
        memo,
        fee,
        transactionHash,
        gasUsed,
      };

      console.log(newTx);

      const tx = NewTransaction(
        newTx,
        messages,
        data.chainID,
        data.senderAddress
      );
      console.log('--------');
      console.log(tx);
      console.log({
        address: data.cosmosAddress,
        chainID: data.chainID,
        transactions: [tx],
      });
      dispatch(
        addTransactions({
          address: data.cosmosAddress,
          chainID: data.chainID,
          transactions: [tx],
        })
      );
    }
    return result.data;
  }
);

export const getStakingTxns = createAsyncThunk(
  'transactions/staking-txns',
  async (
    data: {
      senderAddress: string;
      baseURL: string;
      chainID: string;
      cosmosAddress: string;
    },
    { dispatch }
  ) => {
    const result = await txnService.fetchStakingTxns({
      baseURL: data.baseURL,
      senderAddress: data.senderAddress,
    });
    const { tx_responses, txs } = result.data;
    if (data.chainID === 'osmosis-1') {
      console.log(tx_responses, txs);
    }
    for (let i = 0; i < txs.length; i++) {
      const {
        code,
        height,
        raw_log: rawLog,
        gas_wanted: gasWanted,
        gaw_user: gasUsed,
        timestamp: time,
        txhash: transactionHash,
      } = tx_responses[i];
      console.log('=================');
      console.log(tx_responses[i]);
      const { memo, messages } = txs[i].body;
      const { fee } = txs[i].auth_info;

      const newTx = {
        code,
        height,
        rawLog,
        gasWanted,
        time,
        memo,
        fee,
        transactionHash,
        gasUsed,
      };

      console.log(newTx);

      const tx = NewTransaction(
        newTx,
        messages,
        data.chainID,
        data.senderAddress
      );
      console.log('--------');
      console.log(tx);
      console.log({
        address: data.cosmosAddress,
        chainID: data.chainID,
        transactions: [tx],
      });
      dispatch(
        addTransactions({
          address: data.cosmosAddress,
          chainID: data.chainID,
          transactions: [tx],
        })
      );
    }
    return result.data;
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
      // addTxsInLocalStorage(transactions, address);
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

    builder
      .addCase(getBankSendTxns.pending, () => {})
      .addCase(getBankSendTxns.fulfilled, (state, action) => {})
      .addCase(getBankSendTxns.rejected, () => {});

    builder
      .addCase(getStakingTxns.pending, () => {})
      .addCase(getStakingTxns.fulfilled, (state, action) => {
        // state.txns = [state.txns, ...action.payload];
      })
      .addCase(getStakingTxns.rejected, () => {});
  },
});

export const { addTransactions, updateIBCTransaction } =
  transactionHistorySlice.actions;

export default transactionHistorySlice.reducer;
