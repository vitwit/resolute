import React from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Button } from '@mui/material';
import { Validators } from './Validators';

export const Chain = (props) => {
  return (
    <Card
      sx={{
        mb: 2,
        p: 1,
      }}
      elevation={0}
    >
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Avatar src={props.chain.imageUrl} sx={{ width: 36, height: 36 }} />
            <Typography
              align="left"
              variant="h6"
              gutterBottom
              color="text.secondary"
            >
              {props.chain.chainName}
            </Typography>
            <Typography align="left" variant="body1"
              fontWeight={500}
              color="text.primary"
              gutterBottom>
              Total staked amount:&nbsp;{props.chain.stakedAmount}&nbsp;{props.chain.denom}
            </Typography>
          </Grid>

          <Grid item>
            <Button variant="contained" color="primary"
              disableElevation
              size="small"
              sx={{
                textTransform: "none"
              }}
            >
              Claim:&nbsp;{props.chain.rewards + " " + props.chain.denom}
            </Button>
          </Grid>
        </Grid>
        <Validators validators={props.chain.validators} denom={props.chain.denom} />

      </CardContent>
    </Card>
  );
};
