import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  errState: {
    message: '',
    type: '',
  },
  txSuccess: {
    hash: ''
  },
  txLoadRes: { load: false }
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
    setTxHash: (state, action) => {
      state.txSuccess = {
        hash: action.payload.hash,
      }
    },
    setTxLoad: (state) => {
      state.txLoadRes = { load: true }
    },
    resetTxLoad: (state) => {
      state.txLoadRes = { load: false }
    },
    resetTxHash: (state) => {
      state.txSuccess = {
        hash: '',
      }
    },
    resetError: (state) => {
      state.errState = {
        message: '',
        type: ''
      }
    },
    resetDecisionPolicies: (state) => {
      state.groupPolicies = {}
    },
    resetActiveProposals: (state)=>{
      state.policyProposals = {}
    }
  },
})

export const {
  setError, resetError,
  resetActiveProposals,
  resetDecisionPolicies,
  setTxLoad, resetTxLoad,
  setTxHash, resetTxHash } = commonSlice.actions

export default commonSlice.reducer