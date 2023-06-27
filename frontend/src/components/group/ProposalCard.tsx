import { Avatar, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { teal } from "@mui/material/colors";
import { Box } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getLocalTime } from "../../utils/datetime";
import { shortenAddress } from "../../utils/util";

function stringAvatar(name: string) {
  return {
    sx: {
      color: "#000000",
      bgcolor: teal[100],
      fontSize: 16,
    },
    children: `${name}`,
  };
}

interface ProposalCardProps {
  proposal: any;
  networkName: string;
}

function ProposalCard({ proposal, networkName }: ProposalCardProps): JSX.Element {
  const yes = parseFloat(proposal?.final_tally_result?.yes_count);
  const no = parseFloat(proposal?.final_tally_result?.no_count);
  const abstain = parseFloat(proposal?.final_tally_result?.abstain_count);
  const veto = parseFloat(proposal?.final_tally_result?.no_with_veto_count);

  const sum = yes + no + abstain + veto;
  const yesP = (yes / sum).toFixed(2);
  const noP = (no / sum).toFixed(2);
  const abP = (abstain / sum).toFixed(2);
  const vetoP = (veto / sum).toFixed(2);

  const navigate = useNavigate();

  return (
    <Paper
      onClick={() => {
        navigate(`/${networkName}/daos/proposals/${proposal?.id}`);
      }}
      sx={{ p: 2, textAlign: "left" }}
      variant="outlined"
      elevation={0}
    >
      <Stack direction="row" mb={2} spacing={2}>
        <Avatar {...stringAvatar(proposal?.id)} />
        <Typography gutterBottom variant="h6" textAlign={"left"}>
          {proposal?.metadata || "-"}
        </Typography>
      </Stack>

      {parseProposalStatus(proposal.status)}

      <Grid
        container
        sx={{
          mt: 2,
          textAlign: "left",
        }}
        spacing={2}
      >
        <Grid item md={6} xs={6}>
          <Typography color="text.secondary" variant="subtitle2">
            Proposers
          </Typography>

          {proposal?.proposers?.map((p: string) => (
            <Typography fontWeight={500} variant="subtitle1">
              {p && shortenAddress(p, 21)}
            </Typography>
          ))}
        </Grid>
        <Grid item md={6} xs={6}>
          <Typography color="text.secondary" variant="subtitle2">
            Policy Address
          </Typography>
          <Typography fontWeight={500} variant="subtitle1">
            {proposal?.group_policy_address &&
              shortenAddress(proposal?.group_policy_address, 21)}
          </Typography>
        </Grid>
        <Grid item md={6} xs={6}>
          <Typography color="text.secondary" variant="subtitle2">
            Voting End Time
          </Typography>

          <Typography fontWeight={500} variant="subtitle1">
            {getLocalTime(proposal?.voting_period_end)}
          </Typography>
        </Grid>
        <Grid item md={6} xs={6}>
          <Typography color="text.secondary" variant="subtitle2">
            Created At
          </Typography>

          <Typography fontWeight={500} variant="subtitle1">
            {getLocalTime(proposal?.submit_time)}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", mt: 3 }}>
        <Box
          sx={{
            background: "blue",
            height: 3,
            width: sum ? `${yesP}%` : "100%",
          }}
        ></Box>
        <Box sx={{ background: "red", height: 3, width: `${noP}%` }}></Box>
        <Box sx={{ background: "organe", height: 3, width: `${abP}%` }}></Box>
        <Box sx={{ background: "yellow", height: 3, width: `${vetoP}` }}></Box>
      </Box>
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
