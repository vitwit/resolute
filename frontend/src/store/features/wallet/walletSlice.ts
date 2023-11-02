'use client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWalletAmino } from '../../../txns/execute';
import { isWalletInstalled } from './walletService';
import { setConnected, setWalletName } from '../../../utils/localStorage';

declare let window: WalletWindow

interface ChainInfo {
  walletInfo: {
    name: string
    isNanoLedger: boolean
    pubKey: string
  }
  network: {
    config: {
      chainId: string
      chainName: string
    }
    keplrExperimental?: boolean
    leapExperimental?: boolean
  }
}

const initialState = {
  name: '',
  connected: false,
  isNanoLedger: false,
  pubKey: '',
  networks: {},
  nameToChainIDs: {},
}

export const establishWalletConnection = createAsyncThunk(
  'wallet/connect',
  async (
    data: {
      networks: Network[]
      walletName: string
    },
    { rejectWithValue, fulfillWithValue }
  ) => {
    const networks = data.networks

    if (!isWalletInstalled(data.walletName)) {
      alert('wallet is not installed')
      return rejectWithValue('wallet is not installed')
    } else {
      window.wallet.defaultOptions = {
        sign: {
          preferNoSetMemo: true,
          disableBalanceCheck: true,
        },
      }
      const chainIDs: string[] = networks.map(
        (mainnet) => mainnet.config.chainId
      )

      window.wallet.enable(chainIDs)

      let walletName = ''
      let isNanoLedger = false
      const chainInfos: Record<string, ChainInfo> = {}
      const nameToChainIDs: Record<string, string> = {}
      for (let i = 0; i < networks.length; i++) {
        try {
          if (
            (data.walletName === 'keplr' ||
              data.walletName === 'cosmostation') &&
            networks[i].keplrExperimental
          ) {
            await window.wallet.experimentalSuggestChain(networks[i].config)
          }
          if (data.walletName === 'leap' && networks[i].leapExperimental) {
            await window.wallet.experimentalSuggestChain(networks[i].config)
          }
          let chainId: string = networks[i].config.chainId
          const chainName: string = networks[i].config.chainName
          await getWalletAmino(chainId)

          const walletInfo = await window.wallet.getKey(chainId)

          walletInfo.pubKey = Buffer.from(walletInfo?.pubKey).toString('base64')
          delete walletInfo?.address

          walletName = walletInfo?.name
          isNanoLedger = walletInfo?.isNanoLedger || false

          chainInfos[chainId] = {
            walletInfo: walletInfo,
            network: networks[i],
          }
          nameToChainIDs[chainName?.toLowerCase().split(' ').join('')] = chainId
        } catch (error) {
          console.log(
            `unable to connect to network ${networks[i].config.chainName}: `,
            error
          )
        }
      }

      if (Object.keys(chainInfos).length === 0) {
        alert('Permission denied for all the networks')
        return rejectWithValue('Permission denied for all the networks')
      } else {
        setConnected()
        setWalletName(data.walletName)

        return fulfillWithValue({
          chainInfos,
          nameToChainIDs,
          walletName,
          isNanoLedger,
        })
      }
    }
  }
)

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (
      state
      // action: PayloadAction<{ address: string; chainInfo: any }>
    ) => {
      state.connected = true
    },
    resetWallet: (state) => {
      state.connected = false
      state.name = ''
      state.pubKey = ''
      state.nameToChainIDs = {}
      state.networks = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(establishWalletConnection.pending, () => {})
      .addCase(establishWalletConnection.fulfilled, (state, action) => {
        const networks = action.payload.chainInfos
        const nameToChainIDs = action.payload.nameToChainIDs
        state.networks = networks
        state.nameToChainIDs = nameToChainIDs
        state.connected = true
        state.isNanoLedger = action.payload.isNanoLedger
        state.name = action.payload.walletName
      })
      .addCase(establishWalletConnection.rejected, () => {})
  },
})

export const { setWallet, resetWallet } = walletSlice.actions

export default walletSlice.reducer
