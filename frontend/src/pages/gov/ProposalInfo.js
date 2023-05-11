import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { computeVotePercentage, getProposalComponent } from "../../utils/util";
import { getLocalTime } from "../../utils/datetime";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProposal,
  getProposalTally,
  txVote,
} from "../../features/gov/govSlice";
import {
  resetError,
  resetFeegrant,
  setError,
} from "../../features/common/commonSlice";
import { resetTx } from "../../features/distribution/distributionSlice";
import { getVoteAuthz } from "../../utils/authorizations";
import { authzExecHelper } from "../../features/authz/authzSlice";
import VoteDialog from "../../components/Vote";
import { getPoolInfo } from "../../features/staking/stakeSlice";
import { useTheme } from "@emotion/react";
import FeegranterInfo from "../../components/FeegranterInfo";
import { getMainNetworks } from "../../utils/networks";
import ReactMarkdown from "react-markdown";
import "./../common.css";

export default function ProposalInfo() {
  const { chainName, id } = useParams();
  const proposalState = useSelector((state) => state.gov.proposalInfo);
  const tallyState = useSelector((state) => state.gov.tally);
  const dispatch = useDispatch();
  const { proposalInfo } = proposalState;
  const poolInfo = useSelector((state) => state.staking.pool);
  const feegrant = useSelector((state) => state.common.feegrant);
  const chainData = getMainNetworks();
  const chainInfo = chainData.filter((item) => item.config.chainName == chainName)[0]
  
  useEffect(() => {
    dispatch(
      getProposal({
        baseURL: chainInfo.config.rest,
        proposalId: id,
      })
    );
    dispatch(
      getPoolInfo({
        baseURL: chainInfo.config.rest,
      })
    );
    dispatch(
      getProposalTally({
        baseURL: chainInfo.config.rest,
        proposalId: id,
      })
    );

    return () => {
      dispatch(resetError());
      dispatch(resetTx());
    };
  }, []);

  useEffect(() => {
    if (proposalState.status === "rejected" && proposalState.error.length > 0) {
      dispatch(
        setError({
          type: "error",
          message: proposalState.error,
        })
      );
    }
  }, [proposalState]);

  const address = useSelector((state) => state.wallet.address);
  const govTx = useSelector((state) => state.gov.tx);
  const currency = useSelector(
    (state) => state.wallet.chainInfo?.config?.currencies[0]
  );
  const walletConnected = useSelector((state) => state.wallet.connected);

  // authz
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const selectedAuthz = useSelector((state) => state.authz.selected);
  const authzProposal = useMemo(
    () => getVoteAuthz(grantsToMe.grants, selectedAuthz.granter),
    [grantsToMe.grants, selectedAuthz]
  );
  const authzExecTx = useSelector((state) => state.authz.execTx);
  const errMsg = useSelector((state) => state.gov.active.errMsg);
  const status = useSelector((state) => state.gov.active.status);

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
        }
      } else {
        if (authzExecTx.status === "idle") {
          dispatch(resetTx());
          setOpen(false);
        }
      }
    }
  }, [govTx, authzExecTx]);

  const removeFeegrant = () => {
    // Should we completely remove feegrant or only for this session.
    dispatch(resetFeegrant());
  };

  const onVoteSubmit = (option) => {
    const vote = nameToOption(option);
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
            chainInfo.config.gasPriceStep.average * 10 ** currency.coinDecimals,
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
            chainInfo.config.gasPriceStep.average * 10 ** currency.coinDecimals,
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
      {proposalState.status === "idle" ? (
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
            fontWeight={500}
          >
            Proposal Details
          </Typography>
          {feegrant.granter.length > 0 ? (
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
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" color="text.primary" gutterBottom>
                &nbsp;
              </Typography>
              {getProposalComponent(proposalInfo?.status)}
            </div>
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={500}
              gutterBottom
            >
              #{id}&nbsp;&nbsp;{proposalInfo?.content?.title}
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
                  {getLocalTime(proposalInfo?.voting_start_time)}
                </Typography>
              </Grid>

              <Grid item xs={6} md={4}>
                <Typography gutterBottom color="text.secondary" variant="body2">
                  Voting Ends
                </Typography>
                <Typography gutterBottom color="text.primary" variant="body1">
                  {getLocalTime(proposalInfo?.voting_end_time)}
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
                    computeVotePercentage(
                      tallyState?.proposalTally[id],
                      poolInfo
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
                    computeVotePercentage(
                      tallyState?.proposalTally[id],
                      poolInfo
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
                    computeVotePercentage(
                      tallyState?.proposalTally[id],
                      poolInfo
                    ).no_with_veto
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
                    computeVotePercentage(
                      tallyState?.proposalTally[id],
                      poolInfo
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
            <div style={{
                padding: 8,
                backgroundColor:
                theme.palette?.mode === "light" ? "#f9fafc" : "#282828",
                color: "text.primary",
                whiteSpace: "pre-line",
              }} className="proposal-description-markdown">
              <ReactMarkdown>{proposalInfo?.content?.description && proposalInfo?.content?.description.replace(/\\n/g, '\n')}</ReactMarkdown>
            </div>
          </Paper>
        </>
      ) : (
        <CircularProgress size={35} />
      )}

      <VoteDialog open={open} closeDialog={closeDialog} onVote={onVoteSubmit} />
    </>
  );
}

const parseDescription = (description) =>
  description.replace(/(\r\n|\r|\n)/g, "<br />");

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
