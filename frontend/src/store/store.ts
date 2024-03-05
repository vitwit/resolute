'use client';

import { configureStore } from '@reduxjs/toolkit';
import multisigSlice from './features/multisig/multisigSlice';
import walletSlice from './features/wallet/walletSlice';
import commonSlice from './features/common/commonSlice';
import stakeSlice from './features/staking/stakeSlice';
import bankSlice from './features/bank/bankSlice';
import distributionSlice from './features/distribution/distributionSlice';
import authSlice from './features/auth/authSlice';
import govSlice from './features/gov/govSlice';
import ibcSlice from './features/ibc/ibcSlice';
import ibcSwapSlice from './features/ibc/ibcSwapSlice';
import authzSlice from './features/authz/authzSlice';
import feegrantSlice from './features/feegrant/feegrantSlice';
import recentTransactionsSlice from './features/recent-transactions/recentTransactionsSlice';

export const store = configureStore({
  reducer: {
    wallet: walletSlice,
    multisig: multisigSlice,
    common: commonSlice,
    staking: stakeSlice,
    bank: bankSlice,
    auth: authSlice,
    distribution: distributionSlice,
    gov: govSlice,
    ibc: ibcSlice,
    authz: authzSlice,
    feegrant: feegrantSlice,
    recentTransactions: recentTransactionsSlice,
    ibcSwap: ibcSwapSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
