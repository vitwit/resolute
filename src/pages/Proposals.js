import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getProposals
} from './../features/proposals/proposalsSlice';
import Grid from '@mui/material/Grid';
import { ProposalItem } from './ProposalItem';
import { Paper, Typography } from '@mui/material';

export function Proposals() {
  const proposals = useSelector((state) => state.gov.active.proposals);
  const dispatch = useDispatch();

  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  useEffect(() => {
    dispatch(getProposals({
      baseURL: chainInfo.lcd
    })

    )
  }, [chainInfo]);

  return (
    <>
      <div style={{ justifyContent: 'left', display: 'flex' }}>
        <Typography variant='h4' color='text.primary'>
          Proposals
        </Typography>
      </div>
      <br />
      <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={2}>
          {
            proposals.length === 0 ?
              <Typography variant='h6' color='text.primary' >
                No Proposals Found
              </Typography>
              :
              proposals.map((proposal) => (
                <Grid item md={6} xs={12}>
                  <Paper elevation={0} style={{ padding: 12 }}>
                    <ProposalItem info={proposal} />
                  </Paper>
                </Grid>
              ))
          }
        </Grid>
      </div>
    </>
  );
}
