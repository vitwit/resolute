import { Paper, Typography } from "@mui/material";
import React from "react";

export default function ProposalInfo() {
  return (
    <>
      <Paper
        sx={{
          borderRadius: 0,
          p: 2,
          m: 2,
        }}
        elevation={0}
      >
        <Typography variant="h6" color="text.primary" fontWeight={500}>
          #75 Establishing a definition of NoWithVeto
        </Typography>
      </Paper>
    </>
  );
}
