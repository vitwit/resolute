import React from 'react';
import { Typography, Grid } from '@mui/material';
import { Chains } from './Chains';

const StakingDetails = (props) => {
  return (
    <div>
      <Grid container alignItems="center">
        <Grid item>
          <Typography color="text.primary" variant="h4" component="h2">
            Staking-{props.chains.length}
          </Typography>
        </Grid>
      </Grid>
      <div>
        <Chains chains={props.chains} />
      </div>
    </div>
  );
};

export default StakingDetails;
