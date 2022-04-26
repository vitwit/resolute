import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getProposals
} from './../features/proposals/proposalsSlice';
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
    if (status === 'rejected' && errMsg == '') {
      dispatch(setError({

        type: 'error',
        message: errMsg
      }))
    }
  }, [errMsg])


  return (
    <>
      <Grid container spacing={2}>
        {
          status === 'loading' ?
            <CircularProgress  style={{display: 'flex', justifyContent: 'center'}}/>
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
              proposals.map((proposal) => (
                <Grid item md={6} xs={12}>
                  <Paper elevation={0} style={{ padding: 12 }}>
                    <ProposalItem info={proposal} />
                  </Paper>
                </Grid>
              ))
        }
      </Grid>
    </>
  );
}
