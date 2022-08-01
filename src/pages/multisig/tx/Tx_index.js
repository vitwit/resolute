import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBalance } from "../../../features/bank/bankSlice";
import {
  getDelegations,
  getValidators,
} from "../../../features/staking/stakeSlice";
import List_txs from "./List_txs";
import DialogCreateMultisigTx from "../../../components/DialogCreateMultisigTx";
import { fetchSingleMultiAccount } from "../../../features/multisig/multisigSlice";
import { shortenAddress } from "../../../utils/util";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import Chip from "@mui/material/Chip";
import { resetError, setError } from "../../../features/common/commonSlice";

export default function Tx_index() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { address: multisigAddress } = useParams();
  const multisigAccountDetails = useSelector(
    (state) => state.multisig.multisigAccount
  );
  const multisigAccount = multisigAccountDetails?.data?.data || {};
  const multisigBal = useSelector((state) => state.bank.balance);
  const multisigDel = useSelector((state) => state.staking.delegations);
  const currency = useSelector(
    (state) => state.wallet.chainInfo?.config?.currencies[0]
  );
  const [totalStake, setTotalStaked] = useState(0);

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
      function () {
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

  useEffect(() => {
    let delegations = multisigDel?.delegations || [];
    let total = 0.0;
    if (delegations.length > 0) {
      for (let i = 0; i < delegations.length; i++)
        total +=
          parseFloat(delegations[i].delegation.shares) /
          10 ** currency?.coinDecimals;
    }
    setTotalStaked(total?.toFixed(6));
  }, [multisigDel]);

  const wallet = useSelector((state) => state.wallet);
  const { chainInfo, address, connected } = wallet;

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(fetchSingleMultiAccount(multisigAddress));
  }, []);

  useEffect(() => {
    if (connected) {
      dispatch(
        getBalance({
          baseURL: chainInfo.config.rest,
          address: multisigAddress,
          denom: chainInfo?.config?.currencies[0].coinMinimalDenom,
        })
      );

      dispatch(
        getValidators({
          baseURL: chainInfo.config.rest,
          status: null,
        })
      );

      dispatch(
        getDelegations({
          baseURL: chainInfo.config.rest,
          address: multisigAddress,
        })
      );
    }
  }, [chainInfo]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          p: 1,
          pl: 2,
          pr: 2,
        }}
      >
        <Typography
          variant="h6"
          color="text.primary"
          fontWeight={600}
          gutterBottom
        >
          Multisig Account Information
        </Typography>

        <Grid
          container
          sx={{
            textAlign: "left",
            p: 1,
          }}
          spacing={4}
        >
          <Grid item sx={6} md={3}>
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={500}
              gutterBottom
            >
              Account
            </Typography>
            <Typography>
              <Chip
                label={
                  multisigAccount?.address
                    ? shortenAddress(multisigAccount?.address, 24)
                    : ""
                }
                size="small"
                deleteIcon={<ContentCopyOutlined />}
                onDelete={() => {
                  copyToClipboard(multisigAccount?.address);
                }}
              />
            </Typography>
          </Grid>
          <Grid item sx={6} md={3}>
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={500}
              gutterBottom
            >
              Threshold
            </Typography>
            <Typography>
              &nbsp;&nbsp;{multisigAccount?.pubkeyJSON?.value?.threshold || 0}
            </Typography>
          </Grid>
          <Grid item sx={6} md={3}>
            <Typography
              gutterBottom
              variant="body1"
              color="text.primary"
              fontWeight={500}
            >
              Available
            </Typography>
            <Typography>
              {multisigBal?.balance?.amount / 10 ** currency?.coinDecimals || 0}{" "}
              &nbsp;
              {currency?.coinDenom}
            </Typography>
          </Grid>
          <Grid item sx={6} md={3}>
            <Typography
              gutterBottom
              variant="body1"
              color="text.primary"
              fontWeight={500}
            >
              Staked
            </Typography>
            <Typography>
              {totalStake || 0} {currency?.coinDenom}
            </Typography>
          </Grid>
          <Grid item sx={12} md={12}>
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={500}
              gutterBottom
            >
              Signers
            </Typography>
            <Box component="div" sx={{}}>
              {multisigAccount?.pubkeyJSON?.value?.pubkeys?.map((p) => (
                <Chip
                  sx={{
                    ml: 0.5,
                    mr: 0.5,
                    mt: 1,
                  }}
                  label={p?.address ? shortenAddress(p.address, 24) : ""}
                  size="small"
                  deleteIcon={<ContentCopyOutlined />}
                  onDelete={() => {
                    copyToClipboard(p?.address);
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Transactions
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
          }}
        >
          <Button
            onClick={() => setOpen(true)}
            disableElevation
            variant="contained"
            sx={{
              textTransform: "none",
            }}
          >
            Create Transaction
          </Button>
        </Box>
        <List_txs address={multisigAddress} />
      </Paper>
      <DialogCreateMultisigTx open={open} handleClose={handleClose} />
    </>
  );
}
