import {
  Alert,
  Card,
  CircularProgress,
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AlertMsg from "../../components/group/AlertMsg";
import ProposalCard from "../../components/group/ProposalCard";
import {
  getGroupPolicyProposals,
  txGroupProposalExecute,
  txGroupProposalVote,
} from "../../features/group/groupSlice";
import { proposalStatus } from "../../utils/util";

function PolicyProposalsList() {
  const dispatch = useDispatch();
  const params = useParams();

  const proposals = useSelector((state) => state.group?.proposals);
  console.log("p----------", proposals);
  const wallet = useSelector((state) => state.wallet);
  const [voteOpen, setVoteOpen] = useState(false);
  const voteRes = useSelector((state) => state.group?.voteRes);
  const createProposalRes = useSelector(
    (state) => state.group?.groupProposalRes
  );
  const navigate = useNavigate();

  const getProposals = () => {
    dispatch(
      getGroupPolicyProposals({
        baseURL: wallet?.chainInfo?.config?.rest,
        address: params?.policyId,
      })
    );
  };

  useEffect(() => {
    if (createProposalRes?.status === "idle") getProposals();
  }, [createProposalRes?.status]);

  useEffect(() => {
    getProposals();
  }, []);

  const onVoteDailogClose = () => {
    setVoteOpen(false);
  };

  const onConfirm = (voteObj) => {
    const chainInfo = wallet?.chainInfo;

    dispatch(
      txGroupProposalVote({
        admin: wallet?.address,
        voter: wallet?.address,
        option: voteObj?.vote,
        proposalId: voteObj?.proposalId,
        chainId: chainInfo?.config?.chainId,
        rpc: chainInfo?.config?.rpc,
        denom: chainInfo?.config?.currencies?.[0]?.coinMinimalDenom,
        feeAmount: chainInfo?.config?.gasPriceStep?.average,
      })
    );
    console.log("vote objj", voteObj);
  };

  const onExecute = (proposalId) => {
    const chainInfo = wallet?.chainInfo;

    dispatch(
      txGroupProposalExecute({
        proposalId: proposalId,
        admin: wallet?.address,
        executor: wallet?.address,
        chainId: chainInfo?.config?.chainId,
        rpc: chainInfo?.config?.rpc,
        denom: chainInfo?.config?.currencies?.[0]?.coinMinimalDenom,
        feeAmount: chainInfo?.config?.gasPriceStep?.average,
      })
    );
  };

  return (
    <Paper sx={{ borderRadius: 2, mt: 3 }} variant="outlined">
      <Typography
        sx={{
          background: "#FFF",
          textAlign: "left",
        }}
        p={1.5}
        gutterBottom
        variant="h5"
      >
        All Proposals
      </Typography>

      {proposals?.status === "pending" ? (
        <CircularProgress sx={{ textAlign: "center" }} />
      ) : null}

      {proposals?.status === "idle" && !proposals?.data?.proposals?.length ? (
        <AlertMsg type="error" text="Proposals not found" />
      ) : null}

      <Grid
        component={"div"}
        rowSpacing={{ md: 2 }}
        columnSpacing={{ md: 2 }}
        container
        p={2}
      >
        {proposals?.data?.proposals?.map((p) => (
          <Grid item md={6}>
            <ProposalCard proposal={p} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default PolicyProposalsList;
