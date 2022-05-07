import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  name: '',
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
      state.address = action.payload.address
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
    },
    extraReducers: (builder) => {
    }
      
  }

});

export const { setWallet, resetWallet } = walletSlice.actions

export default walletSlice.reducer