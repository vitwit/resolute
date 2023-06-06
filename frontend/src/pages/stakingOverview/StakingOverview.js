import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Container, Typography, Grid } from '@mui/material';
import { StakingTotal } from './StakingTotal';
import { getDelegations, resetDefaultState, getParams, getAllValidators } from '../../features/staking/stakeSlice';
import { Chain } from './Chain';

const StakingOverview = (props) => {

  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet);
  const chainsmap = useSelector((state)=>state.staking.chains);
  const [data, setData] = useState( {
    totalAmount: 0,
    totalRewards: 0,
    chains: []
  });

  let getStakingObjectForProps = (wallet, chainsmap) => {
    let chainIds = Object.keys(chainsmap);
    let chainsdata = [];
    for (let i = 0; i < chainIds.length; i++) {
      let chainTotalStaked = chainsmap[chainIds[i]]?.delegations?.totalStaked;
      let delegations = chainsmap[chainIds[i]]?.delegations?.delegations;
      let validatorstore = chainsmap[chainIds[i]]?.validators;
      let denom;

      if (delegations?.delegations?.length === undefined || delegations?.delegations?.length === 0) continue;

      let validators = [];

      for (let j = 0; j < delegations?.delegations?.length; j++) {
        let validator = delegations.delegations[j].delegation.validator_address;
        let amount = delegations.delegations[j].balance.amount;
        denom = delegations.delegations[j].balance.denom;
        validators.push({
          validatorName: validatorstore?.active?.[validator]?.description?.moniker ? validatorstore.active[validator]?.description.moniker : (validatorstore?.inActive?.[validator]?.description?.moniker ? validatorstore?.inActive[validator].description.moniker:'unknown'),
          stakedAmount: amount,
          rewards: 0,
          apr: 0
        });
      }
      let chain = {
        chainName: chainIds[i],
        stakedAmount: chainTotalStaked,
        availableAmount: 0,
        denom: denom,
        rewards: 0,
        validators: validators
      }
      chainsdata.push(chain);
    }
    return {
      totalAmount: 0,
      totalRewards: 0,
      chains: chainsdata,
    }
  };

  useEffect(()=>{
    let chainIds = Object.keys(wallet.networks);
    dispatch(resetDefaultState(chainIds));
    for (let i = 0; i < chainIds.length; i++) {
      let chainnetwork = wallet.networks[chainIds[i]];
      let address = chainnetwork?.walletInfo?.bech32Address;
      let baseURL = chainnetwork?.network?.config.rest;
      let denom = chainnetwork?.network?.config.currencies[0].coinDenom;
      dispatch(getAllValidators({ baseURL: baseURL, chainID: chainIds[i], status: null }));
      dispatch(getDelegations({ address: address, baseURL: baseURL, chainID: chainIds[i] }));
    }
  }, [wallet])

  useEffect(() => {
    if (Object.keys(chainsmap).length !== 0) {
      setData(getStakingObjectForProps(wallet, chainsmap));
    }
  }, [chainsmap])

  return (
    <Container>
      {data.chains.length>0 ? <> <StakingTotal data={data}/>  <div>{data.chains.map((chain) => <Chain chain={chain} key={chain.chainName}/>)}</div> </> : <></>}
    </Container >
  );
}
export default StakingOverview;
