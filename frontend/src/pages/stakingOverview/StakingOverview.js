import React from 'react';
import { Container, Typography } from '@mui/material';
import StakingDetails from './StakingDetails';
import { StakingTotal } from './StakingTotal';

const StakingOverview = (props) => {

  let chains = [{
    chainName : "Cosmos Hub Staking",
    stakedAmount : 1306789,
    availableAmount : 23,
    denom : "ATOM",
    rewards : 208,
    validators : [
      {
        validatorName : "Polkachu.com",
        stakedAmount : 1223,
        rewards : 1,
        apr : 19.80,
      },
      {
        validatorName : "Witval",
        stakedAmount : 1226799,
        rewards : 109.09,
        apr : 5.80,
      }
    ]
  },
  {
    chainName : "Stride Staking",
    stakedAmount : 13789,
    availableAmount : 673,
    denom : "STRD",
    rewards : 24.908,
    validators : [
      {
        validatorName : "Swiss Staking",
        stakedAmount : 123,
        rewards : 2,
        apr : 15.80,
      }
    ]
  },
  {
    chainName : "Osmosis Staking",
    stakedAmount : 530679,
    availableAmount : 523,
    denom : "OSMO",
    rewards : 408,
    validators : [
      {
        validatorName : "Binance",
        stakedAmount : 223,
        rewards : 12,
        apr : 15.80,
      },
      {
        validatorName : "Witval",
        stakedAmount : 12276799,
        rewards : 1096.09,
        apr : 16.80,
      }
    ]
  }];

  let stakingData = {
    totalAmount : 13897,
    totalRewards : 234,
    chains : chains
  }
  return (
    <>
    <Container sx={{mb:4}}>
      <Typography color="text.primary" variant="h4" component="h1" align="center" gutterBottom sx={{ mt: 2}}>
        Staking Overview
      </Typography>
      <StakingTotal data={stakingData}/>
      <StakingDetails chains={stakingData.chains} />
      </Container >
    </>
  );
};

export default StakingOverview;
