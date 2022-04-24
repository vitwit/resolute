import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  algo: '',
  bech32Address: '',
  isNanoLedger: false,
  connected: false,
  chainInfo: {},
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.bech32Address = action.payload.bech32Address
      state.algo = action.payload.algo
      state.isNanoLedger = action.payload.isNanoLedger
      state.connected = true
      state.name = action.payload.name
      state.chainInfo = action.payload.chainInfo
    },
    resetWallet: (state) => {
      state.connected = false
      state.bech32Address = ''
      state.algo = ''
      state.isNanoLedger = false
      state.chainInfo = {}
      state.name = ''
    }
  },
})

export const { setWallet, resetWallet } = walletSlice.actions

export default walletSlice.reducer