import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getProposals, resetTx, txVote
} from './../features/gov/govSlice';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { ProposalItem } from './ProposalItem';
import {
  setError, resetError, resetTxHash
} from './../features/common/commonSlice';
import { authzExecHelper, getGrantsToMe } from '../features/authz/authzSlice';
import VoteDialog from '../components/Vote';
import { filterVotesFromAuthz } from '../utils/authorizations';

export function Proposals() {
  const proposals = useSelector((state) => state.gov.active.proposals);
  const errMsg = useSelector((state) => state.gov.active.errMsg);
  const status = useSelector((state) => state.gov.active.status);
  const proposalTally = useSelector((state) => state.gov.tally.proposalTally);
  const votes = useSelector((state) => state.gov.votes.proposals);
  const address = useSelector((state) => state.wallet.address);
  const govTx = useSelector((state) => state.gov.tx);
  const currency = useSelector((state) => state.wallet.chainInfo?.config?.currencies[0]);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);

  const dispatch = useDispatch();
  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const walletConnected = useSelector((state) => state.wallet.connected);
  useEffect(() => {
    if (walletConnected) {
      dispatch(getProposals({
        baseURL: chainInfo.config.rest,
        voter: address,
      }))

      dispatch(getGrantsToMe({
        baseURL: chainInfo.config.rest,
        grantee: address
      }))
    }
  }, [chainInfo, address, walletConnected]);

  const authzProposals = useMemo(() => filterVotesFromAuthz(grantsToMe.grants), [grantsToMe.grants]);


  useEffect(() => {
    if (status === 'rejected' && errMsg === '') {
      dispatch(setError({
        type: 'error',
        message: errMsg
      }))
    }
  }, [errMsg, status]);

  useEffect(() => {
    if (govTx?.status === 'idle' && walletConnected) {
      dispatch(getProposals({
        baseURL: chainInfo.config.rest,
        voter: address,
      }))
      dispatch(resetTx())
      setOpen(false);
    }
  }, [govTx, address, walletConnected]);

  useEffect(() => {
    return () => {
      dispatch(resetError());
      dispatch(resetTxHash());
    }
  }, []);

  const onVoteSubmit = (option, granter) => {
    const vote = nameToOption(option);
    if (!granter) {
      dispatch(txVote({
        voter: address,
        proposalId: selected,
        option: vote,
        denom: currency.coinMinimalDenom,
        memo: "",
        chainId: chainInfo.config.chainId,
        rpc: chainInfo.config.rpc,
        feeAmount: chainInfo.config.gasPriceStep.average,
      }))
    } else {
      authzExecHelper(dispatch, {
        type: "vote",
        from: address,
        granter: granter,
        option: vote,
        proposalId: selected,
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rpc: chainInfo.config.rpc,
        feeAmount: chainInfo.config.gasPriceStep.average,
      })
    }
  }

  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  }

  const [selected, setonShowVote] = useState('')


  return (
    <>
      <Grid container spacing={2}>
        {
          status === 'pending' ?
            <div style={{ display: 'flex', justifyContent: 'center', width: "100%", marginTop: 22 }}>
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
              <>
                {
                  proposals.map((proposal, index) => (
                    <Grid item md={6} xs={12} key={index}>
                      <Paper elevation={0} style={{ padding: 12 }}>
                        <ProposalItem
                          setOpen={(open) => setOpen(open)}
                          info={proposal}
                          tally={proposalTally[proposal?.proposal_id]}
                          vote={votes[proposal?.proposal_id]}
                          txStatus={govTx}
                          onVote={(pId) => setonShowVote(pId)}
                        />
                      </Paper>
                    </Grid>
                  ))
                }

                <VoteDialog
                  open={open}
                  closeDialog={closeDialog}
                  onVote={onVoteSubmit}
                  grants={authzProposals}
                />
              </>

        }
      </Grid>
    </>
  );
}


function nameToOption(name) {
  switch (name) {
    case 'yes':
      return 1
    case 'no':
      return 3
    case 'abstain':
      return 2
    case 'noWithVeto':
      return 4
    default:
      return 0
  }
}