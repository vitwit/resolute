import React from "react";
import PropTypes from "prop-types";
import { Grid, Card, CardContent, Typography } from "@mui/material";

export const StakingTotal = (props) => {
  return (
    <Grid container
      sx={{
        mb: 1,
      }}
      spacing={1}
    >
      <Grid item xs={6} md={4}>
        <Card
          elevation={0}
        >
          <CardContent>
            <Typography
              align="left"
              variant="body2"
              fontWeight={500}
              color="text.secondary"
            >
              Total Staked Balance
            </Typography>
            <Typography
              align="left"
              variant="h6"
              color="text.primary"
            >
              ${props?.totalAmount?.toLocaleString(
                undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }
              )}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={4}>
        <Card
          elevation={0}
        >
          <CardContent>
            <Typography
              align="left"
              variant="body2"
              fontWeight={500}
              color="text.secondary"
            >Total Rewards</Typography>
            <Typography
              align="left"
              variant="h6"
              color="text.primary"
            >${props?.totalReward?.toLocaleString(
              undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
            )}</Typography>

          </CardContent>
        </Card>
      </Grid>
      {
        /* 
          TODO: add claim all networks rewards 
        */
      }
      {/* <Grid
        item
        sx={{
          margin: "auto"
        }}
        md={4}
        xs={6}
      >
        <Button
          variant="contained"
          color="primary"
          disableElevation
          size="small"
          sx={{
            textTransform: "none",
          }}
        >
          Claim
        </Button>
      </Grid> */}
    </Grid>
  );
};


StakingTotal.propTypes = {
  totalAmount: PropTypes.number.isRequired,
  totalReward: PropTypes.number.isRequired,
};