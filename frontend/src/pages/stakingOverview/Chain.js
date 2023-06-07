import React, { useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Button, CircularProgress } from '@mui/material';
import { Validators } from './Validators';
import { useDispatch, useSelector } from 'react-redux';
import { getDelegatorTotalRewards, txWithdrawAllRewards } from '../../features/distribution/distributionSlice';

export const Chain = (props) => {

  const wallet = useSelector((state) => state.wallet);
  const feegrant = useSelector((state) => state.common.feegrant);
  const distTxStatus = useSelector((state) => state.distribution.chains[props.chain.chainName].tx);
  //const rewards = useSelector((state) => state.distribution.chains[props.chain.chainName].delegatorRewards);
  const delegations = useSelector((state) => state.staking.chains[props.chain.chainName].delegations);
  const dispatch = useDispatch();
  const chainInfo = wallet.networks[props.chain.chainName];
  const currency = chainInfo.network?.config?.currencies[0];

  const onClickClaim = () => {
    let delegationPairs = [];
    delegations.delegations.delegations.forEach((item) => {
      delegationPairs.push({
        validator: item.delegation.validator_address,
        delegator: item.delegation.delegator_address,
      });
    });
    dispatch(
      txWithdrawAllRewards({
        msgs: delegationPairs,
        denom: currency.coinMinimalDenom,
        chainID: props.chain.chainName,
        aminoConfig: chainInfo.network.aminoConfig,
        prefix: chainInfo.network.config.bech32Config.bech32PrefixAccAddr,
        rest: chainInfo.network.config.rest,
        feeAmount:
          chainInfo.network.config.gasPriceStep.average * 10 ** currency.coinDecimals,
        feegranter: feegrant.granter,
      })
    );
  }

  useEffect(() => {
    dispatch(getDelegatorTotalRewards({chainID:props.chain.chainName, baseURL:chainInfo.network.config.rest, address:chainInfo.walletInfo.bech32Address}));
  }, [distTxStatus.status])
  
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
              disabled={distTxStatus.status==='pending'}
              sx={{
                textTransform: "none"
              }}
              onClick={onClickClaim}
            >
              {distTxStatus.status === "pending"  ? (
                <>
                  <CircularProgress size={18} />
                  &nbsp;&nbsp;Please wait...
                </>
              ) : (
              <>Claim:&nbsp;{props?.chainReward?.totalRewards}&nbsp;{props.chain.denom}</>
              )}
            </Button>
          </Grid>
        </Grid>
        <Validators validators={props.chain.validators} rewards={props?.chainReward?.validators} denom={props.chain.denom} />

      </CardContent>
    </Card>
  );
};
