import React from "react";
import Typography from "@mui/material/Typography";
import { Chip, Grid, Paper } from "@mui/material";
import { setLocalStorage, shortenAddress } from "../../utils/util";
import { useNavigate, useParams } from "react-router-dom";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import { copyToClipboard } from "../../utils/clipboard";
import { useDispatch } from "react-redux";
import moment from 'moment/moment';


export default function PolicyCard({ policyInfo, totalWeight }) {
  const navigate = useNavigate();

  const { networkName } = useParams();
  const policyMetadata = JSON.parse(policyInfo?.metadata)

  const dispatch = useDispatch();

  return (
    <Paper
      elevation={0}
      variant={"outlined"}
      onClick={() => {
        setLocalStorage("policy", policyInfo, "object");
        navigate(`/${networkName}/daos/${policyInfo?.group_id}/policies/${policyInfo?.address}`);
      }}
      sx={{
        p: 2,
        textAlign: "left",
        ":hover": { cursor: "pointer" },
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        color="text.primary"
        sx={{
          textAlign: "center"
        }}
      >
        {policyMetadata.name || policyMetadata}
      </Typography>
      {
        policyMetadata.description ?
          <Typography
            variant="body2"
            fontWeight={500}
            color="text.secondary"
            gutterBottom
            sx={{
              textAlign: "center"
            }}
          >
            {policyMetadata.description || policyMetadata}
          </Typography>
          :
          null
      }

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography
            color="text.secondary"
            variant="body2"
            fontWeight={600}
            gutterBottom
          >
            Address
          </Typography>
          <Chip
            label={shortenAddress(policyInfo?.address, 18)}
            size="small"
            deleteIcon={<ContentCopyOutlined />}
            onDelete={() => {
              copyToClipboard(policyInfo?.address, dispatch);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            color="text.secondary"
            variant="body2"
            fontWeight={600}
          >
            Quorum
          </Typography>

          {policyInfo?.decision_policy["@type"] ===
            "/cosmos.group.v1.ThresholdDecisionPolicy" ? (
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={600}
            >
              {`${parseInt((policyInfo?.decision_policy?.threshold)/totalWeight)*100.0}%` || "-"}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              color="text.primary"
              fontWeight={600}
            >
              {`${parseInt(policyInfo?.decision_policy?.percentage * 100)}%` || "-"}
            </Typography>
          )}

        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
          >
            Voting Period
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            fontWeight={600}
          >
            {
              moment.utc((parseInt(policyInfo?.decision_policy?.windows?.voting_period || 0)) * 1000).format('D')

            }&nbsp;days
          </Typography>

        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
          >
            Execution delay
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            fontWeight={600}
          >
            {
              moment.utc((parseInt(policyInfo?.decision_policy?.windows?.min_execution_period || 0)) * 1000).format('D')
            }&nbsp;days
          </Typography>

        </Grid>
      </Grid>
    </Paper>
  );
}
