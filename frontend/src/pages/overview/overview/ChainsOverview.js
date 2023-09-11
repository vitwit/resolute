import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getDelegations } from "../../../features/staking/stakeSlice";
import { getBalances } from "../../../features/bank/bankSlice";
import { getDelegatorTotalRewards } from "../../../features/distribution/distributionSlice";
import { useDispatch, useSelector } from "react-redux";
import { ChainDetails } from "./ChainDetails";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/CustomTable";
import { formatNumber, parseBalance } from "../../../utils/denom";
import { Button } from "@mui/material";
import chainDenoms from "../../../utils/chainDenoms.json";
import { useNavigate } from "react-router-dom";
import { getIBCBalances } from "../../../utils/util";

export const paddingTopBottom = {
  paddingTop: 1,
  paddingBottom: 1,
};

export const ChainsOverview = ({ chainNames }) => {
  const ibcChainLogoUrl =
    "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const networks = useSelector((state) => state.wallet.networks);
  const stakingChains = useSelector((state) => state.staking.chains);
  const distributionChains = useSelector((state) => state.distribution.chains);
  const balanceChains = useSelector((state) => state.bank.balances);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const tokensPriceInfo = useSelector(
    (state) => state.common?.allTokensInfoState?.info
  );

  const [assetType, setAssetType] = useState("native");
  const chainIDs = chainNames.map((chainName) => nameToChainIDs[chainName]);

  const chainIdToNames = useMemo(() => {
    const chainIdToNames = {};
    for (let key in nameToChainIDs) {
      chainIdToNames[nameToChainIDs[key]] = key;
    }
    return chainIdToNames;
  }, [nameToChainIDs]);

  const convertToDollars = (denom, amount = 0) => {
    if (tokensPriceInfo[denom]) {
      let price = +tokensPriceInfo?.[denom]?.info?.["usd"] || 0;
      return amount * price;
    }
    return 0;
  };

  const calculateTotalStakedAmount = useCallback(() => {
    let totalStakedAmount = 0;
    chainIDs.forEach((chainID) => {
      const staked = stakingChains?.[chainID]?.delegations?.totalStaked || 0;
      if (staked > 0) {
        let denom =
          networks?.[chainID]?.network?.config?.currencies?.[0]
            ?.coinMinimalDenom;
        const decimals =
          networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
          0;
        totalStakedAmount += convertToDollars(denom, staked / 10 ** decimals);
      }
    });
    return totalStakedAmount;
  }, [chainIDs, stakingChains, networks]);

  const calculateTotalPendingAmount = useCallback(() => {
    let totalRewards = 0;
    chainIDs.forEach((chainID) => {
      const rewards =
        distributionChains?.[chainID]?.delegatorRewards?.totalRewards || 0;
      if (rewards > 0) {
        const denom =
          networks?.[chainID]?.network?.config?.currencies?.[0]
            ?.coinMinimalDenom;
        const decimals =
          networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
          0;
        totalRewards += convertToDollars(denom, rewards / 10 ** decimals);
      }
    });
    return totalRewards;
  }, [chainIDs, distributionChains, networks]);

  const calculateTotalAvailableAmount = useCallback(() => {
    let totalBalance = 0;
    let totalIBCBalance = 0;
    chainIDs.forEach((chainID) => {
      const decimals =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
        0;
      const denom =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;
      const balance = parseBalance(
        balanceChains?.[chainID]?.list || [],
        decimals,
        denom
      );
      const chainName =
        networks?.[chainID]?.network?.config?.chainName.toLowerCase();
      const ibcBalances = getIBCBalances(
        balanceChains?.[chainID]?.list,
        denom,
        chainName
      );
      for (let i = 0; i < ibcBalances?.length; i++) {
        totalIBCBalance += convertToDollars(
          ibcBalances[i].denom,
          parseBalance(
            ibcBalances,
            ibcBalances?.[i]?.decimals,
            ibcBalances?.[i]?.denom
          )
        );
      }
      if (balanceChains?.[chainID]?.list?.length > 0) {
        totalBalance += convertToDollars(denom, balance);
      }
    });
    return { totalBalance: totalBalance, totalIBCBalance: totalIBCBalance };
  }, [chainIDs, balanceChains, networks]);

  const getSortedChainIds = useCallback(() => {
    let sortedChains = [];
    chainIDs.forEach((chainID) => {
      const decimals =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
        0;
      const denom =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;
      const balance = parseBalance(
        balanceChains?.[chainID]?.list || [],
        decimals,
        denom
      );
      // minimalDenom
      const staked = stakingChains?.[chainID]?.delegations?.totalStaked || 0;
      // minimalDenom
      const rewards =
        distributionChains?.[chainID]?.delegatorRewards?.totalRewards || 0;
      let chain = { chainID, usdValue: 0 };
      if (balanceChains?.[chainID]?.list?.length > 0) {
        chain.usdValue =
          convertToDollars(denom, balance) +
          convertToDollars(denom, staked / 10 ** decimals) +
          convertToDollars(denom, rewards / 10 ** decimals);
      }
      sortedChains = [...sortedChains, chain];
    });
    sortedChains.sort((x, y) => y.usdValue - x.usdValue);
    return sortedChains.map((chain) => chain.chainID);
  }, [chainIDs, networks, balanceChains, tokensPriceInfo]);

  const getIBCSortedCHainIds = useCallback(() => {
    let sortedIBCChains = [];

    chainIDs.forEach((chainID) => {
      const chainName = chainIdToNames[chainID];
      const minimalDenom =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;
      const chainBalances = balanceChains?.[chainID]?.list || [];
      chainBalances.forEach((balance) => {
        const denomInfo = chainDenoms[chainName]?.filter((denomInfo) => {
          return denomInfo.denom === balance.denom;
        });
        if (balance?.denom !== minimalDenom && denomInfo?.length) {
          const usdDenomPrice =
            tokensPriceInfo[denomInfo[0]?.origin_denom]?.info?.["usd"] || 0;
          const balanceAmount = parseBalance(
            [balance],
            denomInfo[0].decimals,
            balance.denom
          );
          const usdDenomValue = balanceAmount * usdDenomPrice;
          sortedIBCChains = [
            ...sortedIBCChains,
            {
              usdValue: usdDenomValue,
              usdPrice: usdDenomPrice,
              balanceAmount: balanceAmount,
              chainName: chainName,
              denomInfo: denomInfo,
            },
          ];
        }
      });
    });

    sortedIBCChains.sort((x, y) => y.usdValue - x.usdValue);
    return sortedIBCChains;
  }, [chainIDs, networks, balanceChains, tokensPriceInfo]);

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const chainInfo = networks[chainID]?.network;
      const address = networks[chainID]?.walletInfo?.bech32Address;
      const denom =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;

      dispatch(
        getBalances({
          baseURL: chainInfo?.config?.rest,
          address: address,
          chainID: chainID,
        })
      );

      dispatch(
        getDelegations({
          baseURL: chainInfo.config.rest,
          address: address,
          chainID: chainID,
        })
      );

      dispatch(
        getDelegatorTotalRewards({
          baseURL: chainInfo.config.rest,
          address: address,
          chainID: chainID,
          denom: denom,
        })
      );
    });
  }, []);

  const handleOnClick = (chainName) => {
    navigate(`/${chainName}/overview`);
  };

  const {
    totalBalance: totalAvailableAmount,
    totalIBCBalance: totalIBCAssetsAmount,
  } = useMemo(
    () => calculateTotalAvailableAmount(),
    [calculateTotalAvailableAmount]
  );
  const totalStakedAmount = useMemo(
    () => calculateTotalStakedAmount(),
    [calculateTotalStakedAmount]
  );
  const totalPendingAmount = useMemo(
    () => calculateTotalPendingAmount(),
    [calculateTotalPendingAmount]
  );

  const sortedChainIds = useMemo(
    () => getSortedChainIds(),
    [getSortedChainIds]
  );

  const ibcSortedChains = useMemo(
    () => getIBCSortedCHainIds(),
    [getIBCSortedCHainIds]
  );

  return (
    <Paper sx={{ p: 2, mt: 2 }} elevation={0}>
      <Grid
        container
        sx={{
          mb: 2,
        }}
        spacing={1}
      >
        <Grid item xs={6} md={3}>
          <Card elevation={0}>
            <CardContent>
              <Typography
                align="left"
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                Total Available Balance
              </Typography>
              <Typography align="left" variant="h6" color="text.primary">
                ${formatNumber(totalAvailableAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card elevation={0}>
            <CardContent>
              <Typography
                align="left"
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                Total Staked Balance
              </Typography>
              <Typography align="left" variant="h6" color="text.primary">
                ${formatNumber(totalStakedAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card elevation={0}>
            <CardContent>
              <Typography
                align="left"
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                Total Rewards
              </Typography>
              <Typography align="left" variant="h6" color="text.primary">
                ${formatNumber(totalPendingAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card elevation={0}>
            <CardContent>
              <Typography
                align="left"
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                Total Wallet Balance
              </Typography>
              <Typography align="left" variant="h6" color="text.primary">
                $
                {formatNumber(
                  totalAvailableAmount +
                    totalStakedAmount +
                    totalPendingAmount +
                    totalIBCAssetsAmount
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", mb: 1 }}>
        <Button
          variant={assetType === "native" ? "contained" : "outlined"}
          onClick={() => {
            setAssetType("native");
          }}
          sx={{ borderRadius: 10, height: "24px" }}
          disableElevation
        >
          Native
        </Button>
        <Button
          variant={assetType === "ibc" ? "contained" : "outlined"}
          onClick={() => {
            setAssetType("ibc");
          }}
          sx={{ borderRadius: 10, height: "24px", ml: 1 }}
          disableElevation
        >
          IBC
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <StyledTableRow>
              {assetType === "native" ? (
                <>
                  <StyledTableCell sx={paddingTopBottom}>
                    Network Name
                  </StyledTableCell>
                  <StyledTableCell sx={paddingTopBottom}>
                    Available Balance
                  </StyledTableCell>
                  <StyledTableCell sx={paddingTopBottom}>
                    Staked Amount
                  </StyledTableCell>
                  <StyledTableCell sx={paddingTopBottom}>
                    Rewards
                  </StyledTableCell>
                </>
              ) : null}
              {assetType === "ibc" ? (
                <>
                  <StyledTableCell sx={paddingTopBottom}>
                    IBC Assets
                  </StyledTableCell>
                  <StyledTableCell sx={paddingTopBottom}>Value</StyledTableCell>
                </>
              ) : null}
              <StyledTableCell sx={paddingTopBottom}>Price</StyledTableCell>
              {assetType === "native" ? (
                <>
                  <StyledTableCell sx={paddingTopBottom}>
                    &nbsp;Actions
                  </StyledTableCell>
                </>
              ) : null}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {assetType === "native" ? (
              sortedChainIds.map((chainID) => (
                <ChainDetails
                  key={chainID}
                  chainID={chainID}
                  chainName={chainIdToNames[chainID]}
                  assetType={assetType}
                />
              ))
            ) : ibcSortedChains.length ? (
              ibcSortedChains.map((ibcAssetInfo) => (
                <StyledTableRow
                  key={
                    ibcAssetInfo.chainName +
                    ibcAssetInfo.denomInfo[0].origin_denom
                  }
                >
                  <StyledTableCell size="small">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={ibcChainLogoUrl + ibcAssetInfo.denomInfo[0]?.image}
                        sx={{
                          width: 28,
                          height: 28,
                          "&:hover": {
                            backgroundColor: "white",
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => handleOnClick(ibcAssetInfo.chainName)}
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
                          onClick={() => handleOnClick(ibcAssetInfo.chainName)}
                        >
                          <Typography sx={{ display: "inline" }}>
                            {ibcAssetInfo.balanceAmount.toLocaleString()}
                            &nbsp;
                          </Typography>
                          <Typography
                            sx={{ display: "inline", fontWeight: 600 }}
                          >
                            {ibcAssetInfo.denomInfo[0]?.symbol}
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
                          onClick={() => handleOnClick(ibcAssetInfo.chainName)}
                        >
                          On {ibcAssetInfo.chainName}
                        </Typography>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    {ibcAssetInfo.usdPrice
                      ? `$${parseFloat(
                          ibcAssetInfo.usdPrice * ibcAssetInfo.balanceAmount
                        ).toFixed(2)}`
                      : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {ibcAssetInfo.usdPrice
                      ? `$${parseFloat(ibcAssetInfo.usdPrice).toFixed(2)}`
                      : "N/A"}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
