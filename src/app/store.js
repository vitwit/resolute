import { configureStore } from '@reduxjs/toolkit';
import stakeReducer from '../features/staking/stakeSlice';
import proposalsReducer from '../features/proposals/proposalsSlice';
import feegrantReducer from '../features/feegrant/feegrantSlice';
import authzReducer from '../features/authz/authzSlice';
import bankReducer from '../features/bank/bankSlice';
import walletSlice from '../features/wallet/walletSlice';
import commonSlice from '../features/common/commonSlice';
import distributionSlice from '../features/distribution/distributionSlice';

export const store = configureStore({
  reducer: {
    staking: stakeReducer,
    gov: proposalsReducer,
    feegrant: feegrantReducer,
    wallet: walletSlice,
    bank: bankReducer,
    authz: authzReducer,
    common: commonSlice,
    distribution: distributionSlice,
  },
});
