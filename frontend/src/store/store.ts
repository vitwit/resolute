'use client';

import { configureStore } from '@reduxjs/toolkit';
import multisigSlice from './features/multisig/multisigSlice';
import walletSlice from './features/wallet/walletSlice';
import commonSlice from './features/common/commonSlice';

export const store = configureStore({
  reducer: {
    wallet: walletSlice,
    multisig: multisigSlice,
    common: commonSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
