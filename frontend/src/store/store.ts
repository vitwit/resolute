'use client';

import { configureStore } from '@reduxjs/toolkit';
import multisigSlice from './features/multisig/multisigSlice';
import walletSlice from './features/wallet/walletSlice';
import commonSlice from './features/common/commonSlice';
import stakeSlice from './features/staking/stakeSlice';
import bankSlice from './features/bank/bankSlice';
import distributionSlice from './features/distribution/distributionSlice';
import transactionHistorySlice from './features/transactionHistory/transactionHistorySlice';

export const store = configureStore({
  reducer: {
    wallet: walletSlice,
    multisig: multisigSlice,
    common: commonSlice,
    staking: stakeSlice,
    bank: bankSlice,
    distribution: distributionSlice,
    transactionHistory: transactionHistorySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
