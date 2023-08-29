import {
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import VotesTable from "../../components/group/VotesTable";
import {
  getGroupMembersById,
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
import VotingDetails from "./VotingDetails";
import { setActiveTab } from "../../features/common/commonSlice";

const ProposalInfo = ({ id, wallet, address, chainID, chainInfo }) => {
  const [voteOpen, setVoteOpen] = useState(false);

  const dispatch = useDispatch();
  const proposalInfo = useSelector(
    (state) => state.group?.groupProposal?.[chainID]
  );
  const voteRes = useSelector((state) => state.group?.voteRes);

  const proposal = proposalInfo?.data?.proposal;
  const [total, setTotal] = useState(0);
  const groupInfo = useSelector(
    (state) => state.group?.proposalVotes?.[chainID]
  );
  const data = groupInfo?.data;

  useEffect(() => {
    if (Number(data?.pagination?.total))
      setTotal(Number(data?.pagination?.total || 0));
  }, [data]);

  const getProposal = () => {
    if (chainInfo?.config?.rest && chainID) {
      dispatch(
        getGroupProposalById({
          baseURL: chainInfo?.config?.rest,
          id,
          chainID: chainID,
        })
      );
    }
  };

  useEffect(() => {
    getProposal();
  }, [chainInfo]);

  useEffect(() => {
    if (voteRes?.status === "idle") setVoteOpen(false);
  }, [voteRes?.status]);

  const onVoteDailogClose = () => {
    setVoteOpen(false);
  };

  const onConfirm = (voteObj) => {
    dispatch(
      txGroupProposalVote({
        admin: address,
        voter: address,
        option: voteObj?.vote,
        proposalId: voteObj?.proposalId,
        metadata: JSON.stringify({
          justification: voteObj?.justification,
        }),
        chainId: chainInfo?.config?.chainId,
        rpc: chainInfo?.config?.rpc,
        denom: chainInfo?.config?.currencies?.[0]?.coinMinimalDenom,
        feeAmount: chainInfo?.config?.feeCurrencies?.[0]?.gasPriceStep?.average,
      })
    );
  };

  const onExecute = (proposalId) => {
    dispatch(
      txGroupProposalExecute({
        proposalId: proposalId,
        admin: address,
        executor: address,
        chainId: chainInfo?.config?.chainId,
        rpc: chainInfo?.config?.rpc,
        denom: chainInfo?.config?.currencies?.[0]?.coinMinimalDenom,
        feeAmount: chainInfo?.config?.feeCurrencies?.[0]?.gasPriceStep?.average,
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
                <Grid sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Grid item md={6} xs={12}>
                    {JSON.parse(proposal?.metadata)?.title ? (
                      <>
                        <Typography
                          variant="h5"
                          color="text.primary"
                          fontWeight={600}
                          sx={{
                            textAlign: "left",
                          }}
                          gutterBottom
                        >
                          {JSON.parse(proposal?.metadata)?.title || "-"}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          gutterBottom
                          sx={{
                            textAlign: "left",
                          }}
                        >
                          {JSON.parse(proposal?.metadata)?.summary || "-"}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography
                          variant="h5"
                          color="text.primary"
                          fontWeight={600}
                          sx={{
                            textAlign: "left",
                          }}
                          gutterBottom
                        >
                          {JSON.parse(proposal?.metadata)}
                        </Typography>
                      </>
                    )}
                  </Grid>
                  <Grid
                    item
                    md={6}
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
                </Grid>
              </Grid>
              <Grid item md={12} xs={12}>
                <Grid>
                  <Grid item md={6} xs={12}>
                    <Typography
                      textAlign={"left"}
                      variant="body1"
                      color="text.secondary"
                    >
                      Details
                    </Typography>
                    <Typography
                      textAlign={"left"}
                      fontWeight={500}
                      variant="body1"
                      gutterBottom
                    >
                      {JSON.parse(proposal?.metadata)?.details || "-"}
                    </Typography>
                  </Grid>
                  <Grid item md={4} xs={12}></Grid>
                </Grid>
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
                    label={
                      proposal?.group_policy_address
                        ? shortenAddress(proposal?.group_policy_address, 21)
                        : ""
                    }
                    size="small"
                    deleteIcon={<ContentCopyOutlined />}
                    onDelete={() => {
                      copyToClipboard(proposal?.group_policy_address, dispatch);
                    }}
                  />
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography
                  textAlign={"left"}
                  variant="body1"
                  color="text.secondary"
                  gutterBottom
                >
                  Forum
                </Typography>
                <Box
                  sx={{
                    textAlign: "left",
                  }}
                >
                  <Typography
                    variant="body1"
                    color="text.primary"
                    fontWeight={500}
                  >
                    <Link
                      href={JSON.parse(proposal?.metadata)?.forumurl || "#"}
                      target="_blank"
                    >
                      {JSON.parse(proposal?.metadata)?.forumurl || "-"}
                    </Link>
                  </Typography>
                </Box>
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

            <VotingDetails proposal={proposal} rows={data} />

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
                          {p?.amount?.amount} &nbsp;
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
  const { id, groupID } = params;
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const wallet = useSelector((state) => state.wallet);
  const voteRes = useSelector((state) => state.group?.voteRes);

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [currentNetwork, setCurrentNetwork] = useState(
    params?.networkName || selectedNetwork.toLowerCase()
  );
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToChainIDs[currentNetwork];
  const address = networks[chainID]?.walletInfo.bech32Address;
  const chainInfo = networks[chainID]?.network;

  const fetchVotes = (baseURL, id, limit, key) => {
    if (baseURL && chainID) {
      dispatch(
        getVotesProposalById({
          baseURL: baseURL,
          id: id,
          pagination: { limit: limit, key: key },
          chainID: chainID,
        })
      );
    }
  };

  useEffect(() => {
    if (voteRes?.status === "idle")
      fetchVotes(chainInfo?.config?.rest, id, limit, "");
  }, [voteRes?.status]);

  useEffect(() => {
    fetchVotes(chainInfo?.config?.rest, id, limit, "");
  }, [chainInfo]);

  const handleMembersPagination = (number, limit, key) => {
    setLimit(limit);
    setPageNumber(number);
    fetchVotes(chainInfo?.config?.rest, id, limit, key);
  };
  const groupInfo = useSelector(
    (state) => state.group?.proposalVotes?.[chainID]
  );
  const data = groupInfo?.data;
  const status = groupInfo?.status;

  useEffect(() => {
    if (Number(data?.pagination?.total))
      setTotal(Number(data?.pagination?.total || 0));
  }, [data]);

  const proposalInfo = useSelector(
    (state) => state.group?.groupProposal?.[chainID]
  );
  const proposal = proposalInfo?.data?.proposal;

  useEffect(() => {
    dispatch(
      getGroupMembersById({
        baseURL: chainInfo?.config?.rest,
        id: groupID,
        pagination: { limit: 100, key: "" },
        chainID: chainID,
      })
    );
    dispatch(setActiveTab("groups"));
  })

  return (
    <Box>
      <Box>
        <Paper>
          <Box>
            <ProposalInfo
              id={id}
              groupID={groupID}
              wallet={wallet}
              address={address}
              chainID={chainID}
              chainInfo={chainInfo}
            />
          </Box>
        </Paper>
      </Box>

      {proposal?.status === "PROPOSAL_STATUS_ACCEPTED" ||
      proposal?.status === "PROPOSAL_STATUS_REJECTED" ? null : (
        <Box sx={{ mt: 2 }}>
          {status === "pending" ? <CircularProgress /> : null}
          {status !== "pending" ? (
            <VotesTable
              total={total}
              limit={limit}
              pageNumber={pageNumber}
              handleMembersPagination={handleMembersPagination}
              rows={data}
              chainID={chainID}
            />
          ) : null}
        </Box>
      )}
    </Box>
  );
}

export default Proposal;
