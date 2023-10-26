"use client";

import { configureStore } from "@reduxjs/toolkit";
import multisigSlice from "./features/multisig/multisigSlice";

export const store = configureStore({
  reducer: {
    multisig: multisigSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
