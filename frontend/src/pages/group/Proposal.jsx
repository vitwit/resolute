import {
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import VotesTable from "../../components/group/VotesTable";
import {
  getGroupProposalById,
  getVotesProposalById,
  txGroupProposalExecute,
  txGroupProposalVote,
} from "../../features/group/groupSlice";
import { shortenAddress } from "../../utils/util";
import AlertMsg from "../../components/group/AlertMsg";
import { getLocalTime } from "../../utils/datetime";
import DailogVote from "../../components/group/DialogVote";
import { parseProposalStatus } from "../../components/group/ProposalCard";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import { copyToClipboard } from "../../utils/clipboard";

const ProposalInfo = ({ id, wallet }) => {
  const [voteOpen, setVoteOpen] = useState(false);

  const dispatch = useDispatch();
  const proposalInfo = useSelector((state) => state.group.groupProposal);
  const voteRes = useSelector((state) => state.group?.voteRes);

  const { data: { proposal } = {} } = proposalInfo;

  const getProposal = () => {
    dispatch(
      getGroupProposalById({
        baseURL: wallet?.chainInfo?.config?.rest,
        id,
      })
    );
  };

  useEffect(() => {
    getProposal();
  }, []);

  useEffect(() => {
    if (voteRes?.status === "idle") setVoteOpen(false);
  }, [voteRes?.status]);

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
    <>
      <Paper elevation={0}>
        {proposalInfo?.status === "pending" ? <CircularProgress /> : null}
        {proposalInfo?.status === "idle" && !proposal ? (
          <AlertMsg type="error" text="Proposal not found" />
        ) : null}
      </Paper>
      {voteOpen ? (
        <DailogVote
          proposalId={proposal?.id}
          voteRes={voteRes}
          selectedValue={"yes here"}
          onClose={onVoteDailogClose}
          onConfirm={onConfirm}
          open={voteOpen}
        />
      ) : null}
      <Box sx={{ p: 3 }} component="div">
        {proposalInfo?.status === "idle" && proposal ? (
          <>
            <Grid container>
              <Grid
                item
                md={6}
                xs={6}
                sx={{
                  textAlign: "left",
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={500}>
                  #{proposal?.id}
                </Typography>
              </Grid>
              <Grid
                item
                md={6}
                xs={6}
                sx={{
                  textAlign: "right",
                }}
              >
                {parseProposalStatus(proposal.status)}
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography
                  gutterBottom
                  textAlign={"left"}
                  variant="body1"
                  fontWeight={500}
                >
                  {proposal?.metadata || "-"}
                </Typography>
              </Grid>
              <Grid
                item
                md={12}
                sx={{
                  textAlign: "right",
                  mb: 1,
                }}
              >
                {proposal?.status === "PROPOSAL_STATUS_SUBMITTED" ? (
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      textTransform: "none",
                    }}
                    onClick={() => setVoteOpen(true)}
                  >
                    Vote
                  </Button>
                ) : null}

                {proposal?.status === "PROPOSAL_STATUS_ACCEPTED" ? (
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      textTransform: "none",
                    }}
                    onClick={() => onExecute(proposal?.id)}
                  >
                    Execute
                  </Button>
                ) : null}
              </Grid>
              <Grid item md={4} xs={12}>
                <Typography
                  textAlign={"left"}
                  variant="body1"
                  color="text.secondary"
                >
                  Created At
                </Typography>
                <Typography
                  textAlign={"left"}
                  fontWeight={500}
                  variant="body1"
                  gutterBottom
                >
                  {getLocalTime(proposal?.submit_time)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography
                  textAlign={"left"}
                  variant="body1"
                  color="text.secondary"
                >
                  Voting Ends
                </Typography>
                <Typography
                  textAlign={"left"}
                  fontWeight={500}
                  variant="body1"
                  gutterBottom
                >
                  {getLocalTime(proposal?.voting_period_end)}
                </Typography>
              </Grid>

              <Grid item md={4} xs={12}>
                <Typography
                  textAlign={"left"}
                  variant="body1"
                  color="text.secondary"
                >
                  Policy Address
                </Typography>
                <Typography
                  textAlign={"left"}
                  fontWeight={500}
                  variant="body1"
                  gutterBottom
                >
                  <Chip
                    label={shortenAddress(proposal?.group_policy_address, 21)}
                    size="small"
                    deleteIcon={<ContentCopyOutlined />}
                    onDelete={() => {
                      copyToClipboard(proposal?.group_policy_address, dispatch);
                    }}
                  />
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  textAlign={"left"}
                  variant="body1"
                  color="text.secondary"
                  gutterBottom
                >
                  Proposers
                </Typography>
                <Box
                  sx={{
                    textAlign: "left",
                  }}
                >
                  {proposal?.proposers?.map((p, index) => (
                      <Chip
                        label={shortenAddress(p, 21)}
                        size="small"
                        deleteIcon={<ContentCopyOutlined />}
                        onDelete={() => {
                          copyToClipboard(p, dispatch);
                        }}
                        sx={{
                          mr: 1,
                        }}
                      />
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Paper sx={{ mt: 3, p: 2 }} variant="outlined">
              <Typography
                sx={{ float: "left" }}
                variant="body1"
                fontWeight={600}
              >
                Vote Details
              </Typography>
              <Grid spacing={2} columnSpacing={{ md: 4, xs: 2 }} container>
                <Grid item md={2} xs={6}>
                  <Paper sx={{ p: 1, borderColor: "blue" }} variant="outlined">
                    <Typography color={"primary"} variant="subtitle1">
                      Yes
                    </Typography>
                    <Typography
                      color={"primary"}
                      fontWeight={"bold"}
                      variant="subtitle1"
                    >
                      {proposal?.final_tally_result?.yes_count || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item md={2} xs={6}>
                  <Paper sx={{ p: 1, borderColor: "red" }} variant="outlined">
                    <Typography color={"error"} variant="subtitle1">
                      No
                    </Typography>
                    <Typography
                      color={"error"}
                      fontWeight={"bold"}
                      variant="subtitle1"
                    >
                      {proposal?.final_tally_result?.no_count || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item md={2} xs={6}>
                  <Paper
                    sx={{ p: 1, borderColor: "orange" }}
                    variant="outlined"
                  >
                    <Typography color={"orange"} variant="subtitle1">
                      Abstain
                    </Typography>
                    <Typography
                      color={"orange"}
                      fontWeight={"bold"}
                      variant="subtitle1"
                    >
                      {proposal?.final_tally_result?.abstain_count || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item md={2} xs={6}>
                  <Paper sx={{ p: 1, borderColor: "black" }} variant="outlined">
                    <Typography>Veto</Typography>
                    <Typography
                      color={"black"}
                      fontWeight={"bold"}
                      variant="subtitle1"
                    >
                      {proposal?.final_tally_result?.no_with_veto_account || 0}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>

            <Box
              sx={{
                mt: 3,
              }}
            >
              <Typography
                textAlign={"left"}
                gutterBottom
                variant="h6"
                fontWeight={600}
              >
                Messages
              </Typography>

              {proposal?.messages?.map((p) => (
                <Box sx={{ mt: 1 }}>
                  <Card sx={{ p: 2 }} elevation={0}>
                    {p["@type"] === "/cosmos.bank.v1beta1.MsgSend" ? (
                      <>
                        <Typography sx={{ textAlign: "left" }}>
                          <strong>Send</strong> &nbsp;
                          {p?.amount?.[0]?.amount} &nbsp;
                          {p?.amount?.[0]?.denom} &nbsp;
                          <strong> to </strong> &nbsp;
                          {p?.to_address}
                        </Typography>
                      </>
                    ) : null}
                    {p["@type"] === "/cosmos.staking.v1beta1.MsgDelegate" ? (
                      <>
                        <Typography sx={{ fontSize: 18, textAlign: "left" }}>
                          <strong>Delegate</strong> &nbsp;
                          {p?.amount?.amount} &?.[0]nbsp;
                          {p?.amount?.denom} &nbsp;
                          <strong> to </strong> &nbsp;
                          {p?.validator_address}
                        </Typography>
                      </>
                    ) : null}
                  </Card>
                </Box>
              ))}
            </Box>
          </>
        ) : null}
      </Box>
    </>
  );
};

function Proposal() {
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const wallet = useSelector((state) => state.wallet);
  const voteRes = useSelector((state) => state.group?.voteRes);

  const fetchVotes = (baseURL, id, limit, key) => {
    dispatch(
      getVotesProposalById({
        baseURL: baseURL,
        id: id,
        pagination: { limit: limit, key: key },
      })
    );
  };

  useEffect(() => {
    if (voteRes?.status === "idle")
      fetchVotes(wallet?.chainInfo?.config?.rest, id, limit, "");
  }, [voteRes?.status]);

  useEffect(() => {
    fetchVotes(wallet?.chainInfo?.config?.rest, id, limit, "");
  }, []);

  const handleMembersPagination = (number, limit, key) => {
    setLimit(limit);
    setPageNumber(number);
    fetchVotes(wallet?.chainInfo?.config?.rest, id, limit, key);
  };

  const groupInfo = useSelector((state) => state.group.proposalVotes);
  const { data, status } = groupInfo;

  useEffect(() => {
    if (Number(data?.pagination?.total))
      setTotal(Number(data?.pagination?.total || 0));
  }, [data]);

  return (
    <Box>
      <Box>
        <Paper>
          <Box>
            <ProposalInfo id={id} wallet={wallet} />
          </Box>
        </Paper>
      </Box>

      <Box sx={{ mt: 2 }}>
          {status === "pending" ? <CircularProgress /> : null}

          {status !== "pending" ? (
            <VotesTable
              total={total}
              limit={limit}
              pageNumber={pageNumber}
              handleMembersPagination={handleMembersPagination}
              rows={data}
            />
          ) : null}
      </Box>
    </Box>
  );
}

export default Proposal;
