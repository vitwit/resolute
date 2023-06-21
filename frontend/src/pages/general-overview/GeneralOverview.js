import React, { useEffect, useState } from "react";
import { getDelegations } from "../../features/staking/stakeSlice";
import { getBalances } from "../../features/bank/bankSlice";
import { getDelegatorTotalRewards } from "../../features/distribution/distributionSlice";
import { useDispatch, useSelector } from "react-redux";
import { ChainDetails } from "./ChainDetails";
import {
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
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";

export const GeneralOverview = (props) => {
  const { chainIDs } = props;
  const dispatch = useDispatch();
  const networks = useSelector((state) => state.wallet.networks);
  const stakingChains = useSelector((state) => state.staking.chains);
  const distributionChains = useSelector((state) => state.distribution.chains);
  const balanceChains = useSelector((state) => state.bank.balances);
  const tokensPriceInfo = useSelector(
    (state) => state.common.allTokensInfoState.info
  );
  const [totalDetails, setTotalDetails] = useState({
    totalStaked: 0,
    totalBalance: 0,
    totalRewards: 0,
  });

  const convertToDollars = (denom, amount = 0) => {
    let price = +tokensPriceInfo?.[denom]?.info?.["usd"] || 0;
    return amount * price;
  };

  useEffect(() => {
    let totalStakedAmount = 0;
    chainIDs.forEach((chainID) => {
      let denom =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;
      let staked = stakingChains?.[chainID]?.delegations?.totalStaked || 0;
      const decimals =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
        0;
      totalStakedAmount += convertToDollars(denom, staked / 10 ** decimals);
    });
    setTotalDetails({
      totalBalance: totalDetails.totalBalance,
      totalStaked: totalStakedAmount.toLocaleString(),
      totalRewards: totalDetails.totalRewards,
    });
  }, [stakingChains]);

  useEffect(() => {
    let totalRewards = 0;
    chainIDs.forEach((chainID) => {
      let denom =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;
      let rewards =
        distributionChains?.[chainID]?.delegatorRewards?.totalRewards || 0;
      const decimals =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
        0;
      totalRewards += convertToDollars(denom, rewards / 10 ** decimals);
    });
    setTotalDetails({
      totalBalance: totalDetails.totalBalance,
      totalStaked: totalDetails.totalStaked,
      totalRewards: totalRewards.toLocaleString(),
    });
  }, [distributionChains]);

  useEffect(() => {
    let totalBalance = 0;
    chainIDs.forEach((chainID) => {
      let denom =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;
      let balance = balanceChains?.[chainID]?.list?.[0]?.amount || 0;
      const decimals =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
        0;
      totalBalance += convertToDollars(denom, balance / 10 ** decimals);
    });
    setTotalDetails({
      totalBalance: totalBalance.toLocaleString(),
      totalStaked: totalDetails.totalStaked,
      totalRewards: totalDetails.totalRewards,
    });
  }, [balanceChains]);

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const chainInfo = networks[chainID]?.network;
      const address = networks[chainID]?.walletInfo.bech32Address;

      dispatch(
        getBalances({
          baseURL: chainInfo.config.rest + "/",
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

  return (
    <Paper sx={{ padding: 1, margin: 0, mt: 6 }} elevation={0}>
      <Grid
        container
        sx={{
          mb: 3,
        }}
        spacing={1}
      >
        <Grid item xs={4} md={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography
                sx={{ fontSize: 17 }}
                align="left"
                variant="h6"
                color="text.secondary"
              >
                Total Available Balance
              </Typography>
              <Typography align="left" variant="h6" color="text.primary">
                ${totalDetails.totalBalance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4} md={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography
                sx={{ fontSize: 17 }}
                align="left"
                variant="h6"
                color="text.secondary"
              >
                Total Staked Balance
              </Typography>
              <Typography align="left" variant="h6" color="text.primary">
                ${totalDetails.totalStaked}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4} md={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography
                sx={{ fontSize: 17 }}
                align="left"
                variant="h6"
                color="text.secondary"
              >
                Total Rewards
              </Typography>
              <Typography align="left" variant="h6" color="text.primary">
                ${totalDetails.totalRewards}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Network Name</StyledTableCell>
              <StyledTableCell>Available Balance</StyledTableCell>
              <StyledTableCell>Staked Amount</StyledTableCell>
              <StyledTableCell>Rewards</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {chainIDs.map((chainID) => (
              <ChainDetails key={chainID} chainID={chainID} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
