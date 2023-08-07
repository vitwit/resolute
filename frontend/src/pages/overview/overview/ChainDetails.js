import { Avatar, Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/CustomTable";
import { claimRewardInBank } from "../../../features/bank/bankSlice";
import {
  resetChainRewards,
  txWithdrawAllRewards,
} from "../../../features/distribution/distributionSlice";
import {
  addRewardsToDelegations,
  resetRestakeTx,
  txRestake,
} from "../../../features/staking/stakeSlice";
import { Delegate } from "../../../txns/staking";
import { parseBalance } from "../../../utils/denom";
import chainDenoms from "../../../utils/chainDenoms.json";

export const ChainDetails = ({ chainID, chainName, assetType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const feegrant = useSelector((state) => state.common.feegrant);
  const wallet = useSelector((state) => state.wallet);
  const tokensPriceInfo = useSelector(
    (state) => state.common?.allTokensInfoState?.info
  );
  const { list: balance } =
    useSelector((state) => state.bank.balances?.[chainID]) || {};
  const totalRewards = useSelector(
    (state) =>
      state.distribution?.chains?.[chainID]?.delegatorRewards?.totalRewards || 0
  );
  const distTxStatus = useSelector(
    (state) => state.distribution?.chains?.[chainID]?.tx
  );
  const delegatorRewards = useSelector(
    (state) => state.distribution?.chains?.[chainID]?.delegatorRewards || {}
  );
  const staked = useSelector(
    (state) => state.staking.chains[chainID]?.delegations?.totalStaked
  );
  const delegations = useSelector(
    (state) => state.staking?.chains?.[chainID]?.delegations || []
  );
  const txRestakeStatus = useSelector(
    (state) => state.staking.overviewTx.status
  );

  const chainInfo = wallet?.networks?.[chainID];
  const originDenom = chainInfo?.network?.config?.currencies?.[0]?.coinDenom;
  const originMinimalDenom =
    chainInfo?.network?.config?.currencies?.[0]?.coinMinimalDenom;
  const decimals =
    chainInfo?.network?.config?.currencies?.[0]?.coinDecimals || 1;
  const logoURL = chainInfo?.network?.logos?.menu;

  const ibcChainLogoUrl =
    "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/";

  // Memoized function to prevent unnecessary re-renders
  const handleOnClick = useCallback(() => {
    navigate(`/${chainName}/overview`);
  }, [chainName, navigate]);

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
    if (distTxStatus?.status === "idle") {
      dispatch(
        claimRewardInBank({ chainID, totalRewards, originMinimalDenom })
      );
      dispatch(resetChainRewards({ chainID }));
    }
  }, [distTxStatus?.status]);

  useEffect(() => {
    dispatch(resetRestakeTx());
  }, []);

  const actionClaimAndStake = () => {
    const msgs = [];
    const delegator = chainInfo?.walletInfo?.bech32Address;
    for (const delegation of delegatorRewards.list) {
      for (const reward of delegation.reward) {
        if (reward.denom === originMinimalDenom) {
          msgs.push(
            Delegate(
              delegator,
              delegation.validator_address,
              parseInt(reward.amount),
              originMinimalDenom
            )
          );
        }
      }
    }

    dispatch(
      txRestake({
        msgs: msgs,
        chainId: chainID,
        denom: originMinimalDenom,
        chainId: chainID,
        rest: chainInfo?.network?.config?.rest,
        aminoConfig: chainInfo?.network?.aminoConfig,
        prefix: chainInfo?.network?.config?.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo?.network?.config?.feeCurrencies?.[0]?.gasPriceStep.average *
          10 ** decimals,
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
        denom: originMinimalDenom,
        chainID: chainID,
        aminoConfig: chainInfo.network.aminoConfig,
        prefix: chainInfo.network.config.bech32Config.bech32PrefixAccAddr,
        rest: chainInfo.network.config.rest,
        feeAmount:
          chainInfo.network.config?.feeCurrencies?.[0]?.gasPriceStep.average *
          10 ** decimals,
        feegranter: feegrant.granter,
      })
    );
  };

  return (
    <>
      {assetType === "native" ? (
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
                      fontWeight: 600,
                    }}
                    onClick={() => handleOnClick(chainName)}
                  >
                    {chainName}
                  </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                {parseBalance(
                  balance,
                  decimals,
                  originMinimalDenom
                ).toLocaleString()}
                &nbsp;
                {originDenom}
              </StyledTableCell>
              <StyledTableCell>
                {(+staked / 10 ** decimals).toLocaleString()}&nbsp;
                {originDenom}
              </StyledTableCell>
              <StyledTableCell>
                {(+totalRewards / 10 ** decimals).toLocaleString()}&nbsp;
                {originDenom}
              </StyledTableCell>
              <StyledTableCell>
                {tokensPriceInfo[originMinimalDenom]
                  ? `$${parseFloat(
                      tokensPriceInfo[originMinimalDenom]?.info?.["usd"]
                    ).toFixed(2)}`
                  : "N/A"}
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
                    distTxStatus?.status === "pending"
                  }
                  onClick={actionClaimAndStake}
                >
                  {txRestakeStatus?.status === "pending" ? (
                    <>
                      <CircularProgress size={18} />
                      &nbsp;Claim&nbsp;&&nbsp;Stake
                    </>
                  ) : (
                    <>Claim&nbsp;&&nbsp;Stake</>
                  )}
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
                    distTxStatus?.status === "pending"
                  }
                  onClick={claimRewards}
                >
                  {distTxStatus?.status === "pending" ? (
                    <>
                      <CircularProgress size={18} />
                      &nbsp;Claim
                    </>
                  ) : (
                    <>Claim</>
                  )}
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ) : null}
        </>
      ) : (
        <>
          {balance?.map((item, index) => {
            const denomInfo = chainDenoms[chainName]?.filter((x) => {
              return x.denom === item.denom;
            });
            return denomInfo?.length && item.denom !== originMinimalDenom ? (
              <StyledTableRow key={index}>
                <StyledTableCell size="small">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={ibcChainLogoUrl + denomInfo[0]?.image}
                      sx={{
                        width: 28,
                        height: 28,
                        "&:hover": {
                          backgroundColor: "white",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => handleOnClick(chainName)}
                    />
                    &nbsp;&nbsp;
                    <Box>
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
                        <Typography sx={{ display: "inline" }}>
                          {parseBalance(
                            balance,
                            denomInfo[0]?.decimals,
                            item.denom
                          ).toLocaleString()}
                          &nbsp;
                        </Typography>
                        <Typography sx={{ display: "inline", fontWeight: 600 }}>
                          {denomInfo[0]?.symbol}
                        </Typography>
                        <Typography
                          sx={{
                            backgroundColor: "#767676",
                            borderRadius: "4px",
                            ml: "4px",
                            px: "4px",
                            fontWeight: 600,
                            display: "inline",
                            color: "white",
                            fontSize: "12px",
                          }}
                        >
                          IBC
                        </Typography>
                      </Typography>
                      <Typography
                        sx={{
                          textTransform: "capitalize",
                          "&:hover": {
                            cursor: "pointer",
                            color: "purple",
                          },
                          fontSize: "12px",
                          color: "#767676",
                        }}
                        onClick={() => handleOnClick(chainName)}
                      >
                        On {chainName}
                      </Typography>
                    </Box>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  {tokensPriceInfo[denomInfo[0]?.origin_denom]
                    ? `$${parseFloat(
                        tokensPriceInfo[denomInfo[0]?.origin_denom]?.info?.[
                          "usd"
                        ]
                      ).toFixed(2)}`
                    : "N/A"}
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              <></>
            );
          })}
        </>
      )}
    </>
  );
};
