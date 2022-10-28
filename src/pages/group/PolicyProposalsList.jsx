import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AlertMsg from "../../components/group/AlertMsg";
import ProposalCard from "../../components/group/ProposalCard";
import {
  getGroupPolicyProposals,
  txGroupProposalExecute,
  txGroupProposalVote,
} from "../../features/group/groupSlice";
import { Box } from "@mui/system";

function PolicyProposalsList(props) {
  const dispatch = useDispatch();
  const params = useParams();

  const proposals = useSelector((state) => state.group?.proposals);
  const wallet = useSelector((state) => state.wallet);
  const [voteOpen, setVoteOpen] = useState(false);
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
    <Paper
      sx={{
        mt: 3,
        p: 2,
        textAlign: "left",
      }}
      variant="outlined"
      elevation={0}
    >
      <Box
        component="div"
        sx={{
          mt: 2,
          mb: 1,
          textAlign: "right",
        }}
      >
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
          }}
          disableElevation
          onClick={() => {
            navigate(
              `/group/${params?.id}/policies/${props?.policyInfo?.address}/proposals`
            );
          }}
        >
          Create Proposal
        </Button>
      </Box>

      <Typography
        gutterBottom
        variant="h6"
        color="text.primary"
        fontWeight={600}
      >
        All Proposals
      </Typography>

      {proposals?.status === "pending" ? (
        <CircularProgress sx={{ textAlign: "center" }} />
      ) : null}

      {proposals?.status === "idle" && !proposals?.data?.proposals?.length ? (
        <AlertMsg type="error" text="Proposals not found" />
      ) : null}

      <Grid spacing={2} container>
        {proposals?.data?.proposals?.map((p, index) => (
          <Grid item md={6} xs={12} key={index}>
            <ProposalCard proposal={p} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default PolicyProposalsList;
