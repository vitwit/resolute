import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { getProposalComponent } from "./../utils/util";

export default function ProposalInfo() {
  return (
    <>
      <Paper
        sx={{
          borderRadius: 0,
          p: 2,
          m: 2,
          textAlign: "left",
        }}
        elevation={0}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" color="text.primary" gutterBottom>
            #100
          </Typography>
          {getProposalComponent("PROPOSAL_STATUS_VOTING_PERIOD")}
        </div>
        <Typography
          variant="body1"
          color="text.primary"
          fontWeight={500}
          gutterBottom
        >
          #75 Establishing a definition of NoWithVeto
        </Typography>

        <Grid container
          sx={{
            mt: 1,
            mb: 1,
          }}
        >
          <Grid item xs={6} md={4}>
            <Typography gutterBottom color="text.secondary" variant="body1">
              Submitted Time
            </Typography>
            <Typography gutterBottom color="text.primary" variant="body1">
              2022-08-25 06:53
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography gutterBottom color="text.secondary" variant="body1">
              Type
            </Typography>
            <Typography gutterBottom color="text.primary" variant="body1">
              TextProposal
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography gutterBottom color="text.secondary" variant="body1">
              Total Deposit
            </Typography>
            <Typography gutterBottom color="text.primary" variant="body1">
              1000STAKE
            </Typography>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography gutterBottom color="text.secondary" variant="body1">
              Voting Start Time
            </Typography>
            <Typography gutterBottom color="text.primary" variant="body1">
              2022-08-25 06:53
            </Typography>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography gutterBottom color="text.secondary" variant="body1">
              Voting End Time
            </Typography>
            <Typography gutterBottom color="text.primary" variant="body1">
              2022-08-25 06:53
            </Typography>
          </Grid>
        </Grid>
        <Typography
          color="text.primary"
          variant="body1"
          fontWeight={500}
        >
          Proposal Details
        </Typography>
        <pre>
        This proposal aims to come to consensus that we should delete the blocked.go 
        file in the Osmosis Github Repository (https://github.com/osmosis-labs/osmosis/blob/main/app/blocked.go).
         My name is Anthony Rosa, and I am the project lead at Moultrie Audits. Centralized entities like Tether are holding 
         firm to protect censorship resistance (https://twitter.com/Tether_to/status/1562468486886346753?s=20&t=R3Gc5J6rUnSfOzeYxNZyuw). There are many aspects to this conversation, and it is encouraged to read through the associated commonwealth threads (linked below) prior to voting. The blocked.go file prevents users from withdrawing to the contained blocked addresses, and the file comments state “we block all OFAC-blocked ETH addresses from receiving tokens.” If we accept as a community that we should censor addresses the government deems illegitimate, our entire purpose becomes questionable.
        </pre>
      </Paper>
    </>
  );
}
