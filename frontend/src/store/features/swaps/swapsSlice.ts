'use client';

import { TxStatus } from '@/types/enums';
import {
  AssetConfig,
  ChainConfig,
  SwapState,
  TxSwapInputs,
} from '@/types/swaps';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { txSwap } from './swapsService';
import { setError } from '../common/commonSlice';
import { ERR_UNKNOWN } from '@/utils/errors';

const initialState: SwapState = {
  destAsset: null,
  destChain: null,
  sourceAsset: null,
  sourceChain: null,
  amountIn: '',
  amountOut: '',
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
    const onSourceChainTxSuccess = (txHash: string) => {
      dispatch(setTx(txHash));
    };
    const onDestChainTxSuccess = () => {
      dispatch(setTxDestSuccess());
    };
    dispatch(resetTxDestSuccess());
    try {
      const response = await txSwap({
        route: data.route,
        userAddresses: data.userAddresses,
        onSourceChainTxSuccess,
        onDestChainTxSuccess,
      });
      return response;
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
} = swapsSlice.actions;

export default swapsSlice.reducer;
