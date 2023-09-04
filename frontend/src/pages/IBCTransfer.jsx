import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { getIBCChainsInfo } from "../utils/chainDenoms";
import { txIBCTransfer } from "../features/ibc/ibcSlice";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setError } from "../features/common/commonSlice";
import { getBalances } from "../features/bank/bankSlice";
import { Controller } from "react-hook-form";

export const IBCTransfer = () => {
  const [chainName, setChainName] = useState("cosmoshub");
  const [destinationChain, setDestinationChain] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      chainName: "cosmoshub",
      destinationChain: null,
      selectedAsset: null,
      recipient: null,
      amount: null
    }
  })

  const dispatch = useDispatch();

  const nameTochainIDs = useSelector(
    (state) => state?.wallet?.nameToChainIDs || {},
    shallowEqual
  );
  const chainID = nameTochainIDs?.[chainName.toLowerCase()];
  const chainWallet = useSelector((state) => state.wallet?.networks?.[chainID]);
  const feegrant = useSelector(
    (state) => state.common.feegrant?.[chainName] || {}
  );
  const totalBalances = useSelector(
    (state) => state.bank.balances,
    shallowEqual
  );
  const networks = useSelector((state) => state.wallet.networks);

  const IBCInfo = useMemo(
    () => getIBCChainsInfo(totalBalances, nameTochainIDs),
    [totalBalances, nameTochainIDs]
  );
  const address = chainWallet?.walletInfo?.bech32Address;
  const chainInfo = chainWallet?.network;

  const txIBCStatus = useSelector(
    (state) => state.ibc.chains?.[chainID]?.status || ""
  );

  useEffect(() => {
    Object.values(nameTochainIDs).forEach((chainID) => {
      const chainInfo = networks?.[chainID]?.network;
      const address = networks?.[chainID]?.walletInfo?.bech32Address;
      dispatch(
        getBalances({
          baseURL: chainInfo?.config?.rest + "/",
          address: address,
          chainID: chainID,
        })
      );
    });
  }, [networks, nameTochainIDs]);

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
          amount: amount * 10 ** Number(selectedAsset?.["decimals"]),
          assetMinimalDenom: selectedAsset?.["denom"],
          sourcePort: destinationChain?.["port"],
          sourceChannel: destinationChain?.["channel"],
          chainID: chainID,
          rest: chainInfo?.config?.rest,
          rpc: chainInfo?.config?.rpc,
          aminoConfig: chainInfo?.aminoConfig,
          prefix: chainInfo?.config?.bech32Config?.bech32PrefixAccAddr,
          feeAmount:
            chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep?.average *
            10 ** chainInfo?.config?.currencies?.[0]?.coinDecimals,
          minimalDenom: chainInfo.config?.feeCurrencies?.[0]?.coinMinimalDenom,
          feegranter: feegrant?.granter,
        })
      );
    }
  };

  const onSubmit = (e) => {
    onIBCTransferTx();
  };

  return (
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
          <form onSubmit={() => handleSubmit(onSubmit)}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Controller 
                name={"from"}
                control={control}
                // rules={}
                render={({field}) => (
                  <Select
                  required
                  value={chainName}
                  label="select-network"
                  onChange={(e) => {
                    setChainName(e.target.value);
                    setDestinationChain("");
                    setSelectedAsset("");
                  }}
                >
                  {Object.keys(IBCInfo).map((chain) => (
                    <MenuItem value={chain} key={chain}>
                      {chain.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
                )}
              />

              <FormControl sx={{ width: "40%" }}>
                <InputLabel id="select-helper-label-right">To *</InputLabel>
                <Select
                  label="select-destination-chain"
                  value={destinationChain}
                  required
                  onChange={(e) => {
                    setDestinationChain(e.target.value);
                  }}
                >
                  {Object.keys(
                    IBCInfo?.[chainName]?.connectedChains || []
                  )?.map((connectedChain) => (
                    <MenuItem
                      value={
                        IBCInfo?.[chainName]?.connectedChains?.[connectedChain]
                      }
                    >
                      {" "}
                      {connectedChain.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                required
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={{ width: "40%" }}
              />
              <FormControl sx={{ width: "40%" }}>
                <InputLabel id="select-helper-label">Select Asset *</InputLabel>
                <Select
                  label="select-asset"
                  value={selectedAsset}
                  required
                  onChange={(e) => {
                    setSelectedAsset(e.target.value);
                  }}
                >
                  {Object.keys(IBCInfo?.[chainName].ownedAssets || [])?.map(
                    (assetDenom) => (
                      <MenuItem
                        value={IBCInfo?.[chainName]?.ownedAssets?.[assetDenom]}
                      >
                        {
                          IBCInfo?.[chainName]?.ownedAssets?.[assetDenom][
                            "symbol"
                          ]
                        }
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </div>
            <div>
              <TextField
                required
                label="recipient"
                fullWidth
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
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
                {txIBCStatus === "pending" ? (
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
    </div>
  );
};
