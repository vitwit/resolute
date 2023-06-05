import React from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Button } from '@mui/material';
import { Validators } from './Validators';

export const Chain = (props) => {
  return (
    <Grid container spacing={1} sx={{marginBottom:'10px'}}>
      <Grid item xs={12}  sm={12} >
        <Card >
          <CardContent>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Avatar src={props.chain.imageUrl} sx={{ width: 60, height: 60, borderRadius: '50%' }} />
                <Typography align="left" variant="h5" gutterBottom>
                  {props.chain.chainName}
                </Typography>
                <Typography align="left" variant="h6" gutterBottom>
                  Total staked amount: {props.chain.stakedAmount + " " + props.chain.denom} | Available Amount: {props.chain.availableAmount + " " + props.chain.denom}
                </Typography>
              </Grid>
              
              <Grid item>
                  <Button variant="contained" color="primary">
                  <Typography align="left" variant="h6" gutterBottom>
                Claim: {props.chain.rewards + " " + props.chain.denom} 
              </Typography>
                  </Button>
                </Grid>
            </Grid>
            <Grid>
              <Grid item xs={12}>
                <Validators validators={props.chain.validators} denom={props.chain.denom} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
