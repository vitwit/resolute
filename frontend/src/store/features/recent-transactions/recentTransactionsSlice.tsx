'use client';

import { TxStatus } from '@/types/enums';
import { ERR_TXN_NOT_FOUND, ERR_UNKNOWN } from '@/utils/errors';
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
import { setError, setTxAndHash } from '../common/commonSlice';
import { signAndBroadcast } from '@/utils/signing';

interface RecentTransactionsState {
  txns: {
    data: ParsedTransaction[];
    status: TxStatus;
    error: string;
    total: number;
  };
  txnRepeat: {
    status: TxStatus;
    error: string;
  };
  txn: {
    data?: ParsedTransaction[];
    status: TxStatus;
    error: string;
  };
}

const initialState: RecentTransactionsState = {
  txns: {
    data: [],
    total: 0,
    error: '',
    status: TxStatus.INIT,
  },
  txnRepeat: {
    status: TxStatus.INIT,
    error: '',
  },
  txn: {
    data: undefined,
    status: TxStatus.INIT,
    error: '',
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

export const getTransaction = createAsyncThunk(
  'recent-txns/get-txn',
  async (
    data: {
      address: string;
      chainID: string;
      txhash: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await recentTransactionsService.fetchTx(data);
      let txns: ParsedTransaction[] = [];
      const txnsData = response?.data?.data?.data;
      const { txhash, messages } = txnsData;
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
          let formattedTxn = txnsData;
          formattedTxn = { ...formattedTxn, isIBCPending: false };
          formattedTxn = { ...formattedTxn, isIBCTxn: true };
          txns = [...txns, formattedTxn];
        }
      } else {
        let formattedTxn = txnsData;
        formattedTxn = { ...formattedTxn, isIBCPending: false };
        formattedTxn = { ...formattedTxn, isIBCTxn: false };

        txns = [...txns, formattedTxn];
      }
      // });
      // return {
      //   data: {
      //     data: txns,
      //     total: response?.data?.data?.total,
      //   },
      // };
      return { data: txns };
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({
          message: error?.response?.data?.message || ERR_UNKNOWN,
        });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const getAnyChainTransaction = createAsyncThunk(
  'recent-txns/get-any-chain-txn',
  async (
    data: {
      txhash: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await recentTransactionsService.fetchAnyChainTx(
        data.txhash
      );
      let txns: ParsedTransaction[] = [];
      const txnsData = response?.data?.data?.data;
      let formattedTxn = txnsData;
      if (txnsData) {
        formattedTxn = { ...formattedTxn, isIBCPending: false };
        formattedTxn = { ...formattedTxn, isIBCTxn: false };
      } else {
        throw new Error(ERR_TXN_NOT_FOUND);
      }

      txns = [...txns, formattedTxn];

      return { data: txns };
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errMsg = error?.message || ERR_TXN_NOT_FOUND;
      return rejectWithValue(errMsg);
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
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errMsg = error?.message || 'Failed to execute contract';
      dispatch(
        setError({
          message: errMsg,
          type: 'error',
        })
      );
      return rejectWithValue(errMsg);
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
      state.txns.total = 0;
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
    builder
      .addCase(getTransaction.pending, (state) => {
        state.txn.status = TxStatus.PENDING;
        state.txn.error = '';
      })
      .addCase(getTransaction.fulfilled, (state, action) => {
        state.txn.status = TxStatus.IDLE;
        state.txn.data = action?.payload?.data || {};
        state.txns.error = '';
      })
      .addCase(getTransaction.rejected, (state, action) => {
        state.txn.status = TxStatus.REJECTED;

        const payload = action.payload as { message: string };
        state.txns.error = payload.message || '';
      });
    builder
      .addCase(getAnyChainTransaction.pending, (state) => {
        state.txn.status = TxStatus.PENDING;
        state.txn.error = '';
      })
      .addCase(getAnyChainTransaction.fulfilled, (state, action) => {
        state.txn.status = TxStatus.IDLE;
        state.txn.data = action?.payload?.data || [];
        state.txns.error = '';
      })
      .addCase(getAnyChainTransaction.rejected, (state, action) => {
        state.txn.status = TxStatus.REJECTED;
        state.txn.data = [];
        state.txn.error = action.error.message || 'Failed to fetch transaction';
      });
    builder
      .addCase(txRepeatTransaction.pending, (state) => {
        state.txnRepeat.status = TxStatus.PENDING;
        state.txnRepeat.error = '';
      })
      .addCase(txRepeatTransaction.fulfilled, (state) => {
        state.txnRepeat.status = TxStatus.IDLE;
        state.txnRepeat.error = '';
      })
      .addCase(txRepeatTransaction.rejected, (state, action) => {
        state.txnRepeat.status = TxStatus.REJECTED;
        state.txnRepeat.error = action.error.message || 'Transaction failed';
      });
  },
});

export const {
  resetRecentTxns,
  addIBCTransaction,
  updateIBCTransactionStatus,
} = recentTransactionsSlice.actions;

export default recentTransactionsSlice.reducer;
