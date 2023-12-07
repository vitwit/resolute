import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import { Autocomplete, FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { getAllValidators } from "../../features/staking/stakeSlice";
import {
  getAllDelegators,
  resetDelegators,
} from "../../features/validator/validatorSlice";
import { multiTxns } from "../../features/bank/bankSlice";
import { SEND_TYPE_URL } from "../multisig/tx/utils";
import { parseCoins } from "@cosmjs/amino";
import { authzExecHelper } from "../../features/authz/authzSlice";
import { useParams } from "react-router-dom";

export default function DelegatorTransfer(props) {
  const {
    chainInfo,
    chainID,
    available,
    currentNetwork,
    isAuthzMode,
    grantsToMe,
    setGranter,
    granter,
    sendTx,
    authzTx,
  } = props;

  const currency = chainInfo?.config?.currencies[0];
  const delegators = useSelector(
    (state) => state.validator.chains[chainID]?.delegations
  );
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const from =
    networks[nameToChainIDs[currentNetwork]]?.walletInfo.bech32Address;
  const { handleSubmit, control, setValue, setError, watch } = useForm({
    defaultValues: {
      amount: 0,
      validator: "",
    },
  });

  const onSubmit = (data) => {
    if (data.amount <= 0) {
      setError("amount", "invalid amount");
    } else {
      const msgs = [];
      const delegatorsAddr = Object.keys(delegators.records);
      for (let i = 0; i < delegatorsAddr.length; i++) {
        const msg = {
          typeUrl: SEND_TYPE_URL,
          value: {
            fromAddress: isAuthzMode ? granter : from,
            toAddress: delegatorsAddr[i],
            amount: parseCoins(
              `${data.amount * 10 ** currency.coinDecimals}${
                currency.coinMinimalDenom
              }`
            ),
          },
        };
        msgs.push(msg);
      }

      if (!isAuthzMode) {
        dispatch(
          multiTxns({
            msgs: msgs,
            denom: currency.coinMinimalDenom,
            chainId: chainInfo.config.chainId,
            rest: chainInfo.config.rest,
            aminoConfig: chainInfo.aminoConfig,
            prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
            feeAmount:
              chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average *
              10 ** currency.coinDecimals,
            memo: "",
          })
        );
      } else {
        authzExecHelper(dispatch, {
          type: "validatorSend",
          msgs: msgs,
          denom: currency.coinMinimalDenom,
          chainId: chainInfo.config.chainId,
          rest: chainInfo.config.rest,
          aminoConfig: chainInfo.aminoConfig,
          prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
          feeAmount:
            chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average *
            10 ** currency.coinDecimals,
          feegranter: '',
        });
      }
    }
  };

  const dispatch = useDispatch();
  const baseURL = chainInfo?.config.rest;
  useEffect(() => {
    dispatch(
      getAllValidators({
        baseURL: baseURL,
        chainID: chainID,
        status: null,
      })
    );
  }, [chainInfo]);

  const validators = useSelector(
    (state) => state.staking.chains[chainID]?.validators
  );
  const { active, inactive } = validators || {
    active: [],
    inactive: [],
  };
  const targetValidators = parseValidators(active, inactive);

  function parseValidators(active, inactive) {
    let result = [];

    for (const v in active) {
      result = [...result, { addr: v, label: active[v]?.description?.moniker }];
    }

    for (const v in inactive) {
      result.push({
        addr: v,
        label: inactive[v].description.moniker,
      });
    }

    return result;
  }

  const fetchDelegators = (data) => {
    dispatch(
      resetDelegators({
        chainID: chainID,
      })
    );
    dispatch(
      getAllDelegators({
        baseURL: baseURL,
        chainID: chainID,
        validator: data?.addr,
        pagination: null,
      })
    );
  };

  const amount = watch("amount");

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
      }}
    >
      <Box>
        <Typography color="text.primary" variant="h6" fontWeight={600}>
          Send to delegators
        </Typography>
        {(validators?.status === "pending" ||
          delegators?.status === "pending") && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <CircularProgress size={20} />
            <Typography>
              &nbsp;
              {validators?.status === "pending"
                ? "Fetching validators..."
                : "Fetching delegators..."}
            </Typography>
          </Box>
        )}
      </Box>
      <Box
        noValidate
        autoComplete="off"
        sx={{
          "& .MuiTextField-root": { mt: 1.5, mb: 1.5 },
          mt: 2,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {isAuthzMode && grantsToMe?.length > 0 ? (
            <FormControl
              fullWidth
              sx={{
                mt: 1,
                mb: 3,
              }}
            >
              <InputLabel id="granter-label">From *</InputLabel>
              <Select
                labelId="granter-label"
                id="granter-select"
                value={granter}
                label="From *"
                onChange={(e) => {
                  setGranter(e.target.value);
                }}
                size="small"
                sx={{ p: 1 }}
              >
                {grantsToMe.map((granter, index) => (
                  <MenuItem id={index} value={granter}>
                    {granter}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}

          <div>
            <Controller
              name="validator"
              control={control}
              defaultValue={null}
              rules={{ required: "Validator is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Autocomplete
                  disablePortal
                  label="Validator"
                  value={value}
                  isOptionEqualToValue={(option, value) =>
                    option.addr === value.addr
                  }
                  options={targetValidators}
                  onChange={(event, item) => {
                    onChange(item);
                    fetchDelegators(item);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      placeholder="Select validator"
                      error={!!error}
                      helperText={error ? error.message : null}
                      label="Validator"
                    />
                  )}
                />
              )}
            />
          </div>
          <Typography
            variant="body2"
            color="text.primary"
            style={{ textAlign: "end" }}
            className="hover-link"
            onClick={() => setValue("amount", available)}
            sx={{
              mt: 2,
            }}
          >
            Available:&nbsp;{available}
            &nbsp;{currency?.coinDenom}
          </Typography>
          <Controller
            name="amount"
            control={control}
            rules={{ required: "Amount is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="Amount"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      {currency?.coinDenom}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          {delegators?.records &&
            Object.keys(delegators?.records).length > 0 &&
            amount > 0 && (
              <Box>
                <Typography>
                  Sending {amount}
                  {currency?.coinDenom} to{" "}
                  {Object.keys(delegators?.records).length} accounts
                </Typography>
              </Box>
            )}

          <div>
            <Button
              type="submit"
              variant="outlined"
              disableElevation
              disabled={
                sendTx.status === "pending" || authzTx.status === "pending"
              }
              sx={{
                textTransform: "none",
                mt: 2,
              }}
              size="medium"
            >
              {sendTx.status === "pending" || authzTx.status === "pending" ? (
                <>
                  <CircularProgress size={18} />
                  &nbsp;&nbsp;Please wait...
                </>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </form>
      </Box>
    </Paper>
  );
}

DelegatorTransfer.propTypes = {
  chainInfo: PropTypes.object.isRequired,
  available: PropTypes.number.isRequired,
  currentNetwork: PropTypes.string.isRequired,
  chainID: PropTypes.string.isRequired,
  sendTx: PropTypes.object.isRequired,
  authzTx: PropTypes.object.isRequired,
  isAuthzMode: PropTypes.bool.isRequired,
  grantsToMe: PropTypes.array.isRequired,
  setGranter: PropTypes.func.isRequired,
  granter: PropTypes.func.isRequired,
};
