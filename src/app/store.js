import { configureStore } from "@reduxjs/toolkit";
import stakeReducer from "../features/staking/stakeSlice";
import proposalsReducer from "../features/gov/govSlice";
import feegrantReducer from "../features/feegrant/feegrantSlice";
import authzReducer from "../features/authz/authzSlice";
import bankReducer from "../features/bank/bankSlice";
import walletSlice from "../features/wallet/walletSlice";
import commonSlice from "../features/common/commonSlice";
import distributionSlice from "../features/distribution/distributionSlice";
import airdropSlice from "../features/airdrop/airdropSlice";
import multiSlice from "../features/multisig/multisigSlice";

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
    airdrop: airdropSlice,
    multisig: multiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["wallet/connect/fulfilled"],
      },
    }),
});
