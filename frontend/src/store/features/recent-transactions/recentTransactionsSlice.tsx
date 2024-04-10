'use client';

import { TxStatus } from '@/types/enums';
import { ERR_UNKNOWN } from '@/utils/errors';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import recentTransactionsService from './recentTransactionsService';
import {
  addIBCTxn,
  getIBCTxn,
  updateIBCTransactionStatusInLocal,
} from '@/utils/localStorage';
import { GAS_FEE, IBC_SEND_TYPE_URL } from '@/utils/constants';
import { trackTx } from '../ibc/ibcSlice';
import { NewTransaction } from '@/utils/transaction';
import { setTxAndHash } from '../common/commonSlice';
import { signAndBroadcast } from '@/utils/signing';

interface RecentTransactionsState {
  txns: {
    data: ParsedTransaction[];
    status: TxStatus;
    error: string;
    total: number;
  };
}

const initialState: RecentTransactionsState = {
  txns: {
    data: [],
    total: 0,
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
        if (messages[0]?.['@type'] === IBC_SEND_TYPE_URL) {
          const ibcTx = getIBCTxn(txhash);
          if (ibcTx) {
            txns = [...txns, ibcTx];
            if (ibcTx?.isIBCPending) {
              dispatch(
                trackTx({
                  chainID: ibcTx.chain_id,
                  txHash: ibcTx.txhash,
                })
              );
            }
          } else {
            let formattedTxn = txn;
            formattedTxn = { ...formattedTxn, isIBCPending: false };
            formattedTxn = { ...formattedTxn, isIBCTxn: true };
            txns = [...txns, formattedTxn];
          }
        } else {
          let formattedTxn = txn;
          formattedTxn = { ...formattedTxn, isIBCPending: false };
          formattedTxn = { ...formattedTxn, isIBCTxn: false };
          txns = [...txns, formattedTxn];
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

export const getAllTransactions = createAsyncThunk(
  'recent-txns/get-all-txns',
  async (
    data: {
      address: string;
      chainID: string;
      limit: number;
      offset: number;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await recentTransactionsService.allTransactions(data);
      let txns: ParsedTransaction[] = [];
      const txnsData = response?.data?.data?.data;
      txnsData.forEach((txn: ParsedTransaction) => {
        const { txhash, messages } = txn;
        if (messages[0]?.['@type'] === IBC_SEND_TYPE_URL) {
          const ibcTx = getIBCTxn(txhash);
          if (ibcTx) {
            txns = [...txns, ibcTx];
            if (ibcTx?.isIBCPending) {
              dispatch(
                trackTx({
                  chainID: ibcTx.chain_id,
                  txHash: ibcTx.txhash,
                })
              );
            }
          } else {
            let formattedTxn = txn;
            formattedTxn = { ...formattedTxn, isIBCPending: false };
            formattedTxn = { ...formattedTxn, isIBCTxn: true };
            txns = [...txns, formattedTxn];
          }
        } else {
          let formattedTxn = txn;
          formattedTxn = { ...formattedTxn, isIBCPending: false };
          formattedTxn = { ...formattedTxn, isIBCTxn: false };
          txns = [...txns, formattedTxn];
        }
      });
      return {
        data: {
          data: txns,
          total: response?.data?.data?.total,
        },
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

export const txRepeatTransaction = createAsyncThunk(
  'recent-txns/repeat-txn',
  async (
    data: RepeatTransactionInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.basicChainInfo.prefix,
        data.messages,
        GAS_FEE,
        '',
        `${data.basicChainInfo.feeAmount * 10 ** data.basicChainInfo.decimals}${
          data.basicChainInfo.feeCurrencies[0].coinDenom
        }`,
        data.basicChainInfo.rest,
        data?.feegranter?.length ? data.feegranter : undefined,
        data?.basicChainInfo?.rpc,
        data?.basicChainInfo?.restURLs
      );
      const tx = NewTransaction(
        result,
        data.messages,
        data.basicChainInfo.chainID,
        data.basicChainInfo.address
      );

      dispatch(
        setTxAndHash({
          tx,
          hash: tx.transactionHash,
        })
      );

      if (result?.code === 0) {
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response);
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
        state.txns.data = action.payload.data;
        state.txns.error = '';
      })
      .addCase(getRecentTransactions.rejected, (state, action) => {
        state.txns.status = TxStatus.REJECTED;
        state.txns.data = [];
        const payload = action.payload as { message: string };
        state.txns.error = payload.message || '';
      });
    builder
      .addCase(getAllTransactions.pending, (state) => {
        state.txns.status = TxStatus.PENDING;
        state.txns.error = '';
      })
      .addCase(getAllTransactions.fulfilled, (state, action) => {
        state.txns.status = TxStatus.IDLE;
        state.txns.data = action.payload.data.data;
        state.txns.total = action.payload.data.total;
        state.txns.error = '';
      })
      .addCase(getAllTransactions.rejected, (state, action) => {
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
