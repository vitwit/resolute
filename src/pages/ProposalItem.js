import React from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { computeVotePercentage, getProposalComponent } from "../utils/util";
import "./common.css";
import { getLocalTime } from "../utils/datetime";

export const ProposalItem = (props) => {
  const { info, tally, vote } = props;
  const tallyInfo = computeVotePercentage(tally);

  const onVoteClick = () => {
    props.setOpen(info?.proposal_id);
  };

  return (
    <React.Fragment>
      <CardContent>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            #{info.proposal_id}
          </Typography>
          {getProposalComponent(info.status)}
        </div>
        <Typography
          variant="body1"
          component="div"
          color="text.primary"
          className="proposal-title"
        >
          {info.content?.title}
        </Typography>
        <Typography
          sx={{ mb: 1.5 }}
          variant="body2"
          color="text.secondary"
          className="proposal-description"
        >
          {info.content?.description}
        </Typography>
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
            <div style={{ display: "flex" }}>
              <Typography variant="body1">
                Voting start &nbsp;&nbsp;&nbsp;
              </Typography>
              <Typography variant="body2">
                {getLocalTime(info?.voting_start_time)}
              </Typography>
            </div>
          </li>
          <li>
            <div style={{ display: "flex" }}>
              <Typography variant="body1">
                Voting end&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Typography>
              <Typography variant="body2">
                {getLocalTime(info?.voting_end_time)}
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
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            YES <br />
            {tallyInfo.yes}%
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            NO <br />
            {tallyInfo.no}%
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            NoWithVeto
            <br />
            {tallyInfo.no_with_veto}%
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Abstain
            <br />
            {tallyInfo.abstain}%
          </Typography>
        </div>
        <br />
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
