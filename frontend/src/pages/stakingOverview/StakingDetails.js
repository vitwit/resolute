import React from 'react';
import { Typography, Grid } from '@mui/material';
import { Chains } from './Chains';

const StakingDetails = (props) => {
  return (
    <Chains chains={props.chains} />
  );
};

export default StakingDetails;
