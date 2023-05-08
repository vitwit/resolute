import React, { useState, useEffect } from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { computeVotePercentage, getProposalComponent } from "../../utils/util";
import { getDaysLeft } from "../../utils/datetime";
import "./../common.css";
import govService from "../../features/gov/govService";
import { useSelector, useDispatch } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import { setError } from "../../features/common/commonSlice";

export const ProposalItem = (props) => {
  const { info, vote, poolInfo, onItemClick, chainUrl, proposalId } = props;
  const [pTally, setPTally] = useState([]);
  const tally = pTally;
  const tallyInfo = computeVotePercentage(tally, poolInfo);
  const { yes, no, no_with_veto, abstain } = tallyInfo;
  const tallySum =
    Number(yes) + Number(no) + Number(no_with_veto) + Number(abstain);
  const dispatch = useDispatch();

  const tallySumInfo = {
    yes: (tallyInfo.yes / tallySum) * 100,
    no: (tallyInfo.no / tallySum) * 100,
    no_with_veto: (tallyInfo.no_with_veto / tallySum) * 100,
    abstain: (tallyInfo.abstain / tallySum) * 100,
  };
  const onVoteClick = () => {
    props.setOpen(info?.proposal_id);
  };

  useEffect(() => {
    const response = async (chainUrl) => {
      try {
        const res = await govService.tally(chainUrl, proposalId);
        return res.data;
      } catch (error) {
        dispatch(
          setError({
            type: "error",
            message: "some error occurred",
          })
        );
      }
    };
    response(chainUrl).then((res) => {
      if (res.tally) {
        setPTally(res.tally);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <CardContent>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
          onClick={() => onItemClick()}
        >
          <Typography
            sx={{ fontSize: 16, fontWeight: "700", cursor: "pointer" }}
            color="text.primary"
            gutterBottom
          >
            #{info.proposal_id}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            color="text.primary"
            className="proposal-title"
            onClick={() => onItemClick()}
            sx={{ cursor: "pointer", marginLeft: "8px", fontWeight:"500" }}
          >
            {info.content?.title || info.content?.["@type"]}
          </Typography>
        </div>

        <ul
          style={{
            listStyleType: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            paddingInlineStart: 0,
          }}
        >
          <li>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1">Voting ends in &nbsp;</Typography>
              <Typography variant="body2">
                {getDaysLeft(info?.voting_end_time)} days
              </Typography>
            </div>
          </li>
        </ul>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Tooltip title={`${tallyInfo.yes}%`} placement="top">
            <Box
              sx={{
                width: `${tallySumInfo.yes}%`,
                margin: "0 0.5px",
                backgroundColor: "#18a572",
                height: "3px",
              }}
            ></Box>
          </Tooltip>
          <Tooltip title={`${tallyInfo.no}%`} placement="top">
            <Box
              sx={{
                width: `${tallySumInfo.no}%`,
                margin: "0 0.5px",
                backgroundColor: "#ce4256",
                height: "3px",
              }}
            ></Box>
          </Tooltip>
          <Tooltip title={`${tallyInfo.no_with_veto}%`} placement="top">
            <Box
              sx={{
                width: `${tallySumInfo.no_with_veto}%`,
                margin: "0 0.5px",
                backgroundColor: "#ce4256",
                height: "3px",
              }}
            ></Box>
          </Tooltip>
          <Tooltip title={`${tallyInfo.abstain}%`} placement="top">
            <Box
              sx={{
                width: `${tallySumInfo.abstain}%`,
                margin: "0 0.5px",
                backgroundColor: "primary.main",
                height: "3px",
              }}
            ></Box>
          </Tooltip>
        </div>
      </CardContent>
      <CardActions style={{ display: "flex", justifyContent: "space-between" }}>
        {vote?.proposal_id ? (
          <Typography variant="body2" color="text.primary">
            You voted {formatVoteOption(vote?.option)}
          </Typography>
        ) : (
          <>&nbsp;</>
        )}
        <Button
          size="small"
          variant="contained"
          disableElevation
          onClick={onVoteClick}
        >
          Vote
        </Button>
      </CardActions>
    </React.Fragment>
  );
};
function formatVoteOption(option) {
  switch (option) {
    case "VOTE_OPTION_YES":
      return "Yes";
    case "VOTE_OPTION_NO":
      return "No";
    case "VOTE_OPTION_ABSTAIN":
      return "Abstain";
    case "VOTE_OPTION_NO_WITH_VETO":
      return "NoWithVeto";
    default:
      return "";
  }
}
