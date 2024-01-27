import { TxStatus } from '@/types/enums';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import feegrantService from './feegrantService';
import { cloneDeep } from 'lodash';
import { getAddressByPrefix } from '@/utils/address';

interface ChainAllowance {
  grantsToMe: Allowance[];
  grantsByMe: Allowance[];
  getGrantsToMeLoading: {
    status: TxStatus;
    errMsg: string;
  };
  getGrantsByMeLoading: {
    status: TxStatus;
    errMsg: string;
  };
  grantsToMeAddressMapping: Record<string, Allowance[]>;
  grantsByMeAddressMapping: Record<string, Allowance[]>;
  tx: {
    status: TxStatus;
    errMsg: string;
  };
}

const defaultState: ChainAllowance = {
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
  grantsByMeAddressMapping: {},
  grantsToMeAddressMapping: {},
  tx: {
    status: TxStatus.INIT,
    errMsg: '',
  },
};

interface FeegrantState {
  feegrantModeEnabled: boolean;
  feegrantAddress: string;
  chains: Record<string, ChainAllowance>;
  getGrantsToMeLoading: number;
  getGrantsByMeLoading: number;
  addressToChainFeegrant: Record<string, Record<string, Allowance[]>>;
}

const initialState: FeegrantState = {
  feegrantModeEnabled: false,
  feegrantAddress: '',
  chains: {},
  getGrantsByMeLoading: 0,
  getGrantsToMeLoading: 0,
  addressToChainFeegrant: {},
};

export const getGrantsToMe = createAsyncThunk(
  'feegrant/grantsToMe',
  async (data: GetFeegrantsInputs) => {
    const response = await feegrantService.grantsToMe(
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
  'feegrant/grantsByMe',
  async (data: GetFeegrantsInputs) => {
    const response = await feegrantService.grantsByMe(
      data.baseURLs,
      data.address,
      data.pagination
    );

    return {
      data: response.data,
    };
  }
);

export const feegrantSlice = createSlice({
  name: 'feegrant',
  initialState,
  reducers: {
    enableFeegrantMode: (state, action: PayloadAction<{ address: string }>) => {
      state.feegrantModeEnabled = true;
      state.feegrantAddress = action.payload.address;
    },
    exitFeegrantMode: (state) => {
      state.feegrantModeEnabled = false;
      state.feegrantAddress = '';
    },
    resetState: (state) => {
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
        state.chains[chainID].grantsToMeAddressMapping = {};
        const allAddressToFeegrant = state.addressToChainFeegrant;
        const addresses = Object.keys(allAddressToFeegrant);
        addresses.forEach((address) => {
          allAddressToFeegrant[address][chainID] = [];
        });

        state.addressToChainFeegrant = allAddressToFeegrant;
      })
      .addCase(getGrantsToMe.fulfilled, (state, action) => {
        const chainID = action.meta.arg.chainID;
        const allAddressToFeegrant = state.addressToChainFeegrant;
        const addresses = Object.keys(allAddressToFeegrant);
        addresses.forEach((address) => {
          allAddressToFeegrant[address][chainID] = [];
        });

        state.addressToChainFeegrant = allAddressToFeegrant;

        state.getGrantsToMeLoading--;

        const grants = action.payload.data.allowances;
        state.chains[chainID].grantsToMe = grants;
        const addressMapping: Record<string, Allowance[]> = {};
        const allChainsAddressToGrants = state.addressToChainFeegrant;

        grants.forEach((grant: Allowance) => {
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
        state.addressToChainFeegrant = allChainsAddressToGrants;
        state.chains[chainID].grantsToMeAddressMapping = addressMapping;
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
            'An error occurred while fetching feegrants to me',
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
        state.chains[chainID].grantsByMeAddressMapping = {};
      })
      .addCase(getGrantsByMe.fulfilled, (state, action) => {
        state.getGrantsByMeLoading--;
        const chainID = action.meta.arg.chainID;
        const grants = action.payload.data.allowances;
        state.chains[chainID].grantsByMe = grants;
        const addressMapping: Record<string, Allowance[]> = {};
        grants.forEach((grant: Allowance) => {
          const granter = grant.grantee;
          if (!addressMapping[granter]) addressMapping[granter] = [];
          addressMapping[granter] = [...addressMapping[granter], grant];
        });
        state.chains[chainID].grantsByMeAddressMapping = addressMapping;
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
            'An error occurred while fetching feegrants by me',
        };
      });
  },
});

export const {
  enableFeegrantMode,
  exitFeegrantMode,
  resetState,
  resetTxStatus,
} = feegrantSlice.actions;

export default feegrantSlice.reducer;
