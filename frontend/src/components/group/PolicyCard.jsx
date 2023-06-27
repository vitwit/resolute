import * as React from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Chip, Grid, Paper } from "@mui/material";
import { setLocalStorage, shortenAddress } from "../../utils/util";
import { useNavigate, useParams } from "react-router-dom";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import { copyToClipboard } from "../../utils/clipboard";
import { useDispatch } from "react-redux";

const policyType = {
  "/cosmos.group.v1.ThresholdDecisionPolicy": "Threshold Policy",
  "/cosmos.group.v1.PercentageDecisionPolicy": "Percentage Policy",
};

export default function PolicyCard({ obj }) {
  const navigate = useNavigate();

  const {networkName} = useParams();

  const dispatch = useDispatch();

  const policyMetadata = JSON.parse(obj?.metadata)

  return (
    <Paper
      elevation={0}
      variant={"outlined"}
      onClick={() => {
        setLocalStorage("policy", obj, "object");
        navigate(`/${networkName}/daos/${obj?.group_id}/policies/${obj?.address}`);
      }}
      sx={{
        p: 1,
        borderRadius: 0,
        textAlign: "left",
        ":hover": { cursor: "pointer" },
      }}
    >
      <CardHeader
        title={policyMetadata.name || "-"}
        color="text.primary"
        sx={{
          fontWeight: 600,
        }}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item md={5} xs={6}>
            <Typography fontWeight={500} variant="body2" color="text.secondary">
              Address
            </Typography>
          </Grid>
          <Grid item xs={6} md={7}>
            <Chip
              label={shortenAddress(obj?.address, 21)}
              size="small"
              deleteIcon={<ContentCopyOutlined />}
              onDelete={() => {
                copyToClipboard(obj?.address, dispatch);
              }}
            />
          </Grid>
          <Grid item md={5} xs={6}>
            <Typography fontWeight={500} variant="body2" color="text.secondary">
              Type
            </Typography>
          </Grid>
          <Grid item xs={6} md={7}>
            <Typography variant="body1" fontWeight={500}>
              {policyType[obj?.decision_policy["@type"]] || "-"}
            </Typography>
          </Grid>
          {obj?.decision_policy["@type"] ===
          "/cosmos.group.v1.ThresholdDecisionPolicy" ? (
            <>
              <Grid item md={5} xs={6}>
                <Typography
                  fontWeight={500}
                  variant="body2"
                  color="text.secondary"
                >
                  Threshold
                </Typography>
              </Grid>
              <Grid item xs={6} md={7}>
                <Typography variant="body1" fontWeight={500}>
                  {obj?.decision_policy?.threshold || "-"}
                </Typography>
              </Grid>
            </>
          ) : (
            <>
              <Grid item md={7} xs={6}>
                <Typography
                  fontWeight={500}
                  variant="body2"
                  color="text.secondary"
                >
                  Percentage
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                >
                  {`${obj?.decision_policy?.percentage} %` || "-"}
                </Typography>
              </Grid>
            </>
          )}

          <Grid item md={5} xs={6}>
            <Typography fontWeight={500} variant="body2" color="text.secondary">
              Min Exec Period
            </Typography>
          </Grid>
          <Grid item md={7} xs={6}>
            <Typography variant="body1" color="text.primary" fontWeight={500}>
              {parseFloat(
                obj?.decision_policy?.windows?.min_execution_period || 0
              ).toFixed(2) || "-"}
            </Typography>
          </Grid>

          <Grid item md={5} xs={6}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Min Voting Period
            </Typography>
          </Grid>
          <Grid item md={7} xs={6}>
            <Typography variant="body1" color="text.primary" fontWeight={500}>
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
