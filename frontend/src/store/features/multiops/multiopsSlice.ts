'use client';

import { TxStatus } from '@/types/enums';
import { GAS_FEE } from '@/utils/constants';
import { signAndBroadcast } from '@/utils/signing';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setError, setTxAndHash } from '../common/commonSlice';
import { NewTransaction } from '@/utils/transaction';
import { ERR_UNKNOWN } from '@/utils/errors';

interface MultiopsState {
  tx: {
    status: TxStatus;
    error: string;
  };
}

const initialState: MultiopsState = {
  tx: {
    status: TxStatus.INIT,
    error: '',
  },
};

export const txExecuteMultiMsg = createAsyncThunk(
  'multiops/tx-execute',
  async (
    data: TxExecuteMultiMsgInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.basicChainInfo.prefix,
        data.msgs,
        GAS_FEE,
        data.memo,
        `${data.basicChainInfo.feeAmount * 10 ** data.basicChainInfo.decimals}${
          data.denom
        }`,
        data.basicChainInfo.rest,
        data.feegranter,
        data.basicChainInfo.rpc,
        data.basicChainInfo.restURLs
      );

      const tx = NewTransaction(
        result,
        data.msgs,
        data.basicChainInfo.chainID,
        data.basicChainInfo.address
      );

      if (result?.code === 0) {
        dispatch(
          setTxAndHash({
            tx: tx,
            hash: result?.transactionHash,
          })
        );

        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: 'error',
            message: result?.rawLog || '',
          })
        );
        return rejectWithValue(result?.rawLog);
      }
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errMsg = error?.message || ERR_UNKNOWN;
      dispatch(
        setError({
          message: errMsg,
          type: 'error',
        })
      );
      return rejectWithValue(errMsg);
    }
  }
);

export const multiopsSlice = createSlice({
  name: 'multiops',
  initialState,
  reducers: {
    resetTx: (state) => {
      state.tx.status = TxStatus.INIT;
      state.tx.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(txExecuteMultiMsg.pending, (state) => {
        state.tx.status = TxStatus.PENDING;
        state.tx.error = '';
      })
      .addCase(txExecuteMultiMsg.fulfilled, (state) => {
        state.tx.status = TxStatus.IDLE;
        state.tx.error = '';
      })
      .addCase(txExecuteMultiMsg.rejected, (state, action) => {
        state.tx.status = TxStatus.REJECTED;
        state.tx.error = action.error.message || ERR_UNKNOWN;
      });
  },
});

export const { resetTx } = multiopsSlice.actions;
export default multiopsSlice.reducer;
