import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBalance } from "../features/bank/bankSlice";
import BalanceInfo from "../components/BalanceInfo";
import { getDelegations, getUnbonding } from "../features/staking/stakeSlice";
import { getDelegatorTotalRewards } from "../features/distribution/distributionSlice";
import { parseBalance } from "../utils/denom";
import {
  shortenAddress,
  shortenPubKey,
  totalDelegations,
  totalRewards,
  totalUnbonding,
} from "../utils/util";
import { Chip, Grid, Paper, Typography } from "@mui/material";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import { resetError, setError } from "../features/common/commonSlice";
import { Box } from "@mui/system";

export default function Overview() {
  const wallet = useSelector((state) => state.wallet);
    const {config} = chainInfo;
  const { chainInfo, connected, address } = wallet;
  const balance = useSelector((state) => state.bank.balance);
  const delegations = useSelector((state) => state.staking.delegations);
  const rewards = useSelector((state) => state.distribution.delegatorRewards);
  const unbonding = useSelector((state) => state.staking.unbonding);

  const selectedAuthz = useSelector((state) => state.authz.selected);

  const [available, setTotalBalance] = useState(0);
  const [delegated, setTotalDelegations] = useState(0);
  const [pendingRewards, setTotalRewards] = useState(0);
  const [unbondingDel, setTotalUnbonding] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (connected && chainInfo.config.currencies.length > 0) {
      setTotalBalance(
        totalBalance(
          balance.balance,
          chainInfo.config.currencies[0].coinDecimals
        )
      );
      setTotalDelegations(
        totalDelegations(
          delegations.delegations,
          chainInfo.config.currencies[0].coinDecimals
        )
      );
      setTotalRewards(
        totalRewards(rewards?.list, chainInfo.config.currencies[0].coinDecimals)
      );
      setTotalUnbonding(
        totalUnbonding(
          unbonding.delegations,
          chainInfo.config.currencies[0].coinDecimals
        )
      );
    }
  }, [balance, delegations, rewards, unbonding, chainInfo, address]);

  useEffect(() => {
    if (connected && selectedAuthz.granter.length === 0) {
      if (address.length > 0 && chainInfo.config.currencies.length > 0) {
        fetchDetails(address);
      }
    }
  }, [address]);

  useEffect(() => {
    if (selectedAuthz.granter.length > 0) {
      fetchDetails(selectedAuthz.granter);
    } else if (address?.length > 0) {
      fetchDetails(address);
    }
  }, [selectedAuthz]);

  const fetchDetails = (address) => {
    dispatch(
      getBalance({
        baseURL: chainInfo.config.rest,
        address: address,
        denom: chainInfo.config.currencies[0].coinMinimalDenom,
      })
    );

    dispatch(
      getDelegations({
        baseURL: chainInfo.config.rest,
        address: address,
      })
    );

    dispatch(
      getDelegatorTotalRewards({
        baseURL: chainInfo.config.rest,
        address: address,
      })
    );

    dispatch(
      getUnbonding({
        baseURL: chainInfo.config.rest,
        address: address,
      })
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      function () {
        dispatch(
          setError({
            type: "success",
            message: "Copied to clipboard",
          })
        );
        setTimeout(() => {
          dispatch(resetError());
        }, 1000);
      },
      function (err) {
        dispatch(
          setError({
            type: "error",
            message: "Failed to copy",
          })
        );
        setTimeout(() => {
          dispatch(resetError());
        }, 1000);
      }
    );
  };

  return (
    <>
      {connected ? (
        <>
          <Box
            component="div"
            sx={{
              textAlign: "left",
            }}
          >
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={600}
              gutterBottom
            >
              Account Info
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              pl: 3,
              pr: 3,
              pt: 2,
              pb: 2,
              textAlign: "left",
            }}
          >
            <Grid container>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={600}
                  gutterBottom
                >
                  Address
                </Typography>
                <Chip
                  label={wallet.address}
                  size="small"
                  deleteIcon={<ContentCopyOutlined />}
                  onDelete={() => {
                    copyToClipboard(wallet.address);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={600}
                  gutterBottom
                >
                  Public Key
                </Typography>
                <Chip
                  label={wallet.pubKey ? wallet.pubKey : ""}
                  size="small"
                  deleteIcon={<ContentCopyOutlined />}
                  onDelete={() => {
                    copyToClipboard(wallet.pubKey);
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Box
            component="div"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={600}
              gutterBottom
            >
              Assets
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 0,
                    p: 2,
                    textAlign: "left",
                    minHeight: 200,
                  }}
                >
                  <Typography sx={{justifyContent: 'center'}} variant='h6' color='text.secondary'>
                  Coming Soon
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 0,
                    pt: 2,
                    pb: 2,
                    pl: 3,
                    pr: 3,
                    textAlign: "left",
                  }}
                >
                  <Typography color="primary" fontWeight={600} variant="body1">
                    {chainInfo.config.currencies[0].coinDenom}
                  </Typography>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                    }}
                  >
                    <li
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                        gutterBottom
                      >
                        Available
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color="text.primary"
                      >
                        {available}
                      </Typography>
                    </li>
                    <li
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                        gutterBottom
                      >
                        Delegated
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color="text.primary"
                      >
                        {delegated}
                      </Typography>
                    </li>
                    <li
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                        gutterBottom

                      >
                        Rewards
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color="text.primary"
                      >
                        {pendingRewards}
                      </Typography>
                    </li>
                    <li
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                        gutterBottom
                      >
                        Unbonding
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color="text.primary"
                      >
                        {unbondingDel}
                      </Typography>
                    </li>
                    <li>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                        gutterBottom
                      >
                        Total
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color="text.primary"
                      >
                        {unbondingDel}
                      </Typography>
                    </li>
                  </ul>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          <BalanceInfo
            chainInfo={chainInfo}
            balance={available}
            delegations={delegated}
            rewards={pendingRewards}
            unbonding={unbondingDel}
            currencies={chainInfo.config.currencies}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
