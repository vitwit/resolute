import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  algo: '',
  connected: false,
  address: '',
  chainInfo: {
    currencies: [],
  },
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action) => {
      console.log(action.payload)
      state.address = action.payload.address
      state.algo = action.payload.algo
      state.connected = true
      state.chainInfo = action.payload.chainInfo
    },
    resetWallet: (state) => {
      state.connected = false
      state.address = ''
      state.algo = ''
      state.chainInfo = {
        currencies: [],
      }
      state.name = ''
    }
  },
})

export const { setWallet, resetWallet } = walletSlice.actions

export default walletSlice.reducer