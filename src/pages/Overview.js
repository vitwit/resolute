import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBalance } from "../features/bank/bankSlice";
import { getDelegations, getUnbonding } from "../features/staking/stakeSlice";
import { getDelegatorTotalRewards } from "../features/distribution/distributionSlice";
import { parseBalance } from "../utils/denom";
import {
  shortenAddress,
  shortenPubKey,
  totalRewards,
  totalUnbonding,
} from "../utils/util";
import { Button, Chip, Grid, Paper, Typography } from "@mui/material";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import { Box } from "@mui/system";
import { getAccountInfo } from "../features/auth/slice";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { copyToClipboard } from "../utils/clipboard";

export default function Overview() {
  const wallet = useSelector((state) => state.wallet);
  const { chainInfo, connected, address } = wallet;
  const balance = useSelector((state) => state.bank.balance);
  const delegations = useSelector((state) => state.staking.delegations);
  const rewards = useSelector((state) => state.distribution.delegatorRewards);
  const unbonding = useSelector((state) => state.staking.unbonding);
  const account = useSelector((state) => state.auth.accountInfo);

  const selectedAuthz = useSelector((state) => state.authz.selected);

  const [available, setTotalBalance] = useState(0);
  const [delegated, setTotalDelegations] = useState(0);
  const [pendingRewards, setTotalRewards] = useState(0);
  const [unbondingDel, setTotalUnbonding] = useState(0);

  const dispatch = useDispatch();

  const { config } = chainInfo;
  const coinDecimals = config?.currencies[0].coinDecimals || 1;

  useEffect(() => {
    if (connected && config.currencies.length > 0) {
      setTotalBalance(
        parseBalance(
          [balance.balance],
          config.currencies[0].coinDecimals,
          config.currencies[0].coinMinimalDenom
        )
      );
      setTotalDelegations(
        delegations.totalStaked / 10.0 ** coinDecimals)
      setTotalRewards(
        totalRewards(rewards?.list, config.currencies[0].coinDecimals)
      );
      setTotalUnbonding(
        totalUnbonding(unbonding.delegations, config.currencies[0].coinDecimals)
      );
    }
  }, [balance, delegations, rewards, unbonding, chainInfo, address]);

  useEffect(() => {
    if (connected && selectedAuthz.granter.length === 0) {
      if (address.length > 0 && config.currencies.length > 0) {
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
      getAccountInfo({
        baseURL: config.rest,
        address: address,
      })
    );

    dispatch(
      getBalance({
        baseURL: config.rest,
        address: address,
        denom: chainInfo.config.currencies[0].coinMinimalDenom,
      })
    );

    dispatch(
      getDelegations({
        baseURL: config.rest,
        address: address,
      })
    );

    dispatch(
      getDelegatorTotalRewards({
        baseURL: config.rest,
        address: address,
      })
    );

    dispatch(
      getUnbonding({
        baseURL: config.rest,
        address: address,
      })
    );
  };

  const navigate = useNavigate();

  return (
    <>
      {connected ? (
        <>
          <AccountInfo
            wallet={wallet}
            account={account}
            onCopy={(msg) => {
              copyToClipboard(msg, dispatch);
            }}
          />
          <Box
            component="div"
            sx={{
              textAlign: "left",
              p: 2,
            }}
          >
            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
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
              <Button
                sx={{
                  mb: 1,
                  textTransform: "none",
                }}
                variant="contained"
                disableElevation
                size="small"
                onClick={() => navigate("/send")}
              >
                Send
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 0,
                    p: 2,
                    textAlign: "center",
                    minHeight: 250,
                  }}
                >
                  <Typography
                    sx={{ justifyContent: "center" }}
                    variant="h6"
                    color="text.secondary"
                  >
                    Coming soon
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
                    minHeight: 250,
                  }}
                >
                  <Typography color="primary" fontWeight={600} variant="body1">
                    {config.currencies[0].coinDenom}
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
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        Available
                      </Typography>
                      <Typography
                        variant="body1"
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
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        Staked
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        color="text.primary"
                      >
                        {parseFloat(delegated)}
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
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        Rewards
                      </Typography>
                      <Typography
                        variant="body1"
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
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        Unbonding
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        color="text.primary"
                      >
                        {unbondingDel}
                      </Typography>
                    </li>
                    <hr />
                    <li
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 8,
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        Total
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {(
                          parseFloat(available) +
                          parseFloat(delegated) +
                          parseFloat(pendingRewards) +
                          parseFloat(unbondingDel)
                        ).toLocaleString()}
                      </Typography>
                    </li>
                  </ul>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <>
          <Typography
            variant="h5"
            color="text.primary"
            fontWeight={600}
            sx={{
              mt: 4,
            }}
          >
            Wallet not connected
          </Typography>
        </>
      )}
    </>
  );
}

const AccountInfo = (props) => {
  const { wallet, account } = props;
  return (
    <Box
      component="div"
      sx={{
        textAlign: "left",
        p: 2,
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
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          p: 3,
          textAlign: "left",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              mb: 1,
            }}
          >
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={600}
              gutterBottom
            >
              Address
            </Typography>
            <Chip
              label={shortenAddress(wallet.address, 24)}
              size="small"
              deleteIcon={<ContentCopyOutlined />}
              onDelete={() => {
                props.onCopy(wallet.address);
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              mb: 1,
            }}
          >
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={600}
              gutterBottom
            >
              Public Key
            </Typography>
            <Chip
              label={wallet.pubKey ? shortenPubKey(wallet.pubKey, 24) : "-"}
              size="small"
              deleteIcon={<ContentCopyOutlined />}
              onDelete={() => {
                props.onCopy(wallet.pubKey);
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              mb: 1,
            }}
          >
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={600}
              gutterBottom
            >
              Account Number
            </Typography>
            <Typography variant="body1" color="text.primary" gutterBottom>
              {getAccountNumber(account?.account)}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              mb: 1,
            }}
          >
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={600}
              gutterBottom
            >
              Sequence
            </Typography>
            <Typography variant="body1" color="text.primary" gutterBottom>
              {getSequence(account?.account)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

AccountInfo.propTypes = {
  wallet: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  onCopy: PropTypes.func.isRequired,
};



const getSequence = (account) => {
  switch (account["@type"]) {
    case "/cosmos.vesting.v1beta1.ContinuousVestingAccount": {
      return account?.base_vesting_account?.base_account?.sequence || 0;
    }
    case "/cosmos.auth.v1beta1.BaseAccount": {
      return account?.sequence || 0;
    }
    case "/cosmos.vesting.v1beta1.DelayedVestingAccount": {
      return account?.base_vesting_account?.base_account?.sequence || 0;
    }
    case "/cosmos.vesting.v1beta1.PeriodicVestingAccount": {
      return account?.base_vesting_account?.base_account?.sequence || 0;
    }
    case "/cosmos.vesting.v1beta1.PermanentLockedAccount": {
      return account?.base_vesting_account?.base_account?.sequence || 0;
    }
    default:
      return 0;
  }
};

const getAccountNumber = (account) => {
  switch (account["@type"]) {
    case "/cosmos.vesting.v1beta1.ContinuousVestingAccount": {
      return account?.base_vesting_account?.base_account?.account_number || 0;
    }
    case "/cosmos.auth.v1beta1.BaseAccount": {
      return account?.account_number || 0;
    }
    case "/cosmos.vesting.v1beta1.DelayedVestingAccount": {
      return account?.base_vesting_account?.base_account?.account_number || 0;
    }
    case "/cosmos.vesting.v1beta1.PeriodicVestingAccount": {
      return account?.base_vesting_account?.base_account?.account_number || 0;
    }
    case "/cosmos.vesting.v1beta1.PermanentLockedAccount": {
      return account?.base_vesting_account?.base_account?.account_number || 0;
    }
    default:
      return 0;
  }
};
