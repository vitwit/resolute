import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getDelegations } from "../../../features/staking/stakeSlice";
import { getBalances } from "../../../features/bank/bankSlice";
import { getDelegatorTotalRewards } from "../../../features/distribution/distributionSlice";
import { useDispatch, useSelector } from "react-redux";
import { ChainDetails } from "./ChainDetails";
import {
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
import { parseBalance } from "../../../utils/denom";
import { ButtonGroup } from "@mui/material";
import { Button } from "@mui/material";

export const ChainsOverview = ({ chainNames }) => {
  const dispatch = useDispatch();
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
      if (balanceChains?.[chainID]?.list?.length > 0) {
        totalBalance += convertToDollars(denom, balance);
      }
    });
    return totalBalance;
  }, [chainIDs, balanceChains, networks]);

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const chainInfo = networks[chainID]?.network;
      const address = networks[chainID]?.walletInfo?.bech32Address;

      dispatch(
        getBalances({
          baseURL: chainInfo?.config?.rest + "/",
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
        })
      );
    });
  }, []);

  const totalAvailableAmount = useMemo(
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

  const formatNumber = (number) => {
    return (
      number?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) || "N/A"
    );
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }} elevation={0}>
      <Grid
        container
        sx={{
          mb: 2,
        }}
        spacing={1}
      >
        <Grid item xs={6} md={4}>
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
        <Grid item xs={6} md={4}>
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
        <Grid item xs={6} md={4}>
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
      </Grid>

      <Box
        sx={{ display: "flex", mb: 1 }}
      >
        <Button
          variant={assetType === "native" ? "contained" : "outlined"}
          onClick={() => {
            setAssetType("native");
          }}
          sx={{borderRadius: 10}}
          disableElevation
        >
          Native
        </Button>
        <Button
          variant={assetType === "ibc" ? "contained" : "outlined"}
          onClick={() => {
            setAssetType("ibc");
          }}
          sx={{borderRadius: 10, ml: 1}}
          disableElevation
        >
          IBC
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Network Name</StyledTableCell>
              <StyledTableCell>Available Balance</StyledTableCell>
              {assetType === "native" ? (
                <>
                  <StyledTableCell>Staked Amount</StyledTableCell>
                  <StyledTableCell>Rewards</StyledTableCell>
                </>
              ) : null}
              <StyledTableCell>Price</StyledTableCell>
              {assetType === "native" ? (
                <>
                  <StyledTableCell>&nbsp;Actions</StyledTableCell>
                </>
              ) : null}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {chainIDs.map((chainID) => (
              <ChainDetails
                key={chainID}
                chainID={chainID}
                chainName={chainIdToNames[chainID]}
                assetType={assetType}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
