import * as React from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid, Paper } from "@mui/material";
import { setLocalStorage, shortenAddress } from "../../utils/util";
import { useNavigate } from "react-router-dom";

const policyType = {
  "/cosmos.group.v1.ThresholdDecisionPolicy": "Threshold Policy",
  "/cosmos.group.v1.PercentageDecisionPolicy": "Percentage Policy",
};

export default function PolicyCard({ obj }) {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      variant={"outlined"}
      onClick={() => {
        setLocalStorage("policy", obj, "object");
        navigate(`/groups/${obj?.group_id}/policies/${obj?.address}`);
      }}
      sx={{
        p: 0.5,
        borderRadius: 0,
        textAlign: "left",
        ":hover": { cursor: "pointer" },
      }}
    >
      <CardHeader
        title={obj?.metadata || "-"}
        color="text.primary"
        sx={{
          fontWeight: 600,
        }}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item md={6} xs={6}>
            <Typography fontWeight={500} variant="body1" color="text.secondary">
              Address
            </Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography variant="body1">
              {shortenAddress(obj?.address, 21) || "-"}
            </Typography>
          </Grid>
          <Grid item md={6} xs={6}>
            <Typography fontWeight={500} variant="body1" color="text.secondary">
              Type
            </Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography variant="body1">
              {policyType[obj?.decision_policy["@type"]] || "-"}
            </Typography>
          </Grid>
          {obj?.decision_policy["@type"] ===
          "/cosmos.group.v1.ThresholdDecisionPolicy" ? (
            <>
              <Grid item md={6} xs={6}>
                <Typography
                  fontWeight={500}
                  variant="body1"
                  color="text.secondary"
                >
                  Threshold
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="body1">
                  {obj?.decision_policy?.threshold || "-"}
                </Typography>
              </Grid>
            </>
          ) : (
            <>
              <Grid item md={6} xs={6}>
                <Typography
                  fontWeight={500}
                  variant="body1"
                  color="text.secondary"
                >
                  Percentage
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {`${obj?.decision_policy?.percentage} %` || "-"}
                </Typography>
              </Grid>
            </>
          )}

          <Grid item md={6} xs={6}>
            <Typography fontWeight={500} variant="body1" color="text.secondary">
              Min Exec Period
            </Typography>
          </Grid>
          <Grid item md={6} xs={6}>
            <Typography variant="body1" color="text.primary">
              {parseFloat(
                obj?.decision_policy?.windows?.min_execution_period || 0
              ).toFixed(2) || "-"}
            </Typography>
          </Grid>

          <Grid item md={6} xs={6}>
            <Typography fontWeight={500} variant="body1" color="text.secondary">
              Min Voting Period
            </Typography>
          </Grid>
          <Grid item md={6} xs={6}>
            <Typography variant="body1" color="text.primary">
              {parseFloat(
                obj?.decision_policy?.windows?.voting_period || 0
              ).toFixed(2) || "-"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Paper>
  );
}
