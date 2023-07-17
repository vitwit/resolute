import React from "react";
import { Paper, Typography, Grid } from "@mui/material";

function VotingDetails(props) {
  const {rows, total, proposal} = props;
  
  return (
    <div>
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
            <Paper sx={{ p: 1, borderColor: "orange" }} variant="outlined">
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
    </div>
  );
}

export default VotingDetails;
