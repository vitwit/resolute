import { configureStore } from "@reduxjs/toolkit";
import stakeReducer from "../features/staking/stakeSlice";
import proposalsReducer from "../features/gov/govSlice";
import nodeReducer from "../features/node/nodeSlice";
import feegrantReducer from "../features/feegrant/feegrantSlice";
import authzReducer from "../features/authz/authzSlice";
import bankReducer from "../features/bank/bankSlice";
import walletSlice from "../features/wallet/walletSlice";
import commonSlice from "../features/common/commonSlice";
import distributionSlice from "../features/distribution/distributionSlice";
import airdropSlice from "../features/airdrop/airdropSlice";
import multiSlice from "../features/multisig/multisigSlice";
import groupSlice from "../features/group/groupSlice";
import slashingSlice from "../features/slashing/slashingSlice";
import authReducer from "../features/auth/slice";
import validatorSlice from "../features/validator/validatorSlice";

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
    group: groupSlice,
    multisig: multiSlice,
    slashing: slashingSlice,
    node: nodeReducer,
    auth: authReducer,
    validator: validatorSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "wallet/connect/fulfilled",
          "wallet/connectv1/fulfilled",
          "multisig/verifyAccount/fulfilled",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
