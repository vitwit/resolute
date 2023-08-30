import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getIBCChains, getIBCBalances } from "../utils/chainDenoms";
import { txIBCTransfer } from "../features/ibc/ibcSlice";
import { useDispatch } from "react-redux";
import { setError } from "../features/common/commonSlice";

export const IBCTransfer = (props) => {
  const dispatch = useDispatch();
  const {
    networkName = "cosmoshub",
    balances,
    chainInfo,
    address,
    feegrant,
  } = props;
  const [destinationChain, setDestinationChain] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const IBCChains = getIBCChains(networkName);
  const IBCBalances = getIBCBalances(balances, networkName);

  const onIBCTransferTx = () => {
    if (
      Number(selectedAsset.amount) <
      amount + Number(25000 / 10 ** selectedAsset?.["decimals"])
    ) {
      dispatch(
        setError({
          type: "error",
          message: "Not enough balance",
        })
      );
    } else {
      dispatch(
        txIBCTransfer({
          from: address,
          to: recipient,
          amount: amount,
          assetMinimalDenom: selectedAsset["denom"],
          chainID: chainInfo.config.chainId,
          rest: chainInfo.config.rest,
          aminoConfig: chainInfo.aminoConfig,
          prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
          feeAmount:
            chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep?.average *
            10 ** chainInfo.config.currencies?.[0]?.coinDecimals,
          minimalDenom: chainInfo.config?.feeCurrencies?.[0]?.coinMinimalDenom,
          feegranter: feegrant?.granter,
        })
      );
    }
  };

  const handleSubmit = (e) => {
    onIBCTransferTx();
    e.preventDefault();
  };

  return IBCChains?.length ? (
    <div>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: "71%",
          mt: 2,
          mx: "auto",
        }}
      >
        <Box>
          <Typography color="text.primary" variant="h6" fontWeight={600}>
            IBC-Transfer
          </Typography>
        </Box>
        <Box
          noValidate
          autoComplete="off"
          sx={{
            "& .MuiTextField-root": { mt: 1.5, mb: 1.5 },
            mt: 2,
          }}
        >
          <form onSubmit={(e) => handleSubmit(e)}>
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}
            >
              <div style={{ flex: 8 }}>
                <TextField
                  required
                  label="Recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  fullWidth
                />
              </div>
              <div style={{ flex: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Select Network *
                  </InputLabel>
                  <Select
                    required
                    value={destinationChain}
                    label="select-network"
                    onChange={(e) => {
                      setDestinationChain(e.target.value);
                    }}
                  >
                    {IBCChains.map((IBCChain) => (
                      <MenuItem value={IBCChain}>
                        {IBCChain?.["origin_chain"].toUpperCase()} -{" "}
                        {IBCChain?.["symbol"]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div>
              <Typography
                variant="body2"
                color="text.primary"
                style={{ textAlign: "end", mt: 10 }}
                className="hover-link"
                onClick={() => {
                  if (selectedAsset != 0) {
                    setAmount(
                      selectedAsset.amount / 10 ** selectedAsset["decimals"]
                    );
                  }
                }}
              >
                Available:&nbsp;
                {selectedAsset === ""
                  ? 0
                  : selectedAsset.amount / 10 ** selectedAsset["decimals"]}
                &nbsp;{selectedAsset["symbol"]}
              </Typography>

              <TextField
                required
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        label="chain"
                        value={selectedAsset}
                        required
                        sx={{
                          boxShadow: "none",
                          ".MuiOutlinedInput-notchedOutline": { border: 0 },
                          fontWeight: 500,
                        }}
                        onChange={(e) => {
                          setSelectedAsset(e.target.value);
                        }}
                      >
                        {IBCBalances?.map((IBCBalanceInfo) => (
                          <MenuItem value={IBCBalanceInfo}>
                            {" "}
                            {IBCBalanceInfo["symbol"]}
                          </MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div>
              <Button
                type="submit"
                variant="outlined"
                disableElevation
                sx={{
                  textTransform: "none",
                  mt: 2,
                }}
                size="medium"
              >
                {"false" === "pending" ? (
                  <>
                    <CircularProgress size={18} />
                    &nbsp;&nbsp;Please wait...
                  </>
                ) : (
                  "Transfer"
                )}
              </Button>
            </div>
          </form>
        </Box>
      </Paper>
      IBCTransfer shut up {networkName}
      {JSON.stringify(IBCBalances)}
    </div>
  ) : (
    <Typography variant="h5" color="text.primary" sx={{ mt: 10 }}>
      Coming soon...
    </Typography>
  );
};
