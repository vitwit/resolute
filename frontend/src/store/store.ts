"use client";

import { configureStore } from "@reduxjs/toolkit";
import multisigSlice from "./features/multisig/multisigSlice";
import walletSlice from "./features/wallet/walletSlice";

export const store = configureStore({
  reducer: {
    wallet: walletSlice,
    multisig: multisigSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
