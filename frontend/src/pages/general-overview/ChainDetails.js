import { Avatar, Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import { claimRewardInBank } from "../../features/bank/bankSlice";
import {
  getDelegatorTotalRewards,
  resetChainRewards,
  txWithdrawAllRewards,
} from "../../features/distribution/distributionSlice";
import {
  addRewardsToDelegations,
  resetRestakeTx,
  txRestake,
} from "../../features/staking/stakeSlice";
import { Delegate } from "../../txns/staking";
import { parseBalance } from "../../utils/denom";

export const ChainDetails = (props) => {
  const { chainID, chainName } = props;
  const balance = useSelector(
    (state) => state.bank.balances?.[chainID]?.list || []
  );
  const totalRewards = useSelector(
    (state) =>
      state.distribution?.chains?.[chainID]?.delegatorRewards?.totalRewards || 0
  );
  const distTxStatus = useSelector(
    (state) => state.distribution.chains[chainID].tx
  );
  const delegatorRewards = useSelector(
    (state) => state.distribution?.chains?.[chainID]?.delegatorRewards || {}
  );
  const staked = useSelector(
    (state) => state.staking.chains[chainID].delegations.totalStaked
  );

  const delegations = useSelector(
    (state) => state.staking?.chains?.[chainID]?.delegations || []
  );

  const txRestakeStatus = useSelector(
    (state) => state.staking.overviewTx.status
  );

  const wallet = useSelector((state) => state.wallet);
  const chainInfo = wallet?.networks?.[chainID];
  const denom = chainInfo?.network?.config?.currencies?.[0]?.coinDenom;
  const minimalDenom =
    chainInfo?.network?.config?.currencies?.[0]?.coinMinimalDenom;
  const decimals =
    chainInfo?.network?.config?.currencies?.[0]?.coinDecimals || 1;
  const logoURL = chainInfo?.network?.logos?.menu;
  const navigate = useNavigate();
  const feegrant = useSelector((state) => state.common.feegrant);

  const handleOnClick = (chainName) => {
    navigate(`/${chainName}/overview`);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (txRestakeStatus === "idle") {
      dispatch(resetRestakeTx());
      dispatch(
        addRewardsToDelegations({
          chainID,
          totalRewards,
          decimals,
          rewardsList: delegatorRewards.list,
        })
      );
      dispatch(resetChainRewards({ chainID }));
    }
  }, [txRestakeStatus]);

  useEffect(() => {
    if (distTxStatus.status === "idle") {
      dispatch(claimRewardInBank({ chainID, totalRewards, minimalDenom }));
      dispatch(resetChainRewards({ chainID }));
    }
  }, [distTxStatus.status]);

  useEffect(() => {
    dispatch(resetRestakeTx());
  }, []);

  const actionClaimAndStake = () => {
    const msgs = [];
    const delegator = chainInfo?.walletInfo?.bech32Address;
    for (let index = 0; index < delegatorRewards?.list.length; index++) {
      const delegation = delegatorRewards.list[index];
      for (let i = 0; i < delegation.reward.length; i++) {
        const reward = delegation.reward[i];
        if (reward.denom === minimalDenom) {
          msgs.push(
            Delegate(
              delegator,
              delegation.validator_address,
              parseInt(reward.amount),
              minimalDenom
            )
          );
        }
      }
    }

    dispatch(
      txRestake({
        msgs: msgs,
        chainId: chainID,
        denom: minimalDenom,
        chainId: chainID,
        rest: chainInfo?.network?.config?.rest,
        aminoConfig: chainInfo?.network?.aminoConfig,
        prefix: chainInfo?.network?.config?.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo?.network?.config?.feeCurrencies?.[0]?.gasPriceStep.average * 10 ** decimals,
        feegranter: feegrant?.granter,
        memo: "Delegate(rewards)",
      })
    );
  };

  const claimRewards = () => {
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
        denom: minimalDenom,
        chainID: chainID,
        aminoConfig: chainInfo.network.aminoConfig,
        prefix: chainInfo.network.config.bech32Config.bech32PrefixAccAddr,
        rest: chainInfo.network.config.rest,
        feeAmount:
          chainInfo.network.config?.feeCurrencies?.[0]?.gasPriceStep.average * 10 ** decimals,
        feegranter: feegrant.granter,
      })
    );
  };

  return (
    <>
      {balance?.length > 0 ? (
        <StyledTableRow>
          <StyledTableCell size="small">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={logoURL}
                sx={{
                  width: 24,
                  height: 24,
                  "&:hover": {
                    backgroundColor: "white",
                    cursor: "pointer",
                  },
                }}
                onClick={() => handleOnClick(chainName)}
              />
              &nbsp;&nbsp;
              <Typography
                sx={{
                  textTransform: "capitalize",
                  "&:hover": {
                    cursor: "pointer",
                    color: "purple",
                  },
                }}
                onClick={() => handleOnClick(chainName)}
              >
                {chainName}
              </Typography>
            </Box>
          </StyledTableCell>
          <StyledTableCell>
            {parseBalance(balance, decimals, minimalDenom).toLocaleString()}
            &nbsp;
            {denom}
          </StyledTableCell>
          <StyledTableCell>
            {(+staked / 10 ** decimals).toLocaleString()}&nbsp;{denom}
          </StyledTableCell>
          <StyledTableCell>
            {(+totalRewards / 10 ** decimals).toLocaleString()}&nbsp;{denom}
          </StyledTableCell>
          <StyledTableCell>
            <Button
              color="primary"
              disableElevation
              variant="contained"
              size="small"
              sx={{
                textTransform: "none",
              }}
              disabled={
                totalRewards <= 0 ||
                txRestakeStatus === "pending" ||
                distTxStatus.status === "pending"
              }
              onClick={actionClaimAndStake}
            >
              Claim&nbsp;&&nbsp;Stake
            </Button>
            <Button
              color="primary"
              disableElevation
              variant="contained"
              size="small"
              sx={{
                textTransform: "none",
                ml: 1,
              }}
              disabled={
                totalRewards <= 0 ||
                txRestakeStatus === "pending" ||
                distTxStatus.status === "pending"
              }
              onClick={claimRewards}
            >
              {distTxStatus.status === "pending" ? (
                <>
                  <CircularProgress size={18} />
                  &nbsp;&nbsp;Please wait...
                </>
              ) : (
                <>Claim</>
              )}
            </Button>
          </StyledTableCell>
        </StyledTableRow>
      ) : null}
    </>
  );
};
