import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getProposals, txVote
} from './../features/gov/govSlice';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { ProposalItem } from './ProposalItem';
import {
  setError, resetError, resetTxHash
} from './../features/common/commonSlice';

export function Proposals() {
  const proposals = useSelector((state) => state.gov.active.proposals);
  const errMsg = useSelector((state) => state.gov.active.errMsg);
  const status = useSelector((state) => state.gov.active.status);
  const proposalTally = useSelector((state) => state.gov.tally.proposalTally);
  const votes = useSelector((state) => state.gov.votes.proposals);
  const address = useSelector((state) => state.wallet.address);
  const govTx = useSelector((state) => state.gov.tx);
  const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);

  const dispatch = useDispatch();

  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const walletConnected = useSelector((state) => state.wallet.connected);
  useEffect(() => {
    if (walletConnected)
      dispatch(getProposals({
        baseURL: chainInfo.lcd,
        voter: address,
      })
      )
  }, [chainInfo]);

  useEffect(() => {
    if (status === 'rejected' && errMsg === '') {
      dispatch(setError({

        type: 'error',
        message: errMsg
      }))
    }
  }, [errMsg]);

  useEffect(() => {
    return () => {
        dispatch(resetError());
        dispatch(resetTxHash());
    }
}, []);

const onVoteSubmit = (proposalId, option) => {
  dispatch(txVote({
    voter: address,
    proposalId: proposalId,
    option: option,
    denom: currency.coinMinimalDenom,
    memo: "",
    chainId: chainInfo.chainId,
    rpc: chainInfo.rpc,
    feeAmount: 25000
  }))
}

  return (
    <>
      <Grid container spacing={2}>
        {
          status === 'pending' ?
          <div style={{ display: 'flex', justifyContent: 'center', width:"100%", marginTop: 22 }}>
            <CircularProgress />
            </div>
            :
            proposals.length === 0 ?
              <Typography
                variant='h5'
                fontWeight={500}
                color='text.primary'
                style={{ justifyContent: 'center', width: '100%' }}
              >
                <br />
                <br />
                <br />
                No Active Proposals Found
              </Typography>
              :
              proposals.map((proposal, index) => (
                <Grid item md={6} xs={12} key={index}>
                  <Paper elevation={0} style={{ padding: 12 }}>
                    <ProposalItem 
                    info={proposal} 
                    tally={proposalTally[proposal?.proposal_id]} 
                    vote={votes[proposal?.proposal_id]}
                    txStatus={govTx}
                    onVoteSubmit={onVoteSubmit}
                    />
                  </Paper>
                </Grid>
              ))
        }
      </Grid>
    </>
  );
}
