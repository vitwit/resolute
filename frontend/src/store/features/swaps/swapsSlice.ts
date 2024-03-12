'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: SwapState = {
  destAsset: null,
  destChain: null,
  sourceAsset: null,
  sourceChain: null,
  amountIn: '',
  amountOut: '',
};

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
  },
});

export const {
  setDestAsset,
  setDestChain,
  setSourceAsset,
  setSourceChain,
  setAmountIn,
  setAmountOut,
} = swapsSlice.actions;

export default swapsSlice.reducer;
