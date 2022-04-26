import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  errState: {
    message: '',
    type: '',
  } 
}

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.errState = {
        message: action.payload.message,
        type: action.payload.type
      }
    },
    resetError: (state) => {
      state.errState = {
        message: '',
        type: ''
      }
    }
  },
})

export const { setError, resetError } = commonSlice.actions

export default commonSlice.reducer