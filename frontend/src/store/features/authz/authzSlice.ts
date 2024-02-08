'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import authzService from './service';
import { TxStatus } from '../../../types/enums';
import { cloneDeep } from 'lodash';
import { getAddressByPrefix } from '@/utils/address';
import { signAndBroadcast } from '@/utils/signing';
import { setError, setTxAndHash } from '../common/commonSlice';
import { NewTransaction } from '@/utils/transaction';
import { addTransactions } from '../transactionHistory/transactionHistorySlice';
import { GAS_FEE } from '@/utils/constants';
import { ERR_UNKNOWN } from '@/utils/errors';
import { AxiosError } from 'axios';

interface ChainAuthz {
  grantsToMe: Authorization[];
  grantsByMe: Authorization[];
  getGrantsToMeLoading: {
    status: TxStatus;
    errMsg: string;
  };
  getGrantsByMeLoading: {
    status: TxStatus;
    errMsg: string;
  };

  /*
    this is mapping of address to list of authorizations (chain level)
    example : {
        "pasg1..." : ["stakeAuthorization...", "sendAuthorization..."]
    }
  */

  GrantsToMeAddressMapping: Record<string, Authorization[]>;
  GrantsByMeAddressMapping: Record<string, Authorization[]>;
  tx: {
    status: TxStatus;
    errMsg: string;
    type?: string;
  };
}

interface GetAuthRevokeInputs {
  basicChainInfo: BasicChainInfo;
  feegranter: string;
  denom: string;
  msgs: Msg[];
  feeAmount: number;
}
const defaultState: ChainAuthz = {
  grantsToMe: [],
  grantsByMe: [],
  getGrantsByMeLoading: {
    status: TxStatus.INIT,
    errMsg: '',
  },
  getGrantsToMeLoading: {
    status: TxStatus.INIT,
    errMsg: '',
  },
  GrantsByMeAddressMapping: {},
  GrantsToMeAddressMapping: {},
  tx: {
    status: TxStatus.INIT,
    errMsg: '',
  },
};

interface AuthzState {
  authzModeEnabled: boolean;
  authzAddress: string;
  chains: Record<string, ChainAuthz>;
  getGrantsToMeLoading: number;
  getGrantsByMeLoading: number;
  /*
    this is mapping of address to chain id to list of authorizations (inter chain level)
    example : {
        "cosmos1..." : {
          "cosmoshub-4": ["stakeAuthorization...", "sendAuthorization..."]
        }
    }
  */
  AddressToChainAuthz: Record<string, Record<string, Authorization[]>>;
  multiChainAuthzGrantTx: {
    status: TxStatus;
  };
}

const initialState: AuthzState = {
  authzModeEnabled: false,
  authzAddress: '',
  chains: {},
  getGrantsByMeLoading: 0,
  getGrantsToMeLoading: 0,
  AddressToChainAuthz: {},
  multiChainAuthzGrantTx: {
    status: TxStatus.INIT,
  },
};

export const getGrantsToMe = createAsyncThunk(
  'authz/grantsToMe',
  async (data: GetGrantsInputs) => {
    const response = await authzService.grantsToMe(
      data.baseURLs,
      data.address,
      data.pagination
    );

    return {
      data: response.data,
    };
  }
);

export const getGrantsByMe = createAsyncThunk(
  'authz/grantsByMe',
  async (data: GetGrantsInputs) => {
    const response = await authzService.grantsByMe(
      data.baseURLs,
      data.address,
      data.pagination
    );
    return {
      data: response.data,
    };
  }
);

export const txCreateMultiChainAuthzGrant = createAsyncThunk(
  'authz/create-multichain-grant',
  async (data: TxGrantMultiChainAuthzInputs, { rejectWithValue, dispatch }) => {
    try {
      const promises = data.data.map((chainGrant) => {
        return dispatch(txCreateAuthzGrant(chainGrant));
      });
      await Promise.all(promises);
      data.data.forEach((chainGrant) => {
        dispatch(txCreateAuthzGrant(chainGrant));
      });
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response);
    }
  }
);

export const txCreateAuthzGrant = createAsyncThunk(
  'authz/create-grant',
  async (
    data: TxGrantAuthzInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.basicChainInfo.prefix,
        data.msgs,
        GAS_FEE,
        '',
        `${data.feeAmount}${data.denom}`,
        data.basicChainInfo.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined,
        '',
        data?.basicChainInfo?.restURLs
      );

      // TODO: Store txn, (This is throwing error because of BigInt in message)
      // const tx = NewTransaction(
      //   result,
      //   data.msgs,
      //   data.basicChainInfo.chainID,
      //   data.basicChainInfo.address
      // );
      // dispatch(
      //   addTransactions({
      //     chainID: data.basicChainInfo.chainID,
      //     address: data.basicChainInfo.cosmosAddress,
      //     transactions: [tx],
      //   })
      // );

      // dispatch(
      //   setTxAndHash({
      //     tx: undefined,
      //     hash: tx.transactionHash,
      //   })
      // );

      if (result?.code === 0) {
        dispatch(
          getGrantsByMe({
            baseURL: data.basicChainInfo.baseURL,
            baseURLs: data.basicChainInfo.restURLs,
            address: data.basicChainInfo.address,
            chainID: data.basicChainInfo.chainID,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        return rejectWithValue(result?.rawLog);
      }
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      return rejectWithValue(error?.message || ERR_UNKNOWN);
    }
  }
);

export const txAuthzExec = createAsyncThunk(
  'authz/tx-exec',
  async (
    data: TxAuthzExecInputs,
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
        `${data.basicChainInfo.feeAmount * 10 ** data.basicChainInfo.decimals}${data.denom
        }`,
        data.basicChainInfo.rest,
        data.feegranter,
        '',
        data?.basicChainInfo?.restURLs
      );
      if (result?.code === 0) {
        const tx = NewTransaction(
          result,
          data.msgs,
          data.basicChainInfo.chainID,
          data.basicChainInfo.cosmosAddress
        );
        dispatch(
          addTransactions({
            transactions: [tx],
            chainID: data.basicChainInfo.chainID,
            address: data.basicChainInfo.cosmosAddress,
          })
        );
        dispatch(
          setTxAndHash({
            hash: result?.transactionHash,
            tx,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: 'error',
            message: result?.rawLog || 'transaction Failed',
          })
        );
        return rejectWithValue(result?.rawLog);
      }
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      dispatch(
        setError({
          type: 'error',
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txAuthzRevoke = createAsyncThunk(
  'authz/tx-revoke',
  async (
    data: GetAuthRevokeInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.basicChainInfo.prefix,
        data.msgs,
        GAS_FEE,
        '',
        `${data.feeAmount}${data.denom}`,
        data.basicChainInfo.rest,
        undefined,
        '',
        data?.basicChainInfo?.restURLs
        // data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        const tx = NewTransaction(
          result,
          data.msgs,
          data.basicChainInfo.chainID,
          data.basicChainInfo.cosmosAddress
        );
        dispatch(
          addTransactions({
            transactions: [tx],
            chainID: data.basicChainInfo.chainID,
            address: data.basicChainInfo.cosmosAddress,
          })
        );
        dispatch(
          setTxAndHash({
            tx: tx,
            hash: result?.transactionHash,
          })
        );
        dispatch(
          getGrantsByMe({
            baseURL: data.basicChainInfo.baseURL,
            baseURLs: data.basicChainInfo.restURLs,
            address: data.basicChainInfo.address,
            chainID: data.basicChainInfo.chainID,
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
    } catch (error) {
      dispatch(
        setError({
          type: 'error',
          message: ERR_UNKNOWN,
        })
      );
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const authzSlice = createSlice({
  name: 'authz',
  initialState,
  reducers: {
    enableAuthzMode: (state, action: PayloadAction<{ address: string }>) => {
      state.authzModeEnabled = true;
      state.authzAddress = action.payload.address;
    },
    exitAuthzMode: (state) => {
      state.authzModeEnabled = false;
      state.authzAddress = '';
    },
    resetState: (state) => {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      state = cloneDeep(initialState);
    },
    resetTxStatus: (state, action: PayloadAction<{ chainID: string }>) => {
      const { chainID } = action.payload;
      state.chains[chainID].tx = {
        errMsg: '',
        status: TxStatus.INIT,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGrantsToMe.pending, (state, action) => {
        state.getGrantsToMeLoading++;
        const chainID = action.meta.arg.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(defaultState);
        state.chains[chainID].getGrantsToMeLoading.status = TxStatus.PENDING;
        state.chains[chainID].grantsToMe = [];
        state.chains[chainID].GrantsToMeAddressMapping = {};
        const allAddressToAuthz = state.AddressToChainAuthz;
        const addresses = Object.keys(allAddressToAuthz);
        addresses.forEach((address) => {
          allAddressToAuthz[address][chainID] = [];
        });

        state.AddressToChainAuthz = allAddressToAuthz;
      })
      .addCase(getGrantsToMe.fulfilled, (state, action) => {
        const chainID = action.meta.arg.chainID;
        const allAddressToAuthz = state.AddressToChainAuthz;
        const addresses = Object.keys(allAddressToAuthz);
        addresses.forEach((address) => {
          allAddressToAuthz[address][chainID] = [];
        });

        state.AddressToChainAuthz = allAddressToAuthz;

        state.getGrantsToMeLoading--;

        const grants = action.payload.data.grants;
        state.chains[chainID].grantsToMe = grants;
        const addressMapping: Record<string, Authorization[]> = {};
        const allChainsAddressToGrants = state.AddressToChainAuthz;

        grants.forEach((grant: Authorization) => {
          const granter = grant.granter;
          const cosmosAddress = getAddressByPrefix(granter, 'cosmos');
          if (!addressMapping[granter]) addressMapping[granter] = [];
          if (!allChainsAddressToGrants[cosmosAddress])
            allChainsAddressToGrants[cosmosAddress] = {};
          if (!allChainsAddressToGrants[cosmosAddress][chainID])
            allChainsAddressToGrants[cosmosAddress][chainID] = [];
          allChainsAddressToGrants[cosmosAddress][chainID] = [
            ...allChainsAddressToGrants[cosmosAddress][chainID],
            grant,
          ];
          addressMapping[granter] = [...addressMapping[granter], grant];
        });
        state.AddressToChainAuthz = allChainsAddressToGrants;
        state.chains[chainID].GrantsToMeAddressMapping = addressMapping;
        state.chains[chainID].getGrantsToMeLoading = {
          status: TxStatus.IDLE,
          errMsg: '',
        };
      })
      .addCase(getGrantsToMe.rejected, (state, action) => {
        state.getGrantsToMeLoading--;
        const chainID = action.meta.arg.chainID;

        state.chains[chainID].getGrantsToMeLoading = {
          status: TxStatus.REJECTED,
          errMsg:
            action.error.message ||
            'An error occurred while fetching authz grants to me',
        };
      });
    builder
      .addCase(getGrantsByMe.pending, (state, action) => {
        state.getGrantsByMeLoading++;
        const chainID = action.meta.arg.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(defaultState);
        state.chains[chainID].getGrantsByMeLoading.status = TxStatus.PENDING;
        state.chains[chainID].grantsByMe = [];
        state.chains[chainID].GrantsByMeAddressMapping = {};
      })
      .addCase(getGrantsByMe.fulfilled, (state, action) => {
        state.getGrantsByMeLoading--;
        const chainID = action.meta.arg.chainID;
        const grants = action.payload.data.grants;
        state.chains[chainID].grantsByMe = grants;
        const addressMapping: Record<string, Authorization[]> = {};
        grants.forEach((grant: Authorization) => {
          const granter = grant.grantee;
          if (!addressMapping[granter]) addressMapping[granter] = [];
          addressMapping[granter] = [...addressMapping[granter], grant];
        });
        state.chains[chainID].GrantsByMeAddressMapping = addressMapping;
        state.chains[chainID].getGrantsByMeLoading = {
          status: TxStatus.IDLE,
          errMsg: '',
        };
      })
      .addCase(getGrantsByMe.rejected, (state, action) => {
        state.getGrantsByMeLoading--;
        const chainID = action.meta.arg.chainID;

        state.chains[chainID].getGrantsByMeLoading = {
          status: TxStatus.REJECTED,
          errMsg:
            action.error.message ||
            'An error occurred while fetching authz grants by me',
        };
      });
    builder
      .addCase(txAuthzExec.pending, (state, action) => {
        const chainID = action.meta.arg.basicChainInfo.chainID;
        const actionType = action.meta.arg.type;
        state.chains[chainID].tx.status = TxStatus.PENDING;
        state.chains[chainID].tx.errMsg = '';
        state.chains[chainID].tx.type = actionType;
      })
      .addCase(txAuthzExec.fulfilled, (state, action) => {
        const chainID = action.meta.arg.basicChainInfo.chainID;
        state.chains[chainID].tx.status = TxStatus.IDLE;
        state.chains[chainID].tx.type = '';
      })
      .addCase(txAuthzExec.rejected, (state, action) => {
        const chainID = action.meta.arg.basicChainInfo.chainID;
        state.chains[chainID].tx.status = TxStatus.REJECTED;
        state.chains[chainID].tx.errMsg = action.error.message || 'rejected';
        state.chains[chainID].tx.type = '';
      });
    builder
      .addCase(txCreateAuthzGrant.pending, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].tx.status = TxStatus.PENDING;
        state.chains[chainID].tx.errMsg = '';
      })
      .addCase(txCreateAuthzGrant.fulfilled, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        const { txHash } = action.payload;
        state.chains[chainID].tx.status = TxStatus.IDLE;
        state.chains[chainID].tx.errMsg = '';
        action.meta.arg.onTxComplete?.({
          isTxSuccess: true,
          txHash: txHash,
        });
      })
      .addCase(txCreateAuthzGrant.rejected, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].tx.status = TxStatus.REJECTED;
        state.chains[chainID].tx.errMsg =
          typeof action.payload === 'string' ? action.payload : '';
        action.meta.arg.onTxComplete?.({
          isTxSuccess: false,
          error:
            typeof action.payload === 'string' ? action.payload : ERR_UNKNOWN,
        });
      });

    builder
      .addCase(txCreateMultiChainAuthzGrant.pending, (state) => {
        state.multiChainAuthzGrantTx.status = TxStatus.PENDING;
      })
      .addCase(txCreateMultiChainAuthzGrant.fulfilled, (state) => {
        state.multiChainAuthzGrantTx.status = TxStatus.IDLE;
      })
      .addCase(txCreateMultiChainAuthzGrant.rejected, (state) => {
        state.multiChainAuthzGrantTx.status = TxStatus.REJECTED;
      });

    builder
      .addCase(txAuthzRevoke.pending, (state, action) => {
        const chainID = action.meta.arg.basicChainInfo.chainID;
        state.chains[chainID].tx.status = TxStatus.PENDING;
        state.chains[chainID].tx.errMsg = '';
      })
      .addCase(txAuthzRevoke.fulfilled, (state, action) => {
        const chainID = action.meta.arg.basicChainInfo.chainID;
        state.chains[chainID].tx.status = TxStatus.IDLE;
      })
      .addCase(txAuthzRevoke.rejected, (state, action) => {
        const chainID = action.meta.arg.basicChainInfo.chainID;
        state.chains[chainID].tx.status = TxStatus.REJECTED;
        state.chains[chainID].tx.errMsg = action.error.message || 'rejected';
      });
  },
});

export const { enableAuthzMode, exitAuthzMode, resetState, resetTxStatus } =
  authzSlice.actions;

export default authzSlice.reducer;
