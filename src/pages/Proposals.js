import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getProposals, getProposalTally, getVotes
} from './../features/gov/govSlice';
import { setError } from './../features/common/commonSlice';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { ProposalItem } from './ProposalItem';

export function Proposals() {
  const proposals = useSelector((state) => state.gov.active.proposals);
  const errMsg = useSelector((state) => state.gov.active.errMsg);
  const status = useSelector((state) => state.gov.active.status);
  const proposalTally = useSelector((state) => state.gov.tally.proposalTally);
  const votes = useSelector((state) => state.gov.votes.proposals);
  const address = useSelector((state) => state.wallet.address);

  const dispatch = useDispatch();

  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const walletConnected = useSelector((state) => state.wallet.connected);
  useEffect(() => {
    if (walletConnected)
      dispatch(getProposals({
        baseURL: chainInfo.lcd
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
    if (proposals.length > 0 && address !== "") {
      for (let i = 0; i < proposals.length; i++) {
        const proposal = proposals[i]
        if (proposal !== undefined) {
          dispatch(getProposalTally({
            baseURL: chainInfo.lcd,
            proposalId: proposal?.proposal_id
          }))

          dispatch(getVotes({
            baseURL: chainInfo.lcd,
            proposalId: proposal?.proposal_id,
            voter: address
          }))
        }
      }
    }
  }, [proposals]);


  useEffect(() => {
    console.log("votes", votes);
  },[votes])


  return (
    <>
      <Grid container spacing={2}>
        {
          status === 'loading' ?
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
                    <ProposalItem info={proposal} tally={proposalTally[proposal?.proposal_id]} vote={votes[proposal?.proposal_id]}/>
                  </Paper>
                </Grid>
              ))
        }
      </Grid>
    </>
  );
}
