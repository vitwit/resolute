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
import axios, { AxiosError } from 'axios';
import { setError } from '../common/commonSlice';

const initialState: SwapState = {
  destAsset: null,
  destChain: null,
  sourceAsset: null,
  sourceChain: null,
  amountIn: '',
  amountOut: '',
  txStatus: TxStatus.INIT,
};

export const txIBCSwap = createAsyncThunk(
  'ibc-swap/txSwap',
  async (data: TxSwapInputs, { rejectWithValue, dispatch }) => {
    const onSourceChainTxSuccess = (chainID: string, txHash: string) => {
      dispatch(
        setError({
          type: 'success',
          message: `Transaction Broadcasted`,
        })
      );
    };
    const onDestChainTxSuccess = (chainID: string, txHash: string) => {
      dispatch(
        setError({
          type: 'success',
          message: `Transaction Successful`,
        })
      );
    };
    try {
      const response = await txSwap({
        route: data.route,
        userAddresses: data.userAddresses,
        onSourceChainTxSuccess,
        onDestChainTxSuccess,
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response);
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
      state.txStatus = TxStatus.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(txIBCSwap.pending, (state) => {
        state.txStatus = TxStatus.PENDING;
      })
      .addCase(txIBCSwap.fulfilled, (state) => {
        state.txStatus = TxStatus.IDLE;
      })
      .addCase(txIBCSwap.rejected, (state) => {
        state.txStatus = TxStatus.REJECTED;
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
} = swapsSlice.actions;

export default swapsSlice.reducer;
