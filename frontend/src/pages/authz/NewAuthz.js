import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Grid from "@mui/material/Grid";
import { authzMsgTypes } from "../../utils/authorizations";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { amountToMinimalValue } from "../../utils/util";
import {
  txAuthzGeneric,
  txAuthzSend,
  resetAlerts,
  resetTxAuthzSendRes,
  resetTxAuthzGenericRes,
} from "../../features/authz/authzSlice";
import {
  resetError,
  resetFeegrant,
  resetTxHash,
  setError,
} from "../../features/common/commonSlice";
import InputAdornment from "@mui/material/InputAdornment";
import { Typography, Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import FeegranterInfo from "../../components/FeegranterInfo";

export default function NewAuthz() {
  const params = useParams();

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const networks = useSelector((state) => state.wallet.networks);
  const [currentNetwork, setCurrentNetwork] = React.useState(
    params?.networkName || selectedNetwork.toLowerCase()
  );

  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const chainInfo = networks[nameToChainIDs[currentNetwork]]?.network;
  const address =
    networks[nameToChainIDs[currentNetwork]]?.walletInfo.bech32Address;
  const currency =
    networks[nameToChainIDs[currentNetwork]]?.network.config.currencies[0];

  const authzTx = useSelector((state) => state.authz.tx);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const grantsByMe = useSelector((state) => state.authz.grantsByMe);
  const dispatch = useDispatch();
  const feegrant = useSelector(
    (state) => state.common.feegrant?.[currentNetwork]
  );
  const txAuthzSendRes = useSelector((state) => state.authz.txAuthzSendRes);
  const txAuthzGenericRes = useSelector(
    (state) => state.authz.txAuthzGenericRes
  );

  useEffect(() => {
    if (grantsToMe.errMsg !== "" && grantsToMe.status === "rejected") {
      dispatch(
        setError({
          type: "error",
          message: grantsToMe.errMsg,
        })
      );
    }

    if (grantsByMe.errMsg !== "" && grantsByMe.status === "rejected") {
      dispatch(
        setError({
          type: "error",
          message: grantsByMe.errMsg,
        })
      );
    }
  }, [grantsByMe.errMsg, grantsToMe.errMsg]);

  const selectedAuthz = useSelector((state) => state.authz.selected);
  useEffect(() => {
    if (selectedAuthz.granter.length > 0) {
      dispatch(
        setError({
          type: "error",
          message: "Not supported in Authz mode",
        })
      );
      setTimeout(() => {
        navigateTo("/");
      }, 1000);
    }
    return () => {
      dispatch(resetAlerts());
      dispatch(resetError());
      dispatch(resetTxHash());
    };
  }, []);

  let navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }

  useEffect(() => {
    return () => {
      dispatch(resetTxAuthzSendRes());
    };
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetTxAuthzGenericRes());
    };
  }, []);

  useEffect(() => {
    if (txAuthzSendRes?.status === "idle") {
      reset();
      setTimeout(() => {
        navigate(`/${currentNetwork}/authz`);
      }, 2000);
    }
  }, [txAuthzSendRes?.status]);

  useEffect(() => {
    if (txAuthzGenericRes?.status === "idle") {
      reset();
      setTimeout(() => {
        navigate(`/${currentNetwork}/authz`);
      }, 2000);
    }
  }, [txAuthzGenericRes?.status]);

  const removeFeegrant = () => {
    // Should we completely remove feegrant or only for this session.
    dispatch(resetFeegrant());
  };

  const [selected, setSelected] = useState("send");
  let date = new Date();
  let expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      grantee: "",
      spendLimit: 1,
      expiration: expiration,
      typeUrl: "",
    },
  });

  const onSendSubmit = (data) => {
    dispatch(
      txAuthzSend({
        granter: address,
        grantee: data.grantee,
        spendLimit: amountToMinimalValue(
          data.spendLimit,
          chainInfo.config.currencies[0]
        ),
        expiration: data.expiration.toISOString(),
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config.gasPriceStep.average * 10 ** currency.coinDecimals,
        feegranter: feegrant?.granter,
      })
    );
  };

  const onGenericSubmit = (data) => {
    dispatch(
      txAuthzGeneric({
        granter: address,
        grantee: data.grantee,
        typeUrl: data.typeURL?.typeURL,
        expiration: data.expiration.toISOString(),
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config.gasPriceStep.average * 10 ** currency.coinDecimals,
        feegranter: feegrant?.granter,
      })
    );
  };

  const onChange = (type) => {
    setSelected(type);
  };

  return (
    <>
      <Alert
        variant="standard"
        severity="info"
        sx={{
          textAlign: "left",
          mb: 1,
        }}
      >
        Authz does not support ledger signing. Signing transactions through
        ledger will fail.
      </Alert>
      {feegrant?.granter?.length > 0 ? (
        <FeegranterInfo
          feegrant={feegrant}
          onRemove={() => {
            removeFeegrant();
          }}
        />
      ) : null}
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button
          variant={selected === "send" ? "contained" : "outlined"}
          onClick={() => onChange("send")}
        >
          Send
        </Button>
        <Button
          variant={selected === "generic" ? "contained" : "outlined"}
          onClick={() => onChange("generic")}
        >
          Generic
        </Button>
      </ButtonGroup>
      <br />
      <br />
      <Grid container spacing={2}>
        <br />
        <Grid item md={3} sm={2}></Grid>
        <Grid item md={6} sm={8}>
          <Paper elevation={0} style={{ padding: 32 }}>
            {selected === "send" ? (
              <form onSubmit={handleSubmit(onSendSubmit)}>
                <Controller
                  name="grantee"
                  control={control}
                  rules={{ required: "Grantee is required" }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      label="Grantee"
                      value={value}
                      required
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : null}
                      fullWidth
                    />
                  )}
                />
                <br />
                <br />
                <div>
                  <Controller
                    defaultValue={1}
                    name="spendLimit"
                    control={control}
                    rules={{
                      required: "Spend limit is required",
                      validate: (value) => {
                        return Number(value) > 0;
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Spend Limit"
                        value={value}
                        required
                        onChange={onChange}
                        type="number"
                        error={!!error}
                        helperText={
                          error
                            ? error.message.length === 0
                              ? "Invalid spend limit"
                              : error.message
                            : null
                        }
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
                </div>
                <Controller
                  name="expiration"
                  control={control}
                  rules={{ required: "Expiration is required" }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        disablePast
                        renderInput={(props) => (
                          <TextField
                            required
                            style={{ marginTop: 32 }}
                            fullWidth
                            {...props}
                          />
                        )}
                        label="Expiration"
                        value={value}
                        error={!!error}
                        onChange={onChange}
                        helperText={error ? error.message : null}
                      />
                    </LocalizationProvider>
                  )}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  style={{
                    justifyContent: "left",
                    display: "flex",
                    marginTop: 8,
                  }}
                >
                  &nbsp;Note:&nbsp;By default expiration is set to one year
                </Typography>
                <br />

                <Button
                  type="submit"
                  disabled={authzTx?.status === "pending"}
                  style={{ marginTop: 32 }}
                  variant="outlined"
                >
                  {authzTx?.status === "pending" ? (
                    <CircularProgress size={25} />
                  ) : (
                    "Grant"
                  )}
                </Button>
              </form>
            ) : (
              ""
            )}

            {selected === "generic" ? (
              <>
                <form onSubmit={handleSubmit(onGenericSubmit)}>
                  <Controller
                    name="grantee"
                    control={control}
                    rules={{ required: "Grantee is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Grantee"
                        value={value}
                        required
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                        fullWidth
                      />
                    )}
                  />
                  <br />
                  <br />
                  <Controller
                    name="typeURL"
                    control={control}
                    defaultValue={null}
                    rules={{ required: "Message type is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Autocomplete
                        disablePortal
                        fullWidth
                        variant="outlined"
                        required
                        options={authzMsgTypes()}
                        isOptionEqualToValue={(option, value) =>
                          option.typeUrl === value.typeUrl
                        }
                        label="Type"
                        value={value}
                        onChange={(event, item) => {
                          onChange(item);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!error}
                            required
                            placeholder="Select msg type"
                            helperText={error ? error.message : null}
                          />
                        )}
                      />
                    )}
                  />
                  <Controller
                    name="expiration"
                    control={control}
                    rules={{ required: "Expiration is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                          disablePast
                          renderInput={(props) => (
                            <TextField
                              required
                              style={{ marginTop: 32 }}
                              fullWidth
                              {...props}
                            />
                          )}
                          label="Expiration"
                          value={value}
                          error={!!error}
                          onChange={onChange}
                          helperText={error ? error.message : null}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    style={{
                      justifyContent: "left",
                      display: "flex",
                      marginTop: 8,
                    }}
                  >
                    &nbsp;Note:&nbsp;By default expiration is set to one year
                  </Typography>
                  <br />

                  <Button
                    type="submit"
                    style={{ marginTop: 32 }}
                    disabled={authzTx?.status === "pending"}
                    variant="outlined"
                  >
                    {authzTx?.status === "pending" ? (
                      <CircularProgress size={25} />
                    ) : (
                      "Grant"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              ""
            )}
          </Paper>
        </Grid>
        <Grid item md={3} sm={2}></Grid>
      </Grid>
    </>
  );
}
