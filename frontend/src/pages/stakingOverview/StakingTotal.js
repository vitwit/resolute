import React from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';

export const StakingTotal = (props) => {
  return (
      <Grid container spacing={1} sx={{marginBottom:'80px'}}>
        <Grid item xs={6} md={6} sm={6} lg={7}>
          <Card>
            <CardContent>
              <Typography align="left">Total Staked Balance</Typography>
              <Typography align="left" variant="h4">${props?.data?.totalAmount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={6} sm={6} lg={5}>
          <Card>
            <CardContent>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Typography align="left">Total Staking Rewards</Typography>
                  <Typography align="left" variant="h4">${props?.data?.totalRewards}</Typography>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary">
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
