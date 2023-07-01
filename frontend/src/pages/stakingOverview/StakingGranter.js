import React, { useEffect, useState } from "react";
import { Typography, Button, Grid } from "@mui/material";
import AuthzDelegations from "./AuthzDelegations";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthzDelegations } from "../../features/staking/stakeSlice";
import { getAuthzDelegatorTotalRewards } from "../../features/distribution/distributionSlice";
import { getBalances } from "../../features/bank/bankSlice";
import { parseBalance } from "../../utils/denom";
import { DialogDelegate } from "../../components/DialogDelegate";
import { authzExecHelper } from "../../features/authz/authzSlice";

function StakingGranter(props) {
  const {
    chainInfo,
    granter,
    delegateAuthzGrants,
    undelegateAuthzGrants,
    redelegateAuthzGrants,
    withdrawAuthzGranters,
    address,
  } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const chainID = chainInfo?.config?.chainId;

  const validators = useSelector(
    (state) => state.staking.chains[chainID].validators
  );
  const delegations = useSelector(
    (state) => state.staking.chains?.[chainID]?.authzDelegations?.[granter]
  );
  const currency = useSelector(
    (state) => state.wallet.networks[chainID].network?.config?.currencies[0]
  );
  const rewards = useSelector(
    (state) =>
      state.distribution.chains[chainID].authzDelegatorRewards?.[granter]
  );
  const stakingParams = useSelector(
    (state) => state.staking.chains[chainID].params
  );
  const txStatus = useSelector((state) => state.staking.chains[chainID].tx);
  const authzExecTx = useSelector((state) => state.authz.execTx);
  const balances = useSelector((state) => state.bank.balances);
  const feegrant = useSelector(
    (state) => state.common.feegrant
  );

  const [totalRewards, setTotalRewards] = React.useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [stakingOpen, setStakingOpen] = React.useState(false);

  const handleDialogClose = () => {
    setStakingOpen(false);
  };

  useEffect(() => {
    fetchGranterInfo();
  }, []);

  useEffect(() => {
    if (chainInfo.config.currencies.length > 0) {
      if (balances?.[chainID]?.list?.[0] !== undefined) {
        setAvailableBalance(
          parseBalance(
            [balances[chainID].list[0]],
            currency.coinDecimals,
            currency.coinMinimalDenom
          )
        );
      }
    }
  }, [balances]);

  useEffect(() => {
    if (authzExecTx.status === "idle") {
      fetchGranterInfo();
      setStakingOpen(false);
    }
  }, [authzExecTx]);

  const getAuthzBalances = () => {
    dispatch(
      getBalances({
        baseURL: chainInfo.config.rest + "/",
        address: granter,
        chainID: chainID,
      })
    );
  };

  const fetchGranterInfo = () => {
    dispatch(
      getAuthzDelegations({
        baseURL: chainInfo?.config?.rest,
        chainID: chainID,
        address: granter,
      })
    );
    dispatch(
      getAuthzDelegatorTotalRewards({
        baseURL: chainInfo?.config?.rest,
        chainID: chainID,
        address: granter,
      })
    );
  }

  const onAuthzDelegateTx = (data) => {
    authzExecHelper(dispatch, {
      type: "delegate",
      address: address,
      baseURL: chainInfo.config.rest,
      delegator: granter,
      validator: data.validator,
      amount: data.amount * 10 ** currency.coinDecimals,
      denom: currency.coinMinimalDenom,
      chainId: chainInfo.config.chainId,
      rest: chainInfo.config.rest,
      aminoConfig: chainInfo.aminoConfig,
      prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
      feeAmount:
        chainInfo.config.gasPriceStep.average * 10 ** currency.coinDecimals,
      feegranter: feegrant?.granter,
    });
  }

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1, mb: 1 }}
      >
        <Grid item>
          <Typography fontWeight={500} color="text.primary">
            Granter: {granter}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant={theme.palette?.mode === "light" ? "outlined" : "contained"}
            className="button-capitalize-title"
            size="small"
            sx={{
              textTransform: "none",
              mr: 1,
            }}
            disableElevation
            disabled={!delegateAuthzGrants?.includes(granter)}
            onClick={() => {
              getAuthzBalances();
              setStakingOpen(true)
            }}
          >
            Delegate
          </Button>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            size="small"
            sx={{
              textTransform: "none",
            }}
            disabled={!withdrawAuthzGranters.includes(granter)}
          >
            Claim Rewards: {totalRewards}
          </Button>
        </Grid>
      </Grid>
      <AuthzDelegations
        chainID={chainID}
        currency={currency}
        delegations={delegations}
        validators={validators}
        undelegateAuthzGrants={undelegateAuthzGrants}
        redelegateAuthzGrants={redelegateAuthzGrants}
        granter={granter}
        rewards={rewards?.list}
        setTotalRewards={setTotalRewards}
        totalRewards={totalRewards}
      />

      {availableBalance > 0 ? (
        <DialogDelegate
          open={stakingOpen}
          onClose={handleDialogClose}
          validator={null}
          params={stakingParams}
          balance={availableBalance}
          onAuthzDelegate={null}
          loading={txStatus.status}
          displayDenom={currency.coinDenom}
          authzLoading={authzExecTx?.status}
          validators={validators}
          onAuthzDelegateTx={onAuthzDelegateTx}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default StakingGranter;
