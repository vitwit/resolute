import { TxStatus } from '@/types/enums';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import feegrantService from './feegrantService';
import { cloneDeep } from 'lodash';
import { getAddressByPrefix } from '@/utils/address';
import { FeegrantRevokeMsg } from '@/txns/feegrant';
import { signAndBroadcast } from '@/utils/signing';
import { GAS_FEE } from '@/utils/constants';

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

export const txRevoke = createAsyncThunk(
  'feegrant/tx-revoke',
  async (data: FeeGrantRevokeInputs, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = FeegrantRevokeMsg(data.granter, data.grantee);

      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.basicChainInfo.prefix,
        [msg],
        GAS_FEE,
        '',
        `${data.basicChainInfo.feeAmount * 10 ** data.basicChainInfo.decimals}${
          data.denom
        }`,
        data.basicChainInfo.rest,
        data?.feegranter
      );
      
      if (result?.code === 0) {
        dispatch(getGrantsByMe({
          baseURLs: data.baseURLs,
          address: data?.basicChainInfo.address,
          chainID: data?.basicChainInfo?.chainID
        }
        ))
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        return rejectWithValue(result?.rawLog);
      }
       /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.log('error while revoke fee grant txn ', error)
      return rejectWithValue(error?.message)
    }
  }
);


export const feegrantSlice = createSlice({
  name: 'feegrant',
  initialState,
  reducers: {},
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

export const { } = feegrantSlice.actions;

export default feegrantSlice.reducer;
