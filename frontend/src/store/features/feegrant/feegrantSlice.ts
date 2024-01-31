import { TxStatus } from '@/types/enums';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import feegrantService from './feegrantService';
import { cloneDeep } from 'lodash';
import { getAddressByPrefix } from '@/utils/address';
import { FeegrantRevokeMsg } from '@/txns/feegrant';
import { signAndBroadcast } from '@/utils/signing';
import { GAS_FEE } from '@/utils/constants';
import { ERR_UNKNOWN } from '@/utils/errors';

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


export const txCreateFeegrant = createAsyncThunk(
  'feegrant/create-grant',
  async (
    data: TxCreateFeegrantInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.basicChainInfo.prefix,
        [data.msg],
        GAS_FEE,
        '',
        `${data.feeAmount}${data.denom}`,
        data.basicChainInfo.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
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
    builder
      .addCase(txCreateFeegrant.pending, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].tx.status = TxStatus.PENDING;
        state.chains[chainID].tx.errMsg = '';
      })
      .addCase(txCreateFeegrant.fulfilled, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        const { txHash } = action.payload;
        state.chains[chainID].tx.status = TxStatus.IDLE;
        state.chains[chainID].tx.errMsg = '';
        action.meta.arg.onTxComplete?.({
          isTxSuccess: true,
          txHash: txHash,
        });
      })
      .addCase(txCreateFeegrant.rejected, (state, action) => {
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
  },
});

export const {
  enableFeegrantMode,
  exitFeegrantMode,
  resetState,
  resetTxStatus,
} = feegrantSlice.actions;

export default feegrantSlice.reducer;
