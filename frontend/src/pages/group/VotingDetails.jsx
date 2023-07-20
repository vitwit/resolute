import React, { useState, useEffect } from "react";
import { Paper, Typography, Grid, Tooltip, Box } from "@mui/material";
import { parseProposalStatus } from "../../components/group/ProposalCard";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function countVotes(votes) {
  const votesCount = {
    yes_count: 0,
    no_count: 0,
    abstain_count: 0,
    no_with_veto_count: 0,
  };
  for (let index = 0; index < votes?.length; index++) {
    switch (votes[index]?.option) {
      case "VOTE_OPTION_YES":
        votesCount.yes_count += 1;
        break;
      case "VOTE_OPTION_NO":
        votesCount.no_count += 1;
        break;
      case "VOTE_OPTION_ABSTAIN":
        votesCount.abstain_count += 1;
        break;
      case "VOTE_OPTION_NO_WITH_VETO":
        votesCount.no_with_veto_count += 1;
        break;
    }
  }
  return votesCount;
}

const VotingPercentageBar = (props) => {
  const { proposal, votesCount, isActive } = props;

  const { yes_count, no_count, no_with_veto_count, abstain_count } = isActive
    ? votesCount
    : proposal?.final_tally_result;
  const tallySum =
    Number(yes_count) +
    Number(no_count) +
    Number(no_with_veto_count) +
    Number(abstain_count);
  const tallySumInfo = {
    yes: tallySum > 0 ? (yes_count / tallySum) * 100 : 0,
    no: tallySum > 0 ? (no_count / tallySum) * 100 : 0,
    no_with_veto: tallySum > 0 ? (no_with_veto_count / tallySum) * 100 : 0,
    abstain: tallySum > 0 ? (abstain_count / tallySum) * 100 : 0,
  };

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
          <Tooltip
            title={`Veto ${tallySumInfo?.no_with_veto}%`}
            placement="top"
          >
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
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  width: "4px",
                  backgroundColor: "#5FD68B",
                  height: "48px",
                  marginRight: "15px",
                }}
              ></Box>
              <Box sx={{ textAlign: "left" }}>
                <Typography fontWeight={500}>Yes</Typography>
                <Typography fontWeight={500}>{tallySumInfo?.yes}%</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item md={3}>
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  width: "4px",
                  backgroundColor: "#EE6767",
                  height: "48px",
                  marginRight: "15px",
                }}
              ></Box>
              <Box sx={{ textAlign: "left" }}>
                <Typography fontWeight={500}>No</Typography>
                <Typography fontWeight={500}>{tallySumInfo?.no}%</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item md={3}>
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  width: "4px",
                  backgroundColor: "#FF9999",
                  height: "48px",
                  marginRight: "15px",
                }}
              ></Box>
              <Box sx={{ textAlign: "left" }}>
                <Typography fontWeight={500}>NoWithVeto</Typography>
                <Typography fontWeight={500}>
                  {tallySumInfo?.no_with_veto}%
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item md={3}>
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  width: "4px",
                  backgroundColor: "#9FA4AD",
                  height: "48px",
                  marginRight: "15px",
                }}
              ></Box>
              <Box sx={{ textAlign: "left" }}>
                <Typography fontWeight={500}>Abstain</Typography>
                <Typography fontWeight={500}>
                  {tallySumInfo?.abstain}%
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

VotingPercentageBar.propTypes = {
  proposal: PropTypes.object.isRequired,
  votesCount: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired
}

function VotingDetails(props) {
  const { rows, proposal } = props;
  const votesCount = countVotes(rows.votes);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if (
      proposal?.status === "PROPOSAL_STATUS_SUBMITTED" ||
      proposal?.status === "PROPOSAL_STATUS_ABORTED"
    ) {
      setIsActive(true);
    }
  }, [proposal]);
  return (
    <div>
      <VotingPercentageBar
        proposal={proposal}
        votesCount={votesCount}
        isActive={isActive}
      />
    </div>
  );
}

export default VotingDetails;

VotingDetails.propTypes = {
  rows: PropTypes.object.isRequired,
  proposal: PropTypes.object.isRequired
}
