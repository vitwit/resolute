import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBalances } from "../../../features/bank/bankSlice";
import { getDelegations, getUnbonding } from "../../../features/staking/stakeSlice";
import { getDelegatorTotalRewards } from "../../../features/distribution/distributionSlice";
import { parseBalance } from "../../../utils/denom";
import {
  shortenAddress,
  shortenPubKey,
  totalRewards,
  totalUnbonding,
} from "../../../utils/util";
import { Button, Chip, Grid, Paper, Typography } from "@mui/material";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import { Box } from "@mui/system";
import { getAccountInfo } from "../../../features/auth/slice";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { copyToClipboard } from "../../../utils/clipboard";
import { getTokenPrice } from "../../../features/common/commonSlice";
import Assets from "./Assets";
import { CopyToClipboard } from "../../../components/CopyToClipboard";

export default function Overview(props) {
  const { chainID, chainName } = props;
  const wallet = useSelector((state) => state.wallet);
  const { connected } = wallet;
  const address = wallet.networks[chainID].walletInfo.bech32Address;
  const chainInfo = wallet.networks[chainID].network;
  const pubkey = wallet.networks[chainID].walletInfo.pubKey;
  const balance = useSelector((state) => state.bank.balances);
  const delegations = useSelector(
    (state) => state.staking.chains[chainID].delegations
  );
  const rewards = useSelector(
    (state) => state.distribution.chains[chainID].delegatorRewards
  );
  const unbonding = useSelector(
    (state) => state.staking.chains[chainID].unbonding
  );
  const account = useSelector((state) => state.auth.accountInfo);
  const priceInfo = useSelector((state) => state.common.tokensInfoState.info);
  const selectedAuthz = useSelector((state) => state.authz.selected);
  const { config } = chainInfo;
  const coinDecimals = config?.currencies[0].coinDecimals || 0;
  const coinDenom = config?.currencies[0].coinMinimalDenom || "";
  const dispatch = useDispatch();
  const [available, setTotalBalance] = useState(0);
  const [delegated, setTotalDelegations] = useState(0);
  const [pendingRewards, setTotalRewards] = useState(0);
  const [unbondingDel, setTotalUnbonding] = useState(0);

  useEffect(() => {
    if (connected && config.currencies.length > 0) {
      setTotalBalance(
        parseBalance(balance?.[chainID]?.list || [], coinDecimals, coinDenom)
      );
      setTotalDelegations(delegations.totalStaked / 10.0 ** coinDecimals);
      setTotalRewards(totalRewards(rewards?.list, coinDecimals, coinDenom));
      setTotalUnbonding(totalUnbonding(unbonding.delegations, coinDecimals));
    }
  }, [balance, delegations, rewards, unbonding, chainInfo, address]);

  useEffect(() => {
    if (connected && selectedAuthz.granter.length === 0) {
      if (address.length > 0 && config.currencies.length > 0) {
        fetchDetails(address, chainID);
      }
    }
  }, [address]);

  useEffect(() => {
    if (selectedAuthz.granter.length > 0) {
      fetchDetails(selectedAuthz.granter, chainID);
    } else if (address?.length > 0) {
      fetchDetails(address, chainID);
    }
  }, [selectedAuthz]);

  const fetchDetails = (address, chainID) => {
    dispatch(
      getAccountInfo({
        baseURL: config.rest,
        address: address,
      })
    );

    dispatch(
      getBalances({
        baseURL: config.rest,
        address: address,
        chainID: chainID,
      })
    );

    dispatch(
      getDelegations({
        chainID: chainID,
        baseURL: config.rest,
        address: address,
      })
    );

    dispatch(
      getDelegatorTotalRewards({
        chainID: chainID,
        baseURL: config.rest,
        address: address,
        denom: coinDenom,
      })
    );

    dispatch(
      getUnbonding({
        chainID: chainID,
        baseURL: config.rest,
        address: address,
      })
    );

    dispatch(getTokenPrice(coinDenom));
  };

  const navigate = useNavigate();

  return (
    <>
      {connected ? (
        <>
          <AccountInfo
            account={account}
            address={address}
            pubkey={pubkey}
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
              <Box>
                <Button
                  sx={{
                    mb: 1,
                    ml: 2,
                    textTransform: "none",
                  }}
                  variant="contained"
                  disableElevation
                  size="small"
                  onClick={() => navigate(`/${chainName}/transfers`)}
                >
                  Send
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 0,
                    p: 2,
                    textAlign: "center",
                    minHeight: 280,
                  }}
                >
                  <Assets balances={balance?.[chainID]?.list} chainName={chainName} currentChainDenom={coinDenom} />
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
                    minHeight: 280,
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
                        {getDisplayAmount(
                          available,
                          chainInfo?.config?.currencies[0].coinDecimals
                        )}
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
                        {getDisplayAmount(
                          delegated,
                          chainInfo?.config?.currencies[0].coinDecimals
                        )}
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
                        {getDisplayAmount(
                          pendingRewards,
                          chainInfo?.config?.currencies[0].coinDecimals
                        )}
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
                        {getDisplayAmount(
                          unbondingDel,
                          chainInfo?.config?.currencies[0].coinDecimals
                        )}
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
                    {priceInfo?.info?.usd ? (
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
                          Total value
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            color="text.primary"
                          >
                            &#36;
                            {(
                              priceInfo?.info?.usd *
                              parseFloat(
                                parseFloat(available) +
                                parseFloat(delegated) +
                                parseFloat(pendingRewards) +
                                parseFloat(unbondingDel)
                              ).toFixed(2)
                            ).toLocaleString()}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="text.secondary"
                            sx={{
                              textAlign: "right",
                            }}
                          >
                            &#36;{priceInfo?.info?.usd}
                          </Typography>
                        </div>
                      </li>
                    ) : null}
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
  const { account, address, pubkey } = props;
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
            <CopyToClipboard message={address}/>
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
              label={pubkey ? shortenPubKey(pubkey, 24) : "-"}
              size="small"
              deleteIcon={<ContentCopyOutlined />}
              onDelete={() => {
                props.onCopy(pubkey);
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
  account: PropTypes.object.isRequired,
  onCopy: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
};

const getDisplayAmount = (amount, decimals) => {
  if (decimals > 6) {
    return parseFloat(amount)?.toFixed(6).toLocaleString() || 0;
  } else {
    return parseFloat(amount)?.toLocaleString() || 0;
  }
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
    case "/ethermint.types.v1.EthAccount": {
      return account?.base_account?.sequence || 0;
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
    case "/ethermint.types.v1.EthAccount": {
      return account?.base_account?.account_number || 0;
    }
    default:
      return 0;
  }
};
