import React, { useEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { getProposalComponent } from "./../utils/util";
import { getLocalTime } from "./../utils/datetime";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProposal } from "../features/gov/govSlice";
import { parseBalance } from "../utils/denom";
import { setError } from "../features/common/commonSlice";

export default function ProposalInfo() {
  const { id } = useParams();
  const proposalState = useSelector((state) => state.gov.proposalInfo);
  const dispatch = useDispatch();
  const { proposalInfo } = proposalState;

  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  useEffect(() => {
    dispatch(
      getProposal({
        baseURL: chainInfo.config.rest,
        proposalId: id,
      })
    );
    return () => {};
  }, []);

  useEffect(() => {
    if (proposalState.status === "rejected" && proposalState.error.length > 0) {
      dispatch(
        setError({
          type: "error",
          message: proposalState.error,
        })
      );
    }
  }, [proposalState]);

  return (
    <>
      {proposalState.status === "idle" ? (
        <>
          <Typography
            gutterBottom
            sx={{
              textAlign: "left",
              pl: 2,
              mt: 1,
              mb: 1,
            }}
            color="text.primary"
            variant="h6"
            fontWeight={500}
          >
            Proposal Details
          </Typography>
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
                #{id}
              </Typography>
              {getProposalComponent(proposalInfo?.status)}
            </div>
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={500}
              gutterBottom
            >
              {proposalInfo?.content?.title}
            </Typography>

            <Grid
              container
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
                  {proposalInfo?.total_deposit?.length > 0
                    ? parseBalance(proposalInfo?.total_deposit, 6, "stake")
                    : "-"}
                </Typography>
              </Grid>

              <Grid item xs={6} md={4}>
                <Typography gutterBottom color="text.secondary" variant="body1">
                  Voting Start Time
                </Typography>
                <Typography gutterBottom color="text.primary" variant="body1">
                  {getLocalTime(proposalInfo?.voting_start_time)}
                </Typography>
              </Grid>

              <Grid item xs={6} md={4}>
                <Typography gutterBottom color="text.secondary" variant="body1">
                  Voting End Time
                </Typography>
                <Typography gutterBottom color="text.primary" variant="body1">
                  {getLocalTime(proposalInfo?.voting_end_time)}
                </Typography>
              </Grid>
            </Grid>
            <Typography
              color="text.primary"
              variant="body1"
              fontWeight={500}
              gutterBottom
            >
              Proposal Details
            </Typography>
            <div
              dangerouslySetInnerHTML={{
                __html: parseDescription(
                  `${proposalInfo?.content?.description}`
                ),
              }}
            />
          </Paper>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

const parseDescription = (description) =>
  description.replace(/(\r\n|\r|\n)/g, "<br />");
