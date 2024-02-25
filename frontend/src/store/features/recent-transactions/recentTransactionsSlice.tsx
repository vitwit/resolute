'use client';

import { TxStatus } from '@/types/enums';
import { ERR_UNKNOWN } from '@/utils/errors';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import recentTransactionsService from './recentTransactionsService';
import {
  addIBCTxn,
  getIBCTxn,
  updateIBCStatus,
  updateIBCTransactionStatusInLocal,
} from '@/utils/localStorage';
import { IBC_SEND_TYPE_URL } from '@/utils/constants';
import { trackTx } from '../ibc/ibcSlice';

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
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await recentTransactionsService.recentTransactions({
        payload: data.addresses,
        module: data.module,
      });
      let txns: ParsedTransaction[] = [];
      const txnsData = response?.data?.data;
      txnsData.forEach((txn: ParsedTransaction) => {
        const { txhash, messages } = txn;
        console.log('=-=-=----122222222');
        console.log(txn);
        console.log(messages[0]?.['@type']);
        console.log(IBC_SEND_TYPE_URL);
        console.log(messages[0]?.['@type'] === IBC_SEND_TYPE_URL);
        if (messages[0]?.['@type'] === IBC_SEND_TYPE_URL) {
          const ibcTx = getIBCTxn(txhash);
          if (ibcTx) {
            txns = [...txns, ibcTx];
            console.log('==-=-=-=-= ');
            console.log(ibcTx);
            if (ibcTx?.isIBCPending) {
              console.log('===========111==============');
              dispatch(
                trackTx({
                  chainID: ibcTx.chain_id,
                  txHash: ibcTx.txhash,
                })
              );
            }
          } else {
            console.log('123123123', txn);
            txns = [...txns, txn];
          }
        } else {
          console.log('234234');
          txns = [...txns, txn];
        }
      });
      return {
        data: txns,
      };
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
    addIBCTransaction: (state, action: PayloadAction<ParsedTransaction>) => {
      const transaction = action.payload;
      state.txns.data = [transaction, ...state.txns.data];
      addIBCTxn(transaction);
    },
    updateIBCTransactionStatus: (
      state,
      action: PayloadAction<{ txHash: string }>
    ) => {
      const { txHash } = action.payload;
      const allTransactions = state.txns.data;
      const updatedAllTransactions = allTransactions.map((tx) => {
        if (tx.txhash === txHash) {
          return { ...tx, isIBCPending: false };
        }
        return tx;
      });
      state.txns.data = updatedAllTransactions;
      updateIBCTransactionStatusInLocal(txHash);
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
        // const txnsData = action.payload.data;
        // let txns: ParsedTransaction[] = [];
        // txnsData.forEach((txn: ParsedTransaction) => {
        //   const { txhash, messages } = txn;
        //   if (messages[0]?.['@type'] === IBC_SEND_TYPE_URL) {
        //     const ibcTx = getIBCTxn(txhash);
        //     if (ibcTx) {
        //       txns = [...txns, ibcTx];
        //       if (ibcTx?.isIBCPending) {
        //         dispatch(
        //           trackTx({
        //             chainID: tx.chainID,
        //             txHash: tx.transactionHash,
        //             cosmosAddress: data.address,
        //           })
        //         );
        //       }
        //     } else {
        //       txns = [...txns, txn];
        //     }
        //   } else {
        //     txns = [...txns, txn];
        //   }
        // });
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

export const {
  resetRecentTxns,
  addIBCTransaction,
  updateIBCTransactionStatus,
} = recentTransactionsSlice.actions;

export default recentTransactionsSlice.reducer;
