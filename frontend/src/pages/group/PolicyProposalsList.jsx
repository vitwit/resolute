import React, { useEffect } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
  const { chainInfo, address, chainID } = props;

  const proposals = useSelector((state) => state.group?.proposals?.[chainID]);
  const wallet = useSelector((state) => state.wallet);
  const createProposalRes = useSelector(
    (state) => state.group?.groupProposalRes
  );
  const navigate = useNavigate();
  const { networkName } = params;

  const getProposals = () => {
    dispatch(
      getGroupPolicyProposals({
        baseURL: chainInfo?.config?.rest,
        address: params?.policyId,
        chainID: chainID,
      })
    );
  };

  useEffect(() => {
    if (createProposalRes?.status === "idle") getProposals();
  }, [createProposalRes?.status]);

  useEffect(() => {
    getProposals();
  }, [chainInfo]);

  return (
    <Paper
      sx={{
        mt: 2,
        p: 2,
        textAlign: "left",
      }}
      variant="outlined"
      elevation={0}
    >
      <Box
        component="div"
        sx={{
          mt: 1,
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
              `/${networkName}/groups/${params?.id}/policies/${props?.policyInfo?.address}/proposals`
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
        <Box
          sx={{
            textAlign: "center",
            pb: 1,
          }}
        >
          <Typography color="text.primary" variant="h6" gutterBottom>
            No proposals found
          </Typography>
          <Button
            variant="contained"
            disableElevation
            size="small"
            sx={{
              textTransform: "none",
            }}
            onClick={() => {
              navigate(
                `/${networkName}/groups/${params?.id}/policies/${props?.policyInfo?.address}/proposals`
              );
            }}
          >
            Create one
          </Button>
        </Box>
      ) : null}

      <Grid spacing={2} container
        sx={{
          mt: 1,
        }}
      >
        {proposals?.data?.proposals?.map((p, index) => (
          <Grid item md={6} xs={12} key={index}>
            <ProposalCard proposal={p} networkName={networkName} groupID={params?.id} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default PolicyProposalsList;
