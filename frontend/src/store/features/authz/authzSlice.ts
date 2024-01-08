'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import authzService from './service';
import { TxStatus } from '../../../types/enums';
import { cloneDeep } from 'lodash';
import { getAddressByPrefix } from '@/utils/address';

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

export const authzSlice = createSlice({
  name: 'authz',
  initialState,
  reducers: {
    EnableAuthzMode: (state, action: PayloadAction<{ address: string }>) => {
      state.authzModeEnabled = true;
      state.authzAddress = action.payload.address;
    },
    exitAuthzMode: (state) => {
      state.authzModeEnabled = false;
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
        Object.keys(allAddressToAuthz).forEach((address) => {
          state.AddressToChainAuthz[address][chainID] = [];
        });
      })
      .addCase(getGrantsToMe.fulfilled, (state, action) => {
        state.getGrantsToMeLoading--;
        const chainID = action.meta.arg.chainID;
        const grants = action.payload.data.grants;
        state.chains[chainID].grantsToMe = grants;
        const addressMapping: Record<string, Authorization[]> = {};
        const allChainsAddressToGrants = state.AddressToChainAuthz;
        grants.forEach((grant) => {
          const granter = grant.granter;
          const cosmosAddress = getAddressByPrefix(granter, 'cosmos');
          if (!addressMapping[granter]) addressMapping[granter] = [];
          if (!allChainsAddressToGrants[chainID])
            allChainsAddressToGrants[chainID] = {};
          if (!allChainsAddressToGrants[chainID][cosmosAddress])
            allChainsAddressToGrants[chainID][cosmosAddress] = [];
          allChainsAddressToGrants[chainID][cosmosAddress] = [
            ...allChainsAddressToGrants[chainID][cosmosAddress],
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
        grants.forEach((grant) => {
          const granter = grant.granter;
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
          errMsg: action.error.message || 'An error occurred while fetching authz grants by me',
        };
      });
  },
});

export const { EnableAuthzMode, exitAuthzMode } = authzSlice.actions;

export default authzSlice.reducer;
