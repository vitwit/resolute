import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  defaultValues,
  validateSpaces,
  getRequiredMsg,
  getNoSpacesMsg,
  validInteger,
} from "./utils";

const DialogAddNetwork = (props) => {
  const { open, dialogCloseHandle } = props;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: defaultValues,
  });

  const [isTestnet, setIsTestnet] = useState(null);
  const [enableAuthz, setEnableAuthz] = useState(null);
  const [enableFeegrant, setEnableFeegrant] = useState(null);
  const [enableGroups, setEnableGroups] = useState(null);
  const [aminoAuthz, setAminoAuthz] = useState(null);
  const [aminoFeegrant, setAminoFeegrant] = useState(null);
  const [keplrExperimental, setKeplrExperimental] = useState(null);
  const [leapExperimental, setLeapExperimental] = useState(null);

  const onSubmit = (data) => {
    console.log("data...");
    console.log(data);
  };

  return (
    <>
      <Dialog open={open} onClose={dialogCloseHandle} fullWidth maxWidth="lg">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" color="primary">
            Add Network
          </Typography>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => {
              dialogCloseHandle();
            }}
            variant="h5"
          />
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <FormSectionTitle title={"Chain Configuration"} />
              <Grid item xs={6}>
                <Controller
                  name="chainConfig.chainName"
                  control={control}
                  rules={{
                    required: getRequiredMsg("Chain Name"),
                    validate: () => {
                      if (!getValues("chainConfig.chainName").trim().length) {
                        return getRequiredMsg("Chain Name");
                      }
                      if (
                        validateSpaces(
                          getValues("chainConfig.chainName").trim()
                        )
                      ) {
                        return getNoSpacesMsg("Chain Name");
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Chain Name"
                      size="small"
                      name="chainConfig.chainName"
                      placeholder="Chain Name *"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.chainConfig?.chainName}
                      helperText={errors?.chainConfig?.chainName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="chainConfig.chainID"
                  control={control}
                  rules={{
                    required: getRequiredMsg("Chain ID"),
                    validate: () => {
                      if (!getValues("chainConfig.chainID").trim().length) {
                        return getRequiredMsg("Chain ID");
                      }
                      if (
                        validateSpaces(getValues("chainConfig.chainID").trim())
                      ) {
                        return getNoSpacesMsg("Chain ID");
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Chain ID"
                      size="small"
                      name="chainID"
                      placeholder="Chain ID *"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.chainConfig?.chainID}
                      helperText={errors?.chainConfig?.chainID?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="chainConfig.restEndpoint"
                  control={control}
                  rules={{
                    required: getRequiredMsg("Rest Endpoint"),
                    validate: () => {
                      if (
                        !getValues("chainConfig.restEndpoint").trim().length
                      ) {
                        return getRequiredMsg("Rest Endpoint");
                      }
                      if (
                        validateSpaces(
                          getValues("chainConfig.restEndpoint").trim()
                        )
                      ) {
                        return getNoSpacesMsg("Rest Endpoint");
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      type="url"
                      label="Rest Endpoint"
                      size="small"
                      name="restEndpoint"
                      placeholder="Eg: https://api.resolute.vitwit.com/cosmos_api/"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.chainConfig?.restEndpoint}
                      helperText={errors?.chainConfig?.restEndpoint?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="chainConfig.rpcEndpoint"
                  control={control}
                  rules={{
                    required: getRequiredMsg("RPC Endpoint"),
                    validate: () => {
                      if (!getValues("chainConfig.rpcEndpoint").trim().length) {
                        return getRequiredMsg("RPC Endpoint");
                      }
                      if (
                        validateSpaces(
                          getValues("chainConfig.rpcEndpoint").trim()
                        )
                      ) {
                        return getNoSpacesMsg("RPC Endpoint");
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      type="url"
                      label="RPC Endpoint"
                      size="small"
                      name="rpcEndpoint"
                      placeholder="Eg: https://api.resolute.vitwit.com/cosmos_rpc/"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.chainConfig?.rpcEndpoint}
                      helperText={errors?.chainConfig?.rpcEndpoint?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="chainConfig.logo"
                  control={control}
                  rules={{
                    required: getRequiredMsg("Logo URL"),
                    validate: () => {
                      if (!getValues("chainConfig.logo").trim().length) {
                        return getRequiredMsg("Logo URL");
                      }
                      if (
                        validateSpaces(getValues("chainConfig.logo").trim())
                      ) {
                        return getNoSpacesMsg("Logo URL");
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      type="url"
                      label="Logo URL"
                      size="small"
                      name="chainConfig.logo"
                      placeholder="Eg: https://raw.githubusercontent.com/..../images/cosmoshub.svg"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.chainConfig?.logo}
                      helperText={errors?.chainConfig?.logo?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomCheckBoxField
                  control={control}
                  label={"Is Testnet"}
                  name={"chainConfig.isTestnet"}
                  setValue={setValue}
                  value={isTestnet}
                  setter={setIsTestnet}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <FormSectionTitle title={"Currency Details"} />
              <Grid item xs={4}>
                <Controller
                  name={"currency.coinDenom"}
                  control={control}
                  rules={{
                    required: getRequiredMsg("Coin Denom"),
                    validate: () => {
                      if (!getValues("currency.coinDenom").trim().length) {
                        return getRequiredMsg("Coin Denom");
                      }
                      if (
                        validateSpaces(getValues("currency.coinDenom").trim())
                      ) {
                        return getNoSpacesMsg("Coin Denom");
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Denom"
                      size="small"
                      name="currency.coinDenom"
                      placeholder="Eg: ATOM"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.currency?.coinDenom}
                      helperText={errors?.currency?.coinDenom?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="currency.coinMinimalDenom"
                  control={control}
                  rules={{
                    required: getRequiredMsg("Coin Minimal Denom"),
                    validate: () => {
                      if (
                        !getValues("currency.coinMinimalDenom").trim().length
                      ) {
                        return getRequiredMsg("Coin Minimlal Denom");
                      }
                      if (
                        validateSpaces(
                          getValues("currency.coinMinimalDenom").trim()
                        )
                      ) {
                        return getNoSpacesMsg("Coin Minimal Denom");
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Minimal Denom"
                      size="small"
                      name="currency.coinMinimalDenom"
                      placeholder="Eg: uatom"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.currency?.coinMinimalDenom}
                      helperText={errors?.currency?.coinMinimalDenom?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="currency.decimals"
                  control={control}
                  rules={{
                    required: getRequiredMsg("Decimals"),
                    min: { value: 1, message: "Value should be positive" },
                    validate: () => {
                      if (!validInteger(getValues("currency.decimals"))) {
                        return "Floating points not allowed";
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      type="number"
                      label="Decimals"
                      size="small"
                      name="currency.decimals"
                      placeholder="Eg: 6"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.currency?.decimals}
                      helperText={errors?.currency?.decimals?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <FormSectionTitle title={"Bech32 Configuration"} />
              <Grid item xs={4}>
                <Controller
                  name="accAddressPerfix"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Account Address Prefix"
                      size="small"
                      name="accAddressPerfix"
                      placeholder="Eg: cosmos"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <FormSectionTitle title={"Fee Currencies"} />
              <Grid item xs={12}>
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  <input type="checkbox" style={{ width: 10 }} />
                  <Typography fontSize={12}>
                    Same as currency details
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="feeCurrency.coinDenom"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Denom"
                      size="small"
                      name="feeCurrency.coinDenom"
                      placeholder="Eg: ATOM"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="feeCurrency.coinMinimalDenom"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Minimal Denom"
                      size="small"
                      name="feeCurrency.coinMinimalDenom"
                      placeholder="Eg: uatom"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="feeCurrency.decimals"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Decimals"
                      size="small"
                      name="feeCurrency.decimals"
                      placeholder="Eg: 6"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item container spacing={2} xs={12}>
                <FormSectionTitle title={"Gas Price Step"} />
                <Grid item xs={4}>
                  <Controller
                    name="gasPriceStep.low"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        label="Low"
                        size="small"
                        name="gasPriceStep.low"
                        placeholder="Eg: 0.01"
                        fullWidth
                        sx={{
                          mb: 2,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name="gasPriceStep.average"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        label="Average"
                        size="small"
                        name="gasPriceStep.average"
                        placeholder="Eg: 0.025"
                        fullWidth
                        sx={{
                          mb: 2,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name="gasPriceStep.high"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        label="High"
                        size="small"
                        name="gasPriceStep.high"
                        placeholder="Eg: 0.03"
                        fullWidth
                        sx={{
                          mb: 2,
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <FormSectionTitle title={"Coin Type"} />
              <Grid item xs={4}>
                <Controller
                  defaultValue={118}
                  name="coinType"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Type"
                      size="small"
                      name="coinType"
                      placeholder="Eg: 118"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <FormSectionTitle title={"Stake Currency"} />
              <Grid item xs={12}>
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  <input type="checkbox" style={{ width: 10 }} />
                  <Typography fontSize={12}>
                    Same as currency details
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="stakeCurrency.coinDenom"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Denom"
                      size="small"
                      name="stakeCurrency.coinDenom"
                      placeholder="Eg: ATOM"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="stakeCurrency.coinMinimalDenom"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Minimal Denom"
                      size="small"
                      name="stakeCurrency.coinMinimalDenom"
                      placeholder="Eg: uatom"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="stakeCurrency.decimals"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Decimals"
                      size="small"
                      name="stakeCurrency.decimals"
                      placeholder="Eg: 6"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <FormSectionTitle title={"Explorer"} />
              <Grid item xs={6}>
                <Controller
                  name="explorerEndpoint"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Explorer Tx Hash Endpoint"
                      size="small"
                      name="explorerEndpoint"
                      placeholder="Eg: https://www.mintscan.io/cosmos/txs/"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container columnSpacing={2}>
              <FormSectionTitle title={"Enable Modules"} />
              <Grid item xs={4}>
                <CustomCheckBoxField
                  control={control}
                  label={"Authz"}
                  name={"enableModules.authz"}
                  setValue={setValue}
                  value={enableAuthz}
                  setter={setEnableAuthz}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomCheckBoxField
                  control={control}
                  label={"Feegrant"}
                  name={"enableModules.feegrant"}
                  setValue={setValue}
                  value={enableFeegrant}
                  setter={setEnableFeegrant}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomCheckBoxField
                  control={control}
                  label={"Groups"}
                  name={"enableModules.groups"}
                  setValue={setValue}
                  value={enableGroups}
                  setter={setEnableGroups}
                />
              </Grid>
            </Grid>
            <Grid container columnSpacing={2}>
              <FormSectionTitle title={"Enable Amino Config"} />
              <Grid item xs={4}>
                <CustomCheckBoxField
                  control={control}
                  label={"Authz"}
                  name={"aminoConfig.authz"}
                  setValue={setValue}
                  value={aminoAuthz}
                  setter={setAminoAuthz}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomCheckBoxField
                  control={control}
                  label={"Feegrant"}
                  name={"aminoConfig.feegrant"}
                  setValue={setValue}
                  value={aminoFeegrant}
                  setter={setAminoFeegrant}
                />
              </Grid>
            </Grid>
            <Grid container columnSpacing={2}>
              <FormSectionTitle title={"Experimental Wallet"} />
              <Grid item xs={4}>
                <CustomCheckBoxField
                  control={control}
                  label={"Keplr Experimental"}
                  name={"wallet.keplrExperimental"}
                  setValue={setValue}
                  value={keplrExperimental}
                  setter={setKeplrExperimental}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomCheckBoxField
                  control={control}
                  label={"Leap Experimental"}
                  name={"wallet.leapExperimental"}
                  setValue={setValue}
                  value={leapExperimental}
                  setter={setLeapExperimental}
                />
              </Grid>
            </Grid>

            <Grid sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="outlined" type="submit">
                Add
              </Button>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

const FormSectionTitle = ({ title }) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography fontWeight={0} color="primary">
          {title}
        </Typography>
      </Grid>
    </>
  );
};

const CustomCheckBoxField = (props) => {
  const { control, label, name, setValue, value, setter } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue(name, "Yes");
                    setter("Yes");
                  } else {
                    setValue(name, "No");
                    setter("No");
                  }
                }}
                checked={value === "Yes" ? true : false}
              />
            }
            label={label}
          />
        </FormControl>
      )}
    />
  );
};

export default DialogAddNetwork;
