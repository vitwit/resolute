import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getKeplrWalletAmino, isKeplrInstalled } from '../../txns/execute'
import { setConnected } from '../../utils/localStorage';
import { setError } from '../common/commonSlice'

const initialState = {
  name: '',
  connected: false,
  address: '',
  chainInfo: {
    currencies: [],
  },
}

export const connectKeplrWallet = createAsyncThunk(
  'wallet/connect',
  async (network, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      if (!isKeplrInstalled()) {
        dispatch(setError({
          type: 'error',
          message: 'Keplr wallet is not installed'
        }))
        return rejectWithValue('Keplr wallet is not installed')
      } else {
        window.keplr.defaultOptions = {
          sign: {
            preferNoSetMemo: true,
            disableBalanceCheck: true,
          },
        };
        if (network.experimental) {
          await window.keplr.experimentalSuggestChain(network.config)
        }
        try {
          const result = await getKeplrWalletAmino(network.config.chainId)
          const walletInfo = await window.keplr.getKey(network.config.chainId)
          setConnected();
          return fulfillWithValue({
            walletInfo: walletInfo,
            result: result,
            network: network
          })
        } catch (error) {
          dispatch(setError({
            type: 'error',
            message: error.message || ""
          }))
          return rejectWithValue(error.message)
        }
      }
    } catch (error) {
      dispatch(setError({
        type: 'error',
        message: error.message || ""
      }))
      return rejectWithValue(error.message)
    }
  }
);

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.address = action.payload.address
      state.connected = true
      state.chainInfo = action.payload.chainInfo
    },
    resetWallet: (state) => {
      state.connected = false
      state.address = ''
      state.algo = ''
      state.name = ''
    },
    setNetwork: (state, action) => {
      state.chainInfo = action.payload.chainInfo
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectKeplrWallet.pending, () => {
      })
      .addCase(connectKeplrWallet.fulfilled, (state, action) => {
        const result = action.payload
        state.name = result.walletInfo?.name
        state.address = result.result[1].address
        state.chainInfo = result.network
        state.connected = true
      })
      .addCase(connectKeplrWallet.rejected, () => {
      })
  }

});

export const { setWallet, resetWallet, setNetwork } = walletSlice.actions

export default walletSlice.reducer