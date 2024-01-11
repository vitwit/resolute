'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import authzService from './service';
import { TxStatus } from '../../../types/enums';
import { cloneDeep } from 'lodash';
import { getAddressByPrefix } from '@/utils/address';
import {
  Authorization,
  GetGrantsInputs,
  txAuthzExecInputs,
} from '@/types/authz';
import { ERR_UNKNOWN } from '@/utils/errors';
import { signAndBroadcast } from '@/utils/signing';
import { setError, setTxAndHash } from '../common/commonSlice';
import { NewTransaction } from '@/utils/transaction';
import { addTransactions } from '../transactionHistory/transactionHistorySlice';
import { GAS_FEE } from '@/utils/constants';
import { AuthzRevokeMsg } from '@/txns/authz';

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
  };
}

interface GetAuthRevokeInputs {
  basicChainInfo: BasicChainInfo;
  feegranter: string;
  denom: string;
  granter: string;
  grantee: string;
  typeURL: string;
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
}

const initialState: AuthzState = {
  authzModeEnabled: false,
  authzAddress: '',
  chains: {},
  getGrantsByMeLoading: 0,
  getGrantsToMeLoading: 0,
  AddressToChainAuthz: {},
};

export const getGrantsToMe = createAsyncThunk(
  'authz/grantsToMe',
  async (data: GetGrantsInputs) => {
    const response = await authzService.grantsToMe(
      data.baseURL,
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
      data.baseURL,
      data.address,
      data.pagination
    );
    return {
      data: response.data,
    };
  }
);

export const txAuthzExec = createAsyncThunk(
  'authz/tx-exec',
  async (
    data: txAuthzExecInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.basicChainInfo.prefix,
        data.msgs,
        GAS_FEE,
        data.metaData,
        `${data.basicChainInfo.feeAmount}${data.feeDenom}`,
        data.basicChainInfo.rest,
        data.feeGranter
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
      const msg = AuthzRevokeMsg(data.granter, data.grantee, data.typeURL);
      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.basicChainInfo.prefix,
        [msg],
        860000,
        '',
        `${data.feeAmount}${data.denom}`,
        data.basicChainInfo.rest
        // data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        dispatch(
          setTxAndHash({
            hash: result?.transactionHash,
          })
        );
        dispatch(
          getGrantsByMe({
            baseURL: data.basicChainInfo.baseURL,
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
        state.chains[chainID].tx.status = TxStatus.PENDING;
        state.chains[chainID].tx.errMsg = '';
      })
      .addCase(txAuthzExec.fulfilled, (state, action) => {
        const chainID = action.meta.arg.basicChainInfo.chainID;
        state.chains[chainID].tx.status = TxStatus.IDLE;
      })
      .addCase(txAuthzExec.rejected, (state, action) => {
        const chainID = action.meta.arg.basicChainInfo.chainID;
        state.chains[chainID].tx.status = TxStatus.REJECTED;
        state.chains[chainID].tx.errMsg = action.error.message || 'rejected';
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
