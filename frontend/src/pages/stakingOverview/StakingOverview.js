import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Container, Typography, Grid } from '@mui/material';
import { StakingTotal } from './StakingTotal';
import { getDelegations, resetDefaultState, getParams, getAllValidators } from '../../features/staking/stakeSlice';
import { Chain } from './Chain';

const StakingOverview = (props) => {

  let getStakingObjectForProps = (wallet, chainsmap) => {
    let totalStaking = 0;
    let totalRewards = '?';
    let chainIds = Object.keys(chainsmap);
    let chainsdata = [];
    for (let i = 0; i < chainIds.length; i++) {
      let chainTotalStaked = chainsmap[chainIds[i]]?.delegations?.totalStaked;
      let delegations = chainsmap[chainIds[i]]?.delegations?.delegations;
      let denom;

      if (delegations?.delegations?.length === undefined || delegations?.delegations?.length === 0) continue;

      let validators = [];

      for (let j = 0; j < delegations?.delegations?.length; j++) {
        let validator = delegations.delegations[j].delegation.validator_address;
        let amount = delegations.delegations[j].balance.amount;
        denom = delegations.delegations[j].balance.denom;
        validators.push({
<<<<<<< HEAD
          validatorName : validator,
          stakedAmount : amount,
          rewards : 0,
          apr : 0
        });
      }
      let chain = {
        chainName : chainIds[i],
        stakedAmount : chainTotalStaked,
        availableAmount : 0,
        denom : denom,
        rewards : 0,
        validators : validators
=======
          validatorName: validator,
          stakedAmount: amount,
          rewards: '?',
          apr: '?'
        });
      }
      let chain = {
        chainName: chainIds[i],
        stakedAmount: chainTotalStaked,
        availableAmount: '?',
        denom: denom,
        rewards: '?',
        validators: validators
>>>>>>> db798f6d10e5918ed32b37421d6477e96be73fae
      }
      chainsdata.push(chain);
    }
    return {
<<<<<<< HEAD
      totalAmount : 0,
      totalRewards : 0,
      chains : chainsdata,
=======
      totalAmount: '?',
      totalRewards: '?',
      chains: chainsdata,
>>>>>>> db798f6d10e5918ed32b37421d6477e96be73fae
    }
  };

  let dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet);
<<<<<<< HEAD
  const stakingInfoChains = useSelector((state)=>state.staking.chains);
  let chainsmap = useSelector((state)=>state.staking.chains);
  const [data, setData] = useState( {
    totalAmount : 0,
    totalRewards : 0,
    chains : []
  });
  useEffect(()=>{
=======
  const stakingInfoChains = useSelector((state) => state.staking.chains);
  let chainsmap = useSelector((state) => state.staking.chains);
  const [data, setData] = useState();
  useEffect(() => {
    //console.log("1called.......")
>>>>>>> db798f6d10e5918ed32b37421d6477e96be73fae
    let chainIds = Object.keys(wallet.networks);
    dispatch(resetDefaultState(chainIds));
    for (let i = 0; i < chainIds.length; i++) {
      let chainnetwork = wallet.networks[chainIds[i]];
      let address = chainnetwork?.walletInfo?.bech32Address;
      let baseURL = chainnetwork?.network?.config.rest;
      dispatch(getDelegations({ address: address, baseURL: baseURL, chainID: chainIds[i] }));
      dispatch(getAllValidators({ baseURL: baseURL, chainID: chainIds[i], status: null }));
      dispatch(getParams({ baseURL: baseURL, chainID: chainIds[i] }));
    }
  }, [wallet])

  useEffect(() => {
    if (Object.keys(chainsmap).length !== 0) {

      setData(getStakingObjectForProps(wallet, chainsmap));
    }
  }, [chainsmap])

  let chains = [{
    chainName: "Cosmos Hub Staking",
    stakedAmount: 1306789,
    availableAmount: 23,
    denom: "ATOM",
    rewards: 208,
    validators: [
      {
        validatorName: "Polkachu.com",
        stakedAmount: 1223,
        rewards: 1,
        apr: 19.80,
      },
      {
        validatorName: "Witval",
        stakedAmount: 1226799,
        rewards: 109.09,
        apr: 5.80,
      }
    ]
  },
  {
    chainName: "Stride Staking",
    stakedAmount: 13789,
    availableAmount: 673,
    denom: "STRD",
    rewards: 24.908,
    validators: [
      {
        validatorName: "Swiss Staking",
        stakedAmount: 123,
        rewards: 2,
        apr: 15.80,
      }
    ]
  },
  {
    chainName: "Osmosis Staking",
    stakedAmount: 530679,
    availableAmount: 523,
    denom: "OSMO",
    rewards: 408,
    validators: [
      {
        validatorName: "Binance",
        stakedAmount: 223,
        rewards: 12,
        apr: 15.80,
      },
      {
        validatorName: "Witval",
        stakedAmount: 12276799,
        rewards: 1096.09,
        apr: 16.80,
      }
    ]
  }];

  let dummyStakingData = {
    totalAmount: 13897,
    totalRewards: 234,
    chains: chains
  }
  return (
<<<<<<< HEAD
    <Container sx={{mb:4}}>
      <Typography color="text.primary" variant="h4" component="h1" align="center" gutterBottom sx={{ mt: 2}}>
        Staking Overview
      </Typography>
      {!(data===undefined || Object.keys(data)===0 || data.chains.length===0) &&  <StakingTotal data={data}/> }
      {!(data===undefined || Object.keys(data)===0 || data.chains.length===0) && 
        <div>
          <Grid container alignItems="center">
            <Grid item>
              <Typography color="text.primary" variant="h4" component="h2">
                {console.log("here",data)}
                Staking-{data.chains.length}
              </Typography>
            </Grid>
          </Grid>
          <div>
            {data.chains.map((chain) => <Chain chain={chain} key={chain.chainName}/>)}
          </div>
        </div>
      }
=======
    <>
      <Container>
        <StakingTotal data={dummyStakingData} />
        <StakingDetails chains={dummyStakingData.chains} />
>>>>>>> db798f6d10e5918ed32b37421d6477e96be73fae
      </Container >
  );
};

export default StakingOverview;
