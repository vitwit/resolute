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
  Button,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import { parseBalance } from "../../utils/denom";

export const GeneralOverview = (props) => {
  const { chainNames } = props;
  const dispatch = useDispatch();
  const networks = useSelector((state) => state.wallet.networks);
  const stakingChains = useSelector((state) => state.staking.chains);
  const distributionChains = useSelector((state) => state.distribution.chains);
  const balanceChains = useSelector((state) => state.bank.balances);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const tokensPriceInfo = useSelector(
    (state) => state.common?.allTokensInfoState?.info
  );

  const [totalAvailableAmount, setTotalAvailableAmount] = useState(0.0);
  const [totalStakedAmount, setTotalStakedAmount] = useState(0.0);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0.0);

  const chainIDs = [];
  chainNames.forEach((chainName) => chainIDs.push(nameToChainIDs[chainName]));

  const chainIdToNames = {};
  for (let key in nameToChainIDs) {
    chainIdToNames[nameToChainIDs[key]] = key;
  }

  const convertToDollars = (denom, amount = 0) => {
    if (tokensPriceInfo[denom]) {
      let price = +tokensPriceInfo?.[denom]?.info?.["usd"] || 0;
      return amount * price;
    }

    return 0;
  };

  useEffect(() => {
    let totalStakedAmount = 0;
    chainIDs.forEach((chainID) => {
      const staked = stakingChains?.[chainID]?.delegations?.totalStaked || 0;
      if (staked > 0) {
        let denom =
          networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;
        const decimals =
          networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
          0;
        totalStakedAmount += convertToDollars(denom, staked / (10 ** decimals));
      }
    });
    setTotalStakedAmount(totalStakedAmount);
  }, [stakingChains]);

  useEffect(() => {
    let totalRewards = 0;
    chainIDs.forEach((chainID) => {
      const rewards =
        distributionChains?.[chainID]?.delegatorRewards?.totalRewards || 0;
      if (rewards > 0) {
        const denom =
          networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;
        const decimals =
          networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
          0;
        totalRewards += convertToDollars(denom, rewards / 10 ** decimals);
      }
    });
    setTotalPendingAmount(totalRewards);
  }, [distributionChains]);

  useEffect(() => {
    let totalBalance = 0;
    chainIDs.forEach((chainID) => {
      const decimals =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
        0;
      const denom =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;
      const balance = parseBalance(balanceChains?.[chainID]?.list || [], decimals, denom);
      if (balanceChains?.[chainID]?.list?.length > 0) {
        totalBalance += convertToDollars(denom, balance);
      }
    });
    setTotalAvailableAmount(totalBalance);
  }, [balanceChains]);

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
                fontWeight={500}
              >
                Total Available Balance
              </Typography>
              <Typography align="left" variant="h6" color="text.primary">
                ${totalAvailableAmount?.toLocaleString(
                  undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }
                )}
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
                fontWeight={500}
              >
                Total Staked Balance
              </Typography>
              <Typography align="left" variant="h6" color="text.primary">
                ${parseFloat(totalStakedAmount)?.toLocaleString(
                  undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }
                )}
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
                fontWeight={500}
              >
                Total Rewards
              </Typography>
              <Typography align="left" variant="h6" color="text.primary">
                ${parseFloat(totalPendingAmount)?.toLocaleString(
                  undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <TableContainer>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Network Name</StyledTableCell>
              <StyledTableCell>Available Balance</StyledTableCell>
              <StyledTableCell>Staked Amount</StyledTableCell>
              <StyledTableCell>Rewards</StyledTableCell>
              <StyledTableCell>&nbsp;Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {
              chainIDs.map((chainID) => (
                <ChainDetails
                  key={chainID}
                  chainID={chainID}
                  chainName={chainIdToNames[chainID]}
                />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
