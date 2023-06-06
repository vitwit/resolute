import React from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';

export const StakingTotal = (props) => {
  return (
    <Grid container
      sx={{
        mb: 3,
      }}
      spacing={1}
    >
      <Grid item xs={6} md={6}>
        <Card
          elevation={0}
        >
          <CardContent>
            <Typography
              align="left"
              variant='h6'
              color="text.secondary"
            >Total Staked Balance</Typography>
            <Typography
              align="left"
              variant="h6"
              color="text.primary"
            >
              ${props?.data?.totalAmount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={6}>
        <Card
          elevation={0}
        >
          <CardContent>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography
                  align="left"
                  variant='h6'
                  color="text.secondary"
                >Total Staking Rewards</Typography>
                <Typography
                  align="left"
                  variant="h6"
                  color="text.primary"
                >${props?.data?.totalRewards}</Typography>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" disableElevation
                  sx={{
                    textTransform: "none"
                  }}
                >
                  Claim
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
