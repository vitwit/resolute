'use client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWalletAmino } from '../../../txns/execute';
import { isWalletInstalled } from './walletService';
import { setConnected, setWalletName } from '../../../utils/localStorage';
import { TxStatus } from '@/types/enums';
import { loadTransactions } from '../transactionHistory/transactionHistorySlice';
import { setError } from '../common/commonSlice';
import { getKey } from '@leapwallet/cosmos-snap-provider';
import { getAddressByPrefix } from '@/utils/address';
import { getAuthzMode } from '@/utils/localStorage';
import { enableAuthzMode } from '../authz/authzSlice';

declare let window: WalletWindow;

interface ChainInfo {
  walletInfo: {
    name: string;
    isNanoLedger: boolean;
    pubKey: string;
    bech32Address: string;
    isKeystone: string;
    algo: string;
  };
  network: Network;
}

interface WalletState {
  name: string;
  connected: boolean;
  isLoading: boolean;
  isNanoLedger: boolean;
  pubKey: string;
  networks: Record<string, ChainInfo>;
  nameToChainIDs: Record<string, string>;
  status: TxStatus;
}

const initialState: WalletState = {
  name: '',
  connected: false,
  isLoading: true,
  isNanoLedger: false,
  pubKey: '',
  networks: {},
  nameToChainIDs: {},
  status: TxStatus.INIT,
};

export const establishWalletConnection = createAsyncThunk(
  'wallet/connect',
  async (
    data: {
      networks: Network[];
      walletName: string;
    },
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    const networks = data.networks;
    if (!isWalletInstalled(data.walletName)) {
      dispatch(setError({ type: 'error', message: 'Wallet is not installed' }));

      return rejectWithValue('wallet is not installed');
    } else {
      window.wallet.defaultOptions = {
        sign: {
          preferNoSetMemo: true,
          disableBalanceCheck: true,
        },
      };
      const chainIDs: string[] = networks.map(
        (mainnet) => mainnet.config.chainId
      );
      try {
        await window.wallet.enable(chainIDs);
      } catch (error) {
        console.log('caught', error);
      }

      let walletName = '';
      let isNanoLedger = false;
      const chainInfos: Record<string, ChainInfo> = {};
      const nameToChainIDs: Record<string, string> = {};
      let anyNetworkAddress = '';
      for (let i = 0; i < networks.length; i++) {
        if (data.walletName === 'metamask') {
          try {
            const chainId: string = networks[i].config.chainId;
            const chainName: string = networks[i].config.chainName;
            const walletInfo = await getKey(chainId);
            walletName = walletInfo?.address;
            isNanoLedger = false;

            chainInfos[chainId] = {
              walletInfo: {
                algo: walletInfo?.algo,
                bech32Address: walletInfo?.address,
                pubKey: Buffer.from(walletInfo?.pubkey).toString(
                  'base64'
                ),
                isKeystone: '',
                isNanoLedger: isNanoLedger,
                name: walletName,
              },
              network: networks[i],
            };

            nameToChainIDs[chainName?.toLowerCase().split(' ').join('')] =
              chainId;

          } catch (error) {
            console.log(
              `unable to connect to network ${networks[i].config.chainName}: `,
              error
            );
          }

        } else {
          try {
            if (
              (data.walletName === 'keplr' ||
                data.walletName === 'cosmostation') &&
              networks[i].keplrExperimental
            ) {
              await window.wallet.experimentalSuggestChain(networks[i].config);
            }
            if (data.walletName === 'leap' && networks[i].leapExperimental) {
              await window.wallet.experimentalSuggestChain(networks[i].config);
            }
            const chainId: string = networks[i].config.chainId;
            const chainName: string = networks[i].config.chainName;
            await getWalletAmino(chainId);
            const walletInfo = await window.wallet.getKey(chainId);
            walletInfo.pubKey = Buffer.from(walletInfo?.pubKey).toString(
              'base64'
            );
            delete walletInfo?.address;
            walletName = walletInfo?.name;
            isNanoLedger = walletInfo?.isNanoLedger || false;
            chainInfos[chainId] = {
              walletInfo: walletInfo,
              network: networks[i],
            };
            nameToChainIDs[chainName?.toLowerCase().split(' ').join('')] =
              chainId;
          } catch (error) {
            console.log(
              `unable to connect to network ${networks[i].config.chainName}: `,
              error
            );
          }
        }

      }

      if (Object.keys(chainInfos).length === 0) {
        dispatch(
          setError({
            type: 'error',
            message: 'Permission denied for all the networks',
          })
        );

        return rejectWithValue('Permission denied for all the networks');
      } else {
        setConnected();
        setWalletName(data.walletName);

        const cosmosAddress = getAddressByPrefix(anyNetworkAddress, 'cosmos');
        const authzMode = getAuthzMode(cosmosAddress);
        if (authzMode.isAuthzModeOn)
          dispatch(enableAuthzMode({ address: authzMode.authzAddress }));
        dispatch(
          loadTransactions({
            address: cosmosAddress,
          })
        );
        return fulfillWithValue({
          chainInfos,
          nameToChainIDs,
          walletName,
          isNanoLedger,
        });
      }
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (
      state
      // action: PayloadAction<{ address: string; chainInfo: any }>
    ) => {
      state.connected = true;
    },
    resetWallet: (state) => {
      state.connected = false;
      state.name = '';
      state.pubKey = '';
      state.nameToChainIDs = {};
      state.networks = {};
      state.status = TxStatus.INIT;
    },
    resetConnectWalletStatus: (state) => {
      state.status = TxStatus.INIT;
    },
    unsetIsLoading: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(establishWalletConnection.pending, (state) => {
        state.status = TxStatus.PENDING;
      })
      .addCase(establishWalletConnection.fulfilled, (state, action) => {
        const networks = action.payload.chainInfos;
        const nameToChainIDs = action.payload.nameToChainIDs;
        state.networks = networks;
        state.nameToChainIDs = nameToChainIDs;
        state.connected = true;
        state.isNanoLedger = action.payload.isNanoLedger;
        state.name = action.payload.walletName;
        state.status = TxStatus.IDLE;
        state.isLoading = false;
      })
      .addCase(establishWalletConnection.rejected, (state) => {
        state.status = TxStatus.REJECTED;
        state.isLoading = false;
      });
  },
});

export const {
  setWallet,
  resetWallet,
  resetConnectWalletStatus,
  unsetIsLoading,
} = walletSlice.actions;

export default walletSlice.reducer;
