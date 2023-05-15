import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProposals, resetTx, txVote } from "../../features/gov/govSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { ProposalItem } from "./ProposalItem";
import {
  setError,
  resetError,
  resetTxHash,
  resetFeegrant,
} from "../../features/common/commonSlice";
import {
  authzExecHelper,
  getGrantsToMe,
  resetExecTx,
} from "../../features/authz/authzSlice";
import VoteDialog from "../../components/Vote";
import { getVoteAuthz } from "../../utils/authorizations";
import { useNavigate } from "react-router-dom";
import FeegranterInfo from "../../components/FeegranterInfo";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import PropTypes from "prop-types";

Proposals.propTypes = {
  restEndpoint: PropTypes.string.isRequired,
  chainName: PropTypes.string.isRequired,
  chainLogo: PropTypes.string.isRequired,
  signer: PropTypes.string.isRequired,
  chainID: PropTypes.string.isRequired,
  gasPriceStep: PropTypes.object.isRequired,
  aminoConfig: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  bech32Config: PropTypes.object.isRequired,
};


export default function Proposals({ restEndpoint, chainName, chainLogo, signer, gasPriceStep,
  chainID, aminoConfig, currencies, bech32Config,
}) {
  const errMsg = useSelector((state) => state.gov.active.errMsg);
  const status = useSelector((state) => state.gov.active.status);
  const proposalTally = useSelector((state) => state.gov.tally[chainID]?.proposalTally || {});
  const votes = useSelector((state) => state.gov.votes[chainID]?.proposals || {});
  const address = useSelector((state) => state.wallet.address);
  const feegrant = useSelector((state) => state.common.feegrant);

  const govTx = useSelector((state) => state.gov.tx);
  const currency = currencies[0]

  const proposals = useSelector((state) => state.gov.active[chainID]?.proposals || []);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedAuthz.granter.length === 0) {
      dispatch(
        getProposals({
          baseURL: restEndpoint,
          voter: signer,
          chainID: chainID,
        })
      );
    } else {
      dispatch(
        getProposals({
          baseURL: restEndpoint,
          chainID: chainID,
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
    if (selectedAuthz.granter.length === 0) {
      if (govTx.status === "idle") {
        dispatch(resetTx());
        setOpen(false);
        dispatch(
          getProposals({
            baseURL: restEndpoint,
            voter: signer,
          })
        );
      }
    } else {
      if (authzExecTx.status === "idle") {
        dispatch(resetExecTx());
        setOpen(false);
        dispatch(
          getProposals({
            baseURL: restEndpoint,
            voter: selectedAuthz.granter,
          })
        );
      }
    }
  }, [govTx, authzExecTx]);

  const onVoteSubmit = (option) => {
    const vote = nameToOption(option);
    if (selectedAuthz.granter.length === 0) {
      dispatch(
        txVote({
          voter: signer,
          proposalId: selected,
          option: vote,
          denom: currency.coinMinimalDenom,
          chainId: chainID,
          rest: restEndpoint,
          aminoConfig: aminoConfig,
          prefix: bech32Config.bech32PrefixAccAddr,
          feeAmount: gasPriceStep.average * 10 ** currency.coinDecimals,
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
          proposalId: selected,
          denom: currency.coinMinimalDenom,
          chainId: chainID,
          rest: restEndpoint,
          aminoConfig: aminoConfig,
          prefix: bech32Config.bech32PrefixAccAddr,
          feeAmount: gasPriceStep.average * 10 ** currency.coinDecimals,
          feegranter: feegrant.granter,
        });
      } else {
        alert("You don't have permission to vote");
      }
    }
  };

  const removeFeegrant = () => {
    // Should we completely remove feegrant or only for this session.
    dispatch(resetFeegrant());
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

  const navigate = useNavigate();

  return (
    <>
      {feegrant.granter.length > 0 ? (
        <FeegranterInfo
          feegrant={feegrant}
          onRemove={() => {
            removeFeegrant();
          }}
        />
      ) : null}
      {!proposals?.length ? (
        <Box
          sx={{
            margin: "16px 0 10px 0",
          }}
        ></Box>
      ) : (
        <Box
          sx={{
            margin: "16px 0 10px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar src={chainLogo} alt="network-icon" />
            <Typography
              variant="h6"
              sx={{ color: "text.primary", margin: "0 8px" }}
            >
              {chainName}
            </Typography>
            <Badge sx={{ margin: "12px" }} badgeContent={0} color="primary" />
          </Box>
        </Box>
      )}
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
          <></>
        ) : (
          <>
            {proposals.map((proposal, index) => (
              <Grid item md={6} xs={12} key={index}>

                <ProposalItem
                  info={proposal}
                  tally={proposalTally[proposal?.proposal_id]}
                  vote={votes[proposal?.proposal_id]}
                  txStatus={govTx}
                  setOpen={(pId) => onVoteDialog(pId)}
                  onItemClick={() =>
                    navigate(
                      `/proposals/${chainName}/${proposal?.proposal_id}`
                    )
                  }
                  chainUrl={restEndpoint}
                  proposalId={proposal?.proposal_id}
                />
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
