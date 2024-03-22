'use client';

import { TxStatus } from '@/types/enums';
import {
  AssetConfig,
  ChainConfig,
  SwapState,
  TxSwapInputs,
} from '@/types/swaps';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  connectWithSigner,
  trackTransactionStatus,
  txExecuteSwap,
} from './swapsService';
import { setError } from '../common/commonSlice';
import { ERR_UNKNOWN } from '@/utils/errors';
import { Squid } from '@0xsquid/sdk';
import { SigningStargateClient } from '@cosmjs/stargate';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { SQUID_ID } from '@/utils/constants';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

declare let window: WalletWindow;

const initialState: SwapState = {
  destAsset: null,
  destChain: null,
  sourceAsset: null,
  sourceChain: null,
  amountIn: '',
  amountOut: '',
  fromAddress: '',
  toAddress: '',
  txStatus: {
    status: TxStatus.INIT,
    error: '',
  },
  txSuccess: {
    txHash: '',
  },
  txDestSuccess: {
    status: '',
  },
};

export const txIBCSwap = createAsyncThunk(
  'ibc-swap/txSwap',
  async (data: TxSwapInputs, { rejectWithValue, dispatch }) => {
    try {
      const offlineSigner: OfflineDirectSigner =
        await window.wallet.getOfflineSigner(data.sourceChainID);

      const signerAddress = (await offlineSigner.getAccounts())[0].address;

      const signer = await connectWithSigner(data.rpcURLs, offlineSigner);

      const executionResponse = await txExecuteSwap({
        route: data.swapRoute,
        signer,
        signerAddress,
      });

      const client = await SigningStargateClient.connect(data.rpcURLs[0]);

      const txResponse = await client.broadcastTx(
        Uint8Array.from(TxRaw.encode(executionResponse).finish())
      );

      dispatch(setTx(txResponse.transactionHash));

      const txStatus = await trackTransactionStatus({
        transactionId: txResponse.transactionHash,
        toChainId: data.destChainID,
        fromChainId: data.sourceChainID,
      });

      if (txStatus === 'success') {
        dispatch(
          setError({
            message: 'Transaction successful',
            type: 'success',
          })
        );
      } else if (txStatus === 'needs_gas') {
        dispatch(
          setError({
            message: 'Transaction could not be completed, needs gas',
            type: 'error',
          })
        );
      } else if (txStatus === 'partial_success') {
        dispatch(
          setError({
            message: 'Transaction partial successful',
            type: 'success',
          })
        );
      } else if (txStatus === 'not_found') {
        dispatch(
          setError({
            message: 'Transaction not found',
            type: 'error',
          })
        );
      }

      return txStatus;
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errMsg = error?.message || ERR_UNKNOWN;
      dispatch(
        setError({
          message: errMsg,
          type: 'error',
        })
      );
      return rejectWithValue(error?.message || ERR_UNKNOWN);
    }
  }
);

export const swapsSlice = createSlice({
  name: 'ibc-swap',
  initialState,
  reducers: {
    setSourceChain: (state, action: PayloadAction<ChainConfig | null>) => {
      state.sourceChain = action.payload;
    },
    setSourceAsset: (state, action: PayloadAction<AssetConfig | null>) => {
      state.sourceAsset = action.payload;
    },
    setDestChain: (state, action: PayloadAction<ChainConfig | null>) => {
      state.destChain = action.payload;
    },
    setDestAsset: (state, action: PayloadAction<AssetConfig | null>) => {
      state.destAsset = action.payload;
    },
    setAmountIn: (state, action: PayloadAction<string>) => {
      state.amountIn = action.payload;
    },
    setAmountOut: (state, action: PayloadAction<string>) => {
      state.amountOut = action.payload;
    },
    setToAddress: (state, action: PayloadAction<string>) => {
      state.toAddress = action.payload;
    },
    setFromAddress: (state, action: PayloadAction<string>) => {
      state.fromAddress = action.payload;
    },
    resetTxStatus: (state) => {
      state.txStatus = {
        status: TxStatus.INIT,
        error: '',
      };
    },
    setTx: (state, action: PayloadAction<string>) => {
      state.txSuccess.txHash = action.payload;
    },
    resetTx: (state) => {
      state.txSuccess.txHash = '';
      state.txStatus = {
        status: TxStatus.INIT,
        error: '',
      };
    },
    setTxDestSuccess: (state) => {
      state.txDestSuccess.status = 'success';
    },
    resetTxDestSuccess: (state) => {
      state.txDestSuccess.status = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(txIBCSwap.pending, (state) => {
        state.txStatus.status = TxStatus.PENDING;
        state.txStatus.error = '';
      })
      .addCase(txIBCSwap.fulfilled, (state) => {
        state.txStatus.status = TxStatus.IDLE;
        state.txStatus.error = '';
      })
      .addCase(txIBCSwap.rejected, (state, action) => {
        state.txStatus.status = TxStatus.REJECTED;
        state.txStatus.error = action.error.message || ERR_UNKNOWN;
      });
  },
});

export const {
  setDestAsset,
  setDestChain,
  setSourceAsset,
  setSourceChain,
  setAmountIn,
  setAmountOut,
  resetTxStatus,
  resetTx,
  setTx,
  setTxDestSuccess,
  resetTxDestSuccess,
  setFromAddress,
  setToAddress,
} = swapsSlice.actions;

export default swapsSlice.reducer;
