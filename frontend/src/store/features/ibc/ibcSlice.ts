'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { trackIBCTx, txIBCTransfer } from './ibcService';
import { TxStatus } from '@/types/enums';
import axios from 'axios';
import { parseTxResult } from '@/utils/signing';
import { NewIBCTransaction, NewTransaction } from '@/utils/transaction';
import { setError, setTxAndHash } from '../common/commonSlice';
import { capitalize } from 'lodash';
import { getBalances } from '../bank/bankSlice';
import { addIBCTransaction, updateIBCTransactionStatus } from '../recent-transactions/recentTransactionsSlice';
import { FAILED, SUCCESS } from '@/utils/constants';
import { trackEvent } from '@/utils/util';

export interface IBCState {
  txStatus: TxStatus;
  chains: Record<string, string[]>;
}

const initialState: IBCState = { txStatus: TxStatus.INIT, chains: {} };

export const trackTx = createAsyncThunk(
  'ibc/trackTx',
  async (
    data: { chainID: string; txHash: string },
    { rejectWithValue, dispatch }
  ) => {
    const onDestChainTxSuccess = (chainID: string, txHash: string) => {
      dispatch(removeFromPending({ chainID, txHash }));
      dispatch(
      updateIBCTransactionStatus({ txHash })
      );
    };
    try {
      await trackIBCTx(data.txHash, data.chainID, onDestChainTxSuccess);
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      dispatch(
        setError({
          type: 'error',
          message: (
            err.message || `tracking tx ${data.txHash} failed`
          ).toString(),
        })
      );
      rejectWithValue(err);
    }
  }
);

export const txTransfer = createAsyncThunk(
  'ibc/txTransfer',
  async (data: TransferRequestInputs, { rejectWithValue, dispatch }) => {
    const onSourceChainTxSuccess = async (chainID: string, txHash: string) => {
      dispatch(resetTxStatus());
      const response = await axios.get(
        data.rest + '/cosmos/tx/v1beta1/txs/' + txHash+ `?chain=${data.sourceChainID}`
      );
      const msgs = response?.data?.tx?.body?.messages || [];
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const formattedMsgs: Msg[] = msgs.map((msg: any) => {
        return {
          typeUrl: msg['@type'],
          value: msg,
        };
      });
      const result = parseTxResult(response.data.tx_response);
      const tx = NewTransaction(
        result,
        formattedMsgs,
        chainID,
        data.from,
        true,
        result.code === 0
      );
      const ibcTx = NewIBCTransaction(
        result,
        formattedMsgs,
        chainID,
        data.from,
        true,
        result.code === 0
      );
      if(result.code === 0) {
        trackEvent('TRANSFER', 'IBC_TRANSFER', SUCCESS);
      } else {
        trackEvent('TRANSFER', 'IBC_TRANSFER', FAILED);
      }
      dispatch(
        setTxAndHash({
          hash: txHash,
          tx,
        })
      );
      dispatch(addIBCTransaction(ibcTx));

      dispatch(addToPending({ chainID, txHash }));
      dispatch(
        getBalances({
          baseURL: data.rest,
          address: data.from,
          chainID,
          baseURLs: data.restURLs,
        })
      );
      return result;
    };

    const onDestChainTxSuccess = (
      chainID: string,
      txHash: string,
      destChain: string
    ) => {
      dispatch(removeFromPending({ chainID, txHash }));
      dispatch(
        updateIBCTransactionStatus({ txHash })
        );
      dispatch(
        setError({
          type: 'success',
          message: `IBC transaction ${txHash} has been successfully delivered on ${capitalize(
            destChain
          )}!`,
        })
      );
    };

    const {
      sourceDenom,
      sourceChainID,
      destChainID,
      sourceChain,
      destChain,
      from,
      to,
      amount,
    } = data;

    try {
      const response = await txIBCTransfer(
        sourceDenom,
        sourceChainID,
        destChainID,
        sourceChain,
        destChain,
        from,
        to,
        amount,
        onSourceChainTxSuccess,
        onDestChainTxSuccess
      );

      return response;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      trackEvent('TRANSFER', 'IBC_TRANSFER', FAILED);
      dispatch(
        setError({
          type: 'error',
          message: (err?.message || 'Request rejected').toString(),
        })
      );
      return rejectWithValue(err);
    }
  }
);

export const ibcSlice = createSlice({
  name: 'ibc',
  initialState,
  reducers: {
    addToPending: (
      state,
      action: PayloadAction<{ chainID: string; txHash: string }>
    ) => {
      const { chainID, txHash } = action.payload;
      const pendingTxs = state.chains[chainID] || [];
      if (!state.chains[chainID]) state.chains[chainID] = [];
      pendingTxs.push(txHash);
      state.chains[chainID] = pendingTxs;
    },

    removeFromPending: (
      state,
      action: PayloadAction<{ chainID: string; txHash: string }>
    ) => {
      const { chainID, txHash } = action.payload;
      let pendingTxs = state.chains[chainID] || [];
      let index = -1;
      pendingTxs.forEach((txHashItem, itemIndex) => {
        if (txHash === txHashItem) index = itemIndex;
      });
      if (index != -1) {
        pendingTxs = [
          ...pendingTxs.slice(0, index),
          ...pendingTxs.slice(index + 1, pendingTxs.length),
        ];
        state.chains[chainID] = pendingTxs;
      }
    },

    resetTxStatus: (state) => {
      state.txStatus = TxStatus.IDLE;
    },

    resetAccountsInfo: (state) => {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(txTransfer.pending, (state, action) => {
        const { sourceChainID } = action.meta.arg;
        if (!state.chains[sourceChainID]) state.chains[sourceChainID] = [];
        state.txStatus = TxStatus.PENDING;
      })
      .addCase(txTransfer.fulfilled, (state) => {
        state.txStatus = TxStatus.IDLE;
      })
      .addCase(txTransfer.rejected, (state) => {
        state.txStatus = TxStatus.REJECTED;
      });

    builder
      .addCase(trackTx.pending, (state, action) => {
        const { chainID, txHash } = action.meta.arg;
        let pendingTxs = state.chains[chainID] || [];
        pendingTxs = [...pendingTxs, txHash];
        state.chains[chainID] = pendingTxs;
      })
      .addCase(trackTx.fulfilled, () => {})
      .addCase(trackTx.rejected, () => {});
  },
});

export const {
  resetAccountsInfo,
  addToPending,
  removeFromPending,
  resetTxStatus,
} = ibcSlice.actions;

export default ibcSlice.reducer;
