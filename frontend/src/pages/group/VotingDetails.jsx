import React, { useState, useEffect } from "react";
import { Paper, Typography, Grid, Tooltip, Box } from "@mui/material";
import { parseProposalStatus } from "../../components/group/ProposalCard";

function countVotes(votes) {
  const votesCount = { yes: 0, no: 0, abstain: 0, veto: 0 };
  for (let index = 0; index < votes?.length; index++) {
    switch (votes[index]?.option) {
      case "VOTE_OPTION_NO":
        votesCount.yes = votesCount["yes"] + 1;
        break;
      case "VOTE_OPTION_YES":
        votesCount.no += 1;
        break;
      case "VOTE_OPTION_ABSTAIN":
        votesCount.abstain += 1;
        break;
      case "VOTE_OPTION_NO_WITH_VETO":
        votesCount.veto += 1;
        break;
    }
  }
  return votesCount;
}

const VotingDetailsAfterVotingPeriod = (props) => {
  const { proposal } = props;
  const {yes_count, no_count, no_with_veto_count, abstain_count} = proposal?.final_tally_result;
  const tallySum = Number(yes_count) + Number(no_count) + Number(no_with_veto_count) + Number(abstain_count);

  const tallySumInfo = {
    yes: (yes_count/tallySum) * 100,
    no: (no_count/tallySum) * 100,
    no_with_veto: (no_with_veto_count/tallySum) * 100,
    abstain: (abstain_count/tallySum) * 100, 
  }

  return (
    <>
      <Paper sx={{ mt: 3, p: 2 }} variant="outlined">
        <Typography
          sx={{ textAlign: "left", mb: 4 }}
          variant="body1"
          fontWeight={600}
        >
          Final Status : {parseProposalStatus(proposal?.status)}
        </Typography>
        <Box
          sx={{
            mt: 1,
            overflow: "hidden",
            borderRadius: 10,
          }}
          style={{
            display: "flex",
          }}
        >
          <Tooltip title={`Yes ${tallySumInfo?.yes}%`} placement="top">
            <Box
              sx={{
                width: `${tallySumInfo?.yes}%`,
                backgroundColor: "#5FD68B",
                height: "14px",
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            ></Box>
          </Tooltip>
          <Tooltip title={`No ${tallySumInfo?.no}%`} placement="top">
            <Box
              sx={{
                width: `${tallySumInfo?.no}%`,
                backgroundColor: "#EE6767",
                height: "14px",
              }}
            ></Box>
          </Tooltip>
          <Tooltip title={`Veto ${tallySumInfo?.no_with_veto}%`} placement="top">
            <Box
              sx={{
                width: `${tallySumInfo?.no_with_veto}%`,
                backgroundColor: "#FF9999",
                height: "14px",
              }}
            ></Box>
          </Tooltip>
          <Tooltip title={`Abstain ${tallySumInfo?.abstain}%`} placement="top">
            <Box
              sx={{
                width: `${tallySumInfo?.abstain}%`,
                backgroundColor: "#9FA4AD",
                height: "14px",
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}
            ></Box>
          </Tooltip>
        </Box>
        <Grid container sx={{ mt: 2 }}>
          <Grid item md={3}>
            <Box sx={{display: "flex"}}>
              <Box
                sx={{
                  width: "4px",
                  backgroundColor: "#5FD68B",
                  height: "48px",
                  marginRight: "15px",
                }}
              ></Box>
              <Box sx={{textAlign: "left"}}>
                <Typography fontWeight={500}>Yes</Typography>
                <Typography fontWeight={500}>{tallySumInfo?.yes}%</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item md={3}>
            <Box sx={{display: "flex"}}>
              <Box
                sx={{
                  width: "4px",
                  backgroundColor: "#EE6767",
                  height: "48px",
                  marginRight: "15px",
                }}
              ></Box>
              <Box sx={{textAlign: "left"}}>
                <Typography fontWeight={500}>No</Typography>
                <Typography fontWeight={500}>{tallySumInfo?.no}%</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item md={3}>
            <Box sx={{display: "flex"}}>
              <Box
                sx={{
                  width: "4px",
                  backgroundColor: "#FF9999",
                  height: "48px",
                  marginRight: "15px",
                }}
              ></Box>
              <Box sx={{textAlign: "left"}}>
                <Typography fontWeight={500}>NoWithVeto</Typography>
                <Typography fontWeight={500}>{tallySumInfo?.no_with_veto}%</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item md={3}>
            <Box sx={{display: "flex"}}>
              <Box
                sx={{
                  width: "4px",
                  backgroundColor: "#9FA4AD",
                  height: "48px",
                  marginRight: "15px",
                }}
              ></Box>
              <Box sx={{textAlign: "left"}}>
                <Typography fontWeight={500}>Abstain</Typography>
                <Typography fontWeight={500}>{tallySumInfo?.abstain}%</Typography>
              </Box>
            </Box>
          </Grid>

        </Grid>
      </Paper>
    </>
  );
};

function VotingDetails(props) {
  const { rows, proposal } = props;
  const votesCount = countVotes(rows.votes);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if (proposal?.status === "PROPOSAL_STATUS_SUBMITTED") {
      setIsActive(true);
    }
  }, [proposal]);
  console.log("proposal...", proposal);
  return (
    <div>
      <VotingDetailsAfterVotingPeriod proposal={proposal} />
      <Paper sx={{ mt: 3, p: 2 }} variant="outlined">
        <Typography sx={{ float: "left" }} variant="body1" fontWeight={600}>
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
                {isActive
                  ? votesCount?.yes
                  : proposal?.final_tally_result?.yes_count || 0}
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
                {isActive
                  ? votesCount?.no
                  : proposal?.final_tally_result?.no_count || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item md={2} xs={6}>
            <Paper sx={{ p: 1, borderColor: "orange" }} variant="outlined">
              <Typography color={"orange"} variant="subtitle1">
                Abstain
              </Typography>
              <Typography
                color={"orange"}
                fontWeight={"bold"}
                variant="subtitle1"
              >
                {isActive
                  ? votesCount?.abstain
                  : proposal?.final_tally_result?.abstain_count || 0}
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
                {isActive
                  ? votesCount?.veto
                  : proposal?.final_tally_result?.no_with_veto_count || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default VotingDetails;
