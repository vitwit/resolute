import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { getLocalTime } from "../../../utils/datetime";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProposal,
  getProposalTally,
  txVote,
} from "../../../features/gov/govSlice";
import {
  resetError,
  resetFeegrant,
  setError,
  setFeegrant as setFeegrantState,
} from "../../../features/common/commonSlice";
import { resetTx } from "../../../features/distribution/distributionSlice";
import { getVoteAuthz } from "../../../utils/authorizations";
import { authzExecHelper } from "../../../features/authz/authzSlice";
import VoteDialog from "../../../components/Vote";
import { getPoolInfo } from "../../../features/staking/stakeSlice";
import { useTheme } from "@emotion/react";
import FeegranterInfo from "../../../components/FeegranterInfo";
import { filterVoteAuthz } from "../ProposalsPage";
import { getFeegrant } from "../../../utils/localStorage";
import getProposalStatusComponent, { computeVotingPercentage, nameToVoteOption } from "../../../utils/proposals";

export default function ProposalInfo() {
  const dispatch = useDispatch();
  const params = useParams();

  const [authzGrants, setAuthzGrants] = useState({});

  const { networkName, id } = params;
  const nameToIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToIDs[networkName];
  const network = useSelector((state) => state.wallet.networks[chainID]);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const poolInfo = useSelector(
    (state) => state.staking.chains?.[chainID]?.pool
  );

  const currency = network?.network?.config?.currencies[0];
  const address = network?.walletInfo?.bech32Address;

  const proposalTally = useSelector(
    (state) => state.gov.tally[chainID]?.proposalTally || {}
  );

  const activeProposals = useSelector((state) => state.gov.active);
  const chainInfo = network?.network;
  const [proposal, setProposal] = useState({});
  const feegrant = useSelector((state) => state.common.feegrant?.[networkName] || {});

  useEffect(() => {
    const chainID = nameToIDs[networkName];
    if (networkName?.length > 0 && chainID?.length > 0) {
      if (!activeProposals[chainID]?.proposals?.length) {
        dispatch(
          getProposal({
            baseURL: network?.network?.config.rest,
            proposalId: id,
            chainID: chainID,
          })
        );
        dispatch(
          getProposalTally({
            baseURL: network?.network?.config.rest,
            proposalId: id,
            chainID: chainID,
          })
        );
      }
    }
  }, [nameToIDs]);

  useEffect(() => {
    if (activeProposals[chainID]?.proposals?.length > 0) {
      for (
        let index = 0;
        index < activeProposals[chainID].proposals.length;
        index++
      ) {
        const proposal = activeProposals[chainID].proposals[index];
        if (proposal?.proposal_id === id) {
          setProposal(proposal);
        }
      }
      dispatch(
        getPoolInfo({
          baseURL: network?.network?.config?.rest,
          chainID: chainID,
        })
      );
      dispatch(
        getProposalTally({
          baseURL: network?.network?.config.rest,
          proposalId: id,
          chainID: chainID,
        })
      );
    }
  }, [activeProposals]);

  useEffect(() => {
    return () => {
      dispatch(resetError());
      dispatch(resetTx({ chainID: chainID }));
    };
  }, []);

  useEffect(() => {
    const result = filterVoteAuthz(grantsToMe);
    if (Object.keys(result).length !== 0) {
      setAuthzGrants(result);
    }
  }, [grantsToMe]);

  const govTx = useSelector((state) => state.gov.tx);

  const walletConnected = useSelector((state) => state.wallet.connected);

  // authz
  const selectedAuthz = useSelector((state) => state.authz.selected);
  const authzProposal = useMemo(
    () => getVoteAuthz(grantsToMe.grants, selectedAuthz.granter),
    [grantsToMe.grants, selectedAuthz]
  );
  const isAuthzMode = useSelector((state) => state.common.authzMode);

  const authzExecTx = useSelector((state) => state.authz.execTx);
  const errMsg = useSelector((state) => state.gov.active.errMsg);
  const status = useSelector((state) => state.gov.active.status);

  const proposalState = { status: "idle" };

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
      if (
        (!selectedAuthz?.granter?.length && govTx.status === "idle") ||
        (selectedAuthz?.granter?.length && authzExecTx.status === "idle")
      ) {
        dispatch(resetTx({ chainID: chainID }));
        setOpen(false);
      }
    }
  }, [govTx, authzExecTx]);

  useEffect(() => {
    const currentChainGrants = getFeegrant()?.[networkName];
    dispatch(setFeegrantState({
      grants: currentChainGrants,
      chainName: networkName.toLowerCase()
    }));
  }, [networkName])

  const removeFeegrant = () => {
    // Should we completely remove feegrant or only for this session.
    dispatch(resetFeegrant());
  };

  const onVoteSubmit = (data) => {
    const vote = nameToVoteOption(data.option);
    if (selectedAuthz.granter.length === 0) {
      dispatch(
        txVote({
          voter: address,
          proposalId: id,
          option: vote,
          denom: currency.coinMinimalDenom,
          chainId: chainInfo.config.chainId,
          rpc: chainInfo.config.rpc,
          rest: chainInfo.config.rest,
          aminoConfig: chainInfo.aminoConfig,
          prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
          feeAmount:
            chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average * 10 ** currency.coinDecimals,
          feegranter: feegrant.granter,
        })
      );
    } else {
      if (authzProposal?.granter === selectedAuthz.granter) {
        authzExecHelper(dispatch, {
          type: "vote",
          from: address,
          granter: selectedAuthz.granter,
          option: vote,
          proposalId: id,
          denom: currency.coinMinimalDenom,
          chainId: chainInfo.config.chainId,
          rest: chainInfo.config.rest,
          aminoConfig: chainInfo.aminoConfig,
          prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
          feeAmount:
            chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average * 10 ** currency.coinDecimals,
          feegranter: feegrant.granter,
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

  const onVoteDialog = () => {
    if (selectedAuthz.granter.length > 0) {
      if (authzProposal?.granter === selectedAuthz.granter) {
        setOpen(true);
      } else {
        alert("You don't have permission to vote");
      }
    } else {
      setOpen(true);
    }
  };

  const theme = useTheme();
  return (
    <>
      {proposalState?.status === "idle" ? (
        <>
          <Typography
            gutterBottom
            sx={{
              textAlign: "left",
              pl: 2,
              mt: 1,
              mb: 1,
            }}
            color="text.primary"
            variant="h6"
            fontWeight={600}
          >
            Proposal Details
          </Typography>
          {feegrant?.granter?.length > 0 ? (
            <FeegranterInfo
              feegrant={feegrant}
              onRemove={() => {
                removeFeegrant();
              }}
            />
          ) : null}
          <Paper
            sx={{
              borderRadius: 0,
              p: 3,
              m: 3,
              textAlign: "left",
            }}
            elevation={0}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "right",
              }}
            >
              {getProposalStatusComponent({
                type: proposal?.status,
              })}
            </div>
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={600}
              gutterBottom
            >
              #{id}&nbsp;&nbsp;{proposal?.content?.title}
            </Typography>

            <Grid
              container
              sx={{
                mt: 1,
                mb: 1,
              }}
            >
              <Grid item xs={6} md={4}>
                <Typography gutterBottom color="text.secondary" variant="body2">
                  Submitted Time
                </Typography>
                <Typography gutterBottom color="text.primary" variant="body1">
                  2022-08-25 06:53
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography gutterBottom color="text.secondary" variant="body2">
                  Voting Starts
                </Typography>
                <Typography gutterBottom color="text.primary" variant="body1">
                  {getLocalTime(proposal?.voting_start_time)}
                </Typography>
              </Grid>

              <Grid item xs={6} md={4}>
                <Typography gutterBottom color="text.secondary" variant="body2">
                  Voting Ends
                </Typography>
                <Typography gutterBottom color="text.primary" variant="body1">
                  {getLocalTime(proposal?.voting_end_time)}
                </Typography>
              </Grid>
            </Grid>

            <Box
              component="div"
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Vote details
              </Typography>

              <Button
                variant="contained"
                disableElevation
                sx={{
                  textTransform: "none",
                }}
                onClick={() => {
                  onVoteDialog();
                }}
              >
                Vote
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6} md={2}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                >
                  YES
                </Typography>
                <Typography>
                  {
                    computeVotingPercentage(
                      proposalTally[id],
                      true,
                      poolInfo?.[chainID]
                    ).yes
                  }
                  %
                </Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                >
                  NO
                </Typography>
                <Typography>
                  {
                    computeVotingPercentage(
                      proposalTally[id],
                      true,
                      poolInfo?.[chainID]
                    ).no
                  }
                  %
                </Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                >
                  NO WITH VETO
                </Typography>
                <Typography>
                  {
                    computeVotingPercentage(
                      proposalTally[id],
                      true,
                      poolInfo?.[chainID]
                    ).noWithVeto
                  }
                  %
                </Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                >
                  ABSTAIN
                </Typography>
                <Typography>
                  {
                    computeVotingPercentage(
                      proposalTally[id],
                      true,
                      poolInfo?.[chainID]
                    ).abstain
                  }
                  %
                </Typography>
              </Grid>
            </Grid>
            <Typography
              color="text.primary"
              variant="body1"
              fontWeight={500}
              gutterBottom
              sx={{
                mt: 2,
              }}
            >
              Proposal Details
            </Typography>
            {/* <div
              style={{
                padding: 8,

                backgroundColor:
                  theme.palette?.mode === "light" ? "#f9fafc" : "#282828",
                color: "text.primary",
              }}
              dangerouslySetInnerHTML={{
                __html: parseDescription(
                  `${proposalInfo?.content?.description}`
                ),
              }}
            /> */}
            <div
              style={{
                padding: 8,
                backgroundColor:
                  theme.palette?.mode === "light" ? "#f9fafc" : "#282828",
                color: "text.primary",
                whiteSpace: "pre-line",
              }}
              className="proposal-description-markdown"
            >
              {proposal?.content?.description &&
                proposal?.content?.description.replace(/\\n/g, "\n")}
            </div>
          </Paper>
        </>
      ) : (
        <CircularProgress size={35} />
      )}

      <VoteDialog
        open={open}
        closeDialog={closeDialog}
        onVote={onVoteSubmit}
        isAuthzMode={isAuthzMode}
        granters={authzGrants[chainID] || []}
      />
    </>
  );
}
