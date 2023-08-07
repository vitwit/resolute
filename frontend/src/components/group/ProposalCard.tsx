import React from "react";
import { Chip, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getJustDate } from "../../utils/datetime";
import { shortenAddress } from "../../utils/util";

interface ProposalCardProps {
  proposal: any;
  networkName: string;
  groupID: Number;
}

function ProposalCard({
  proposal,
  networkName,
  groupID,
}: ProposalCardProps): JSX.Element {
  const navigate = useNavigate();

  let proposalMetadata: any = proposal?.metadata;
  try {
    proposalMetadata = JSON.parse(proposal?.metadata);
  } catch (e) {
    console.warn(e);
  }

  return (
    <Paper
      onClick={() => {
        navigate(`/${networkName}/groups/groups/${groupID}/proposals/${proposal?.id}`);
      }}
      sx={{
        p: 2,
        textAlign: "left",
        ":hover": { cursor: "pointer" },
      }}
      variant="outlined"
      elevation={0}
    >
      <Typography
        variant="h6"
        color="text.primary"
        sx={{
          textAlign: "center",
        }}
      >
        #{proposal?.id}&nbsp;{proposalMetadata?.title || proposalMetadata}
      </Typography>
      {proposalMetadata?.summary ? (
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
          sx={{
            textAlign: "center",
          }}
          style={{ wordWrap: "break-word", lineClamp: 2 }}
        >
          {proposalMetadata?.summary}
        </Typography>
      ) : null}

      <Grid
        container
        spacing={2}
        sx={{
          mt: 1,
        }}
      >
        <Grid item xs={6} md={6}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Status
          </Typography>
          {parseProposalStatus(proposal.status)}
        </Grid>
        <Grid item xs={6} md={6}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Policy Address
          </Typography>
          <Typography fontWeight={500} variant="body1">
            {shortenAddress(proposal?.group_policy_address, 21)}
          </Typography>
        </Grid>
        <Grid item xs={6} md={6}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Submit Time
          </Typography>
          <Typography fontWeight={500} variant="body1">
            {getJustDate(proposal?.submit_time)}
          </Typography>
        </Grid>
        <Grid item xs={6} md={6}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Voting End
          </Typography>
          <Typography fontWeight={500} variant="body1">
            {getJustDate(proposal?.voting_period_end)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Proposers
          </Typography>
          {proposal?.proposers?.map((p: string) => (
            <Typography fontWeight={500} variant="body1">
              {p && shortenAddress(p, 21)}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProposalCard;

export const parseProposalStatus = (status: string): JSX.Element => {
  switch (status) {
    case "PROPOSAL_STATUS_SUBMITTED": {
      return (
        <Chip variant="outlined" size="small" color="info" label="Submitted" />
      );
    }

    case "PROPOSAL_STATUS_UNSPECIFIED": {
      return (
        <Chip variant="outlined" size="small" color="error" label="Unknown" />
      );
    }
    case "PROPOSAL_STATUS_ABORTED": {
      return (
        <Chip variant="outlined" color="error" size="small" label="Aborted" />
      );
    }
    case "PROPOSAL_STATUS_ACCEPTED": {
      return (
        <Chip
          size="small"
          variant="outlined"
          color="success"
          label="Accepted"
        />
      );
    }
    case "PROPOSAL_STATUS_REJECTED": {
      return (
        <Chip variant="outlined" color="error" size="small" label="Rejected" />
      );
    }
    case "PROPOSAL_STATUS_WITHDRAWN": {
      return (
        <Chip variant="outlined" color="info" size="small" label="Withdrawn" />
      );
    }
    default: {
      return (
        <Chip variant="outlined" color="error" size="small" label="Unknown" />
      );
    }
  }
};
