import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProposals, resetTx, txVote } from "./../features/gov/govSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { ProposalItem } from "./ProposalItem";
import {
  setError,
  resetError,
  resetTxHash,
} from "./../features/common/commonSlice";
import {
  authzExecHelper,
  getGrantsToMe,
  resetExecTx,
} from "../features/authz/authzSlice";
import VoteDialog from "../components/Vote";
import { getVoteAuthz } from "../utils/authorizations";

export default function Proposals() {
  const proposals = useSelector((state) => state.gov.active.proposals);
  const errMsg = useSelector((state) => state.gov.active.errMsg);
  const status = useSelector((state) => state.gov.active.status);
  const proposalTally = useSelector((state) => state.gov.tally.proposalTally);
  const votes = useSelector((state) => state.gov.votes.proposals);
  const address = useSelector((state) => state.wallet.address);
  const govTx = useSelector((state) => state.gov.tx);
  const currency = useSelector(
    (state) => state.wallet.chainInfo?.config?.currencies[0]
  );

  const dispatch = useDispatch();
  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const walletConnected = useSelector((state) => state.wallet.connected);
  useEffect(() => {
    if (walletConnected) {
      dispatch(
        getGrantsToMe({
          baseURL: chainInfo.config.rest,
          grantee: address,
        })
      );

      if (selectedAuthz.granter.length === 0) {
        dispatch(
          getProposals({
            baseURL: chainInfo.config.rest,
            voter: address,
          })
        );
      } else {
        dispatch(
          getProposals({
            baseURL: chainInfo.config.rest,
            voter: selectedAuthz.granter,
          })
        );
      }
    }
  }, [chainInfo, address, walletConnected]);

  // authz
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const selectedAuthz = useSelector((state) => state.authz.selected);
  const authzProposal = useMemo(
    () => getVoteAuthz(grantsToMe.grants, selectedAuthz.granter),
    [grantsToMe.grants, selectedAuthz]
  );
  const authzExecTx = useSelector((state) => state.authz.execTx);

  useEffect(() => {
    if (status === "rejected" && errMsg === "") {
      dispatch(
        setError({
          type: "error",
          message: errMsg,
        })
      );
    }
  }, [errMsg, status]);

  useEffect(() => {
    if (walletConnected) {
      if (selectedAuthz.granter.length === 0) {
        if (govTx.status === "idle") {
          dispatch(resetTx());
          setOpen(false);
          dispatch(
            getProposals({
              baseURL: chainInfo.config.rest,
              voter: address,
            })
          );
        }
      } else {
        if (authzExecTx.status === "idle") {
          dispatch(resetExecTx());
          setOpen(false);
          dispatch(
            getProposals({
              baseURL: chainInfo.config.rest,
              voter: selectedAuthz.granter,
            })
          );
        }
      }
    }
  }, [govTx, authzExecTx]);

  useEffect(() => {
    if (selectedAuthz.granter.length === 0) {
      dispatch(
        getProposals({
          baseURL: chainInfo.config.rest,
          voter: address,
        })
      );
    } else {
      dispatch(
        getProposals({
          baseURL: chainInfo.config.rest,
          voter: selectedAuthz.granter,
        })
      );
    }
    return () => {
      dispatch(resetError());
      dispatch(resetTxHash());
      dispatch(resetTx());
      setOpen(false);
    };
  }, []);

  const onVoteSubmit = (option) => {
    const vote = nameToOption(option);
    if (selectedAuthz.granter.length === 0) {
      dispatch(
        txVote({
          voter: address,
          proposalId: selected,
          option: vote,
          denom: currency.coinMinimalDenom,
          chainId: chainInfo.config.chainId,
          rpc: chainInfo.config.rpc,
          feeAmount: chainInfo.config.gasPriceStep.average,
        })
      );
    } else {
      if (authzProposal?.granter === selectedAuthz.granter) {
        authzExecHelper(dispatch, {
          type: "vote",
          from: address,
          granter: selectedAuthz.granter,
          option: vote,
          proposalId: selected,
          denom: currency.coinMinimalDenom,
          chainId: chainInfo.config.chainId,
          rpc: chainInfo.config.rpc,
          feeAmount: chainInfo.config.gasPriceStep.average,
        });
      } else {
        alert("You don't have permission to vote");
      }
    }
  };

  const [open, setOpen] = useState(false);
  const closeDialog = () => {
    setOpen(false);
  };

  const [selected, setonShowVote] = useState("");
  const onVoteDialog = (proposalId) => {
    if (selectedAuthz.granter.length > 0) {
      if (authzProposal?.granter === selectedAuthz.granter) {
        setOpen(true);
        setonShowVote(proposalId);
      } else {
        alert("You don't have permission to vote");
      }
    } else {
      setOpen(true);
      setonShowVote(proposalId);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        {status === "pending" ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: 22,
            }}
          >
            <CircularProgress />
          </div>
        ) : proposals.length === 0 ? (
          <Typography
            variant="h5"
            fontWeight={500}
            color="text.primary"
            style={{ justifyContent: "center", width: "100%", marginTop: 24 }}
          >
            No Active Proposals Found
          </Typography>
        ) : (
          <>
            {proposals.map((proposal, index) => (
              <Grid item md={6} xs={12} key={index}>
                <Paper elevation={0} style={{ padding: 12 }}>
                  <ProposalItem
                    info={proposal}
                    tally={proposalTally[proposal?.proposal_id]}
                    vote={votes[proposal?.proposal_id]}
                    txStatus={govTx}
                    setOpen={(pId) => onVoteDialog(pId)}
                  />
                </Paper>
              </Grid>
            ))}

            <VoteDialog
              open={open}
              closeDialog={closeDialog}
              onVote={onVoteSubmit}
            />
          </>
        )}
      </Grid>
    </>
  );
}

function nameToOption(name) {
  switch (name) {
    case "yes":
      return 1;
    case "abstain":
      return 2;
    case "no":
      return 3;
    case "noWithVeto":
      return 4;
    default:
      return 0;
  }
}
