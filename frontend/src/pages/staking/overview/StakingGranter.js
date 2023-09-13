import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Grid,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import AuthzDelegations from "./AuthzDelegations";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllValidators,
  getAuthzDelegations,
} from "../../../features/staking/stakeSlice";
import { getAuthzDelegatorTotalRewards } from "../../../features/distribution/distributionSlice";
import { getBalances } from "../../../features/bank/bankSlice";
import { parseBalance } from "../../../utils/denom";
import { DialogDelegate } from "../../../components/DialogDelegate";
import { authzExecHelper } from "../../../features/authz/authzSlice";
import { setError } from "../../../features/common/commonSlice";
import { DialogUndelegate } from "../../../components/DialogUndelegate";
import { DialogRedelegate } from "../../../components/DialogRedelegate";
import PropTypes from "prop-types";

export default function StakingGranter(props) {
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
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  let chainName;
  Object.keys(nameToChainIDs).forEach((networkName) => {
    if (chainID == nameToChainIDs[networkName]) {
      chainName = networkName;
    }
  });
  const feegrant = useSelector(
    (state) => state.common.feegrant?.[chainName] || {}
  );

  const [totalRewards, setTotalRewards] = React.useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [stakingOpen, setStakingOpen] = React.useState(false);
  const [undelegateOpen, setUndelegateOpen] = React.useState(false);
  const [selectedValidator, setSelectedValidator] = useState({});
  const [redelegateOpen, setRedelegateOpen] = React.useState(false);

  const [claimingGranter, setClaimingGranter] = useState("");

  const handleDialogClose = () => {
    setStakingOpen(false);
    setUndelegateOpen(false);
    setRedelegateOpen(false);
  };

  const getAuthzBalances = () => {
    dispatch(
      getBalances({
        baseURL: chainInfo.config.rest,
        address: granter,
        chainID: chainID,
      })
    );
  };

  const fetchGranterDelegationsInfo = () => {
    dispatch(
      getAuthzDelegations({
        baseURL: chainInfo?.config?.rest,
        chainID: chainID,
        address: granter,
      })
    );
  };

  const fetchAuthzDelegatorTotalRewards = () => {
    dispatch(
      getAuthzDelegatorTotalRewards({
        baseURL: chainInfo?.config?.rest,
        chainID: chainID,
        address: granter,
      })
    );
  };

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
        chainInfo.config.feeCurrencies[0].gasPriceStep.average *
        10 ** currency.coinDecimals,
      feegranter: feegrant?.granter,
    });
  };

  const onAuthzUndelegateTx = (data) => {
    authzExecHelper(dispatch, {
      type: "undelegate",
      address: address,
      delegator: granter,
      validator: data.validator,
      amount: data.amount * 10 ** currency.coinDecimals,
      denom: currency.coinMinimalDenom,
      chainId: chainInfo.config.chainId,
      rest: chainInfo.config.rest,
      aminoConfig: chainInfo.aminoConfig,
      prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
      feeAmount:
        chainInfo.config.feeCurrencies[0].gasPriceStep.average *
        10 ** currency.coinDecimals,
      feegranter: feegrant?.granter,
    });
  };

  const onAuthzRedelegateTx = (data) => {
    authzExecHelper(dispatch, {
      type: "redelegate",
      address: address,
      baseURL: chainInfo.config.rest,
      delegator: granter,
      srcVal: data.src,
      destVal: data.dest,
      amount: data.amount * 10 ** currency.coinDecimals,
      denom: currency.coinMinimalDenom,
      chainId: chainInfo.config.chainId,
      rest: chainInfo.config.rest,
      aminoConfig: chainInfo.aminoConfig,
      prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
      feeAmount:
        chainInfo.config.feeCurrencies[0].gasPriceStep.average *
        10 ** currency.coinDecimals,
      feegranter: feegrant?.granter,
    });
  };

  const onAuthzWithdrawAllRewards = (granter) => {
    setClaimingGranter(granter);
    let delegationPairs = [];
    delegations?.delegations?.delegations.forEach((item) => {
      delegationPairs.push({
        validator: item.delegation.validator_address,
        delegator: item.delegation.delegator_address,
      });
    });

    authzExecHelper(dispatch, {
      type: "withdraw",
      from: address,
      payload: delegationPairs,
      denom: currency.coinMinimalDenom,
      chainId: chainInfo.config.chainId,
      rest: chainInfo.config.rest,
      aminoConfig: chainInfo.aminoConfig,
      prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
      feeAmount:
        chainInfo.config.feeCurrencies[0].gasPriceStep.average *
        10 ** currency.coinDecimals,
      feegranter: feegrant?.granter,
    });
  };

  const onMenuAction = (e, type, validator) => {
    setSelectedValidator(validator);
    switch (type) {
      case "undelegate":
        if (delegations?.delegations?.delegations.length > 0) {
          setUndelegateOpen(true);
        } else {
          dispatch(
            setError({
              type: "error",
              message: "no delegations",
            })
          );
        }
        break;

      case "redelegate":
        let isValidRedelegation = false;
        let delegationsList = delegations?.delegations?.delegations;
        if (delegationsList?.length > 0) {
          for (let i = 0; i < delegationsList?.length; i++) {
            let item = delegationsList?.[i];
            if (
              item.delegation.validator_address === validator.operator_address
            ) {
              isValidRedelegation = true;
              break;
            }
          }
          if (isValidRedelegation) {
            setRedelegateOpen(true);
          } else {
            dispatch(
              setError({
                type: "error",
                message: "invalid redelegation",
              })
            );
          }
        } else {
          dispatch(
            setError({
              type: "error",
              message: "no delegations present",
            })
          );
        }
        break;

      default:
        console.log("unsupported type");
    }
  };

  useEffect(() => {
    fetchGranterDelegationsInfo();
    fetchAuthzDelegatorTotalRewards();
    dispatch(
      getAllValidators({
        chainID: chainID,
        baseURL: chainInfo.config.rest,
        status: null,
      })
    );
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
    if (authzExecTx.status !== "pending") {
      setClaimingGranter("");
    }
    if (authzExecTx.status === "idle") {
      fetchGranterDelegationsInfo();
      setStakingOpen(false);
      setUndelegateOpen(false);
      setRedelegateOpen(false);
      setTimeout(() => {
        fetchAuthzDelegatorTotalRewards();
      }, 3000);
    }
  }, [authzExecTx]);

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
          <Tooltip
            title={
              !delegateAuthzGrants?.includes(granter)
                ? "you don't have permission to delegate"
                : ""
            }
          >
            <Button
              variant={
                theme.palette?.mode === "light" ||
                !delegateAuthzGrants?.includes(granter)
                  ? "outlined"
                  : "contained"
              }
              className="button-capitalize-title"
              size="small"
              color={
                delegateAuthzGrants?.includes(granter) ? "primary" : "error"
              }
              sx={{
                textTransform: "none",
                mr: 1,
                cursor: !delegateAuthzGrants?.includes(granter)
                  ? "not-allowed"
                  : "pointer",
              }}
              disableElevation
              onClick={() => {
                if (delegateAuthzGrants?.includes(granter)) {
                  getAuthzBalances();
                  setStakingOpen(true);
                }
              }}
            >
              Delegate
            </Button>
          </Tooltip>

          <Tooltip
            title={
              !withdrawAuthzGranters?.includes(granter)
                ? "you don't have permission to claim rewards"
                : ""
            }
          >
            <Button
              variant={
                withdrawAuthzGranters?.includes(granter)
                  ? "contained"
                  : "outlined"
              }
              disableElevation
              size="small"
              color={
                withdrawAuthzGranters?.includes(granter) ? "primary" : "error"
              }
              sx={{
                textTransform: "none",
                cursor: !withdrawAuthzGranters?.includes(granter)
                  ? "not-allowed"
                  : "pointer",
              }}
              onClick={() => {
                if (withdrawAuthzGranters.includes(granter))
                  onAuthzWithdrawAllRewards(granter);
              }}
              disabled={
                authzExecTx?.status === "pending" || Number(totalRewards) === 0
              }
            >
              {claimingGranter === granter ? (
                <CircularProgress size={25} />
              ) : (
                `Claim Rewards: ${(+totalRewards).toLocaleString()} ${
                  currency?.coinDenom
                }`
              )}
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <AuthzDelegations
        currency={currency}
        delegations={delegations}
        validators={validators}
        undelegateAuthzGrants={undelegateAuthzGrants}
        redelegateAuthzGrants={redelegateAuthzGrants}
        granter={granter}
        rewards={rewards?.list}
        setTotalRewards={setTotalRewards}
        onDelegationAction={onMenuAction}
      />

      {availableBalance > 0 ? (
        <DialogDelegate
          open={stakingOpen}
          onClose={handleDialogClose}
          params={stakingParams}
          balance={availableBalance}
          loading={txStatus.status}
          displayDenom={currency.coinDenom}
          authzLoading={authzExecTx?.status}
          validators={validators}
          onAuthzDelegateTx={onAuthzDelegateTx}
        />
      ) : null}

      {delegations?.delegations?.delegations?.length > 0 ? (
        <>
          <DialogUndelegate
            open={undelegateOpen}
            onClose={handleDialogClose}
            validator={selectedValidator}
            params={stakingParams}
            balance={availableBalance}
            delegations={delegations?.delegations?.delegations}
            currency={chainInfo?.config?.currencies[0]}
            loading={txStatus.status}
            onAuthzUndelegateTx={onAuthzUndelegateTx}
            authzLoading={authzExecTx?.status}
          />

          <DialogRedelegate
            open={redelegateOpen}
            onClose={handleDialogClose}
            validator={selectedValidator}
            params={stakingParams}
            balance={availableBalance}
            active={validators?.active}
            inactive={validators?.inactive}
            delegations={delegations?.delegations?.delegations}
            currency={chainInfo?.config?.currencies[0]}
            loading={txStatus.status}
            onRedelegate={onAuthzRedelegateTx}
            authzLoading={authzExecTx?.status}
          />
        </>
      ) : null}
    </>
  );
}

StakingGranter.propTypes = {
  granter: PropTypes.string.isRequired,
  delegateAuthzGrants: PropTypes.array.isRequired,
  undelegateAuthzGrants: PropTypes.array.isRequired,
  redelegateAuthzGrants: PropTypes.array.isRequired,
  withdrawAuthzGranters: PropTypes.array.isRequired,
  chainInfo: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
};
