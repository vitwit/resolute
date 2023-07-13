import React, { useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Button, CircularProgress } from '@mui/material';
import { Validators } from './Validators';
import { useDispatch, useSelector } from 'react-redux';
import { getDelegatorTotalRewards, txWithdrawAllRewards } from '../../features/distribution/distributionSlice';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export const Chain = (props) => {
  const chainID = props?.chain?.chainName;
  const wallet = useSelector((state) => state.wallet);
  const feegrant = useSelector((state) => state.common.feegrant);
  const distTxStatus = useSelector((state) => state.distribution.chains[chainID].tx);
  const delegations = useSelector((state) => state.staking.chains[chainID].delegations);
  const dispatch = useDispatch();
  const chainInfo = wallet.networks[chainID];
  const currency = chainInfo.network?.config?.currencies[0];

  let chainReward = (+props?.chainReward?.totalRewards || 0).toLocaleString();
  let chainStakedAmount = (+props?.chain?.stakedAmount || 0).toLocaleString();

  const navigate = useNavigate();

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
        chainID: chainID,
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
    dispatch(getDelegatorTotalRewards({
      chainID: chainID,
      baseURL: chainInfo.network.config.rest,
      address: chainInfo.walletInfo.bech32Address
    }));
  }, [distTxStatus.status])


  return (
    <Card
      sx={{
        mb: 1,
      }}
      elevation={0}
    >
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <div
              style={{
                display: "flex"
              }}
            >
              <Avatar
                src={props.chain.imageURL}
                sx={{
                  width: 36,
                  height: 36
                }}
              />
              <Typography
                align="left"
                variant="h6"
                gutterBottom
                color="text.secondary"
                sx={{
                  ml: 1,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() =>
                  navigate(`/${chainInfo?.network?.config?.chainName.toLowerCase()}/staking`)
                }
              >
                {chainInfo?.network?.config?.chainName}
              </Typography>
            </div>
            <Typography
              align="left"
              variant="body1"
              fontWeight={500}
              color="text.primary"
              gutterBottom>
              Total staked:&nbsp;{chainStakedAmount}&nbsp;{props.chain.denom}
            </Typography>

          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              size="small"
              disabled={distTxStatus.status === 'pending'}
              sx={{
                textTransform: "none"
              }}
              onClick={onClickClaim}
            >
              {distTxStatus.status === "pending" ? (
                <>
                  <CircularProgress size={18} />
                  &nbsp;&nbsp;Please wait...
                </>
              ) : (
                <>
                  Claim:&nbsp;{chainReward}&nbsp;{props.chain.denom}
                </>
              )}
            </Button>
          </Grid>
        </Grid>
        <Validators
          validators={props.chain.validators}
          rewards={props?.chainReward?.validators}
          denom={props.chain.denom}
        />

      </CardContent>
    </Card>
  );
};

Chain.propTypes = {
  chain: PropTypes.shape({
    chainName: PropTypes.string.isRequired,
    imageURL: PropTypes.string.isRequired,
    stakedAmount: PropTypes.number.isRequired,
    denom: PropTypes.string.isRequired,
    validators: PropTypes.array.isRequired,
  }).isRequired,
  chainReward: PropTypes.shape({
    totalRewards: PropTypes.number.isRequired,
    validators: PropTypes.object.isRequired,
  }).isRequired,
};

