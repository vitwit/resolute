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
  addNetwork,
} from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { KEY_WALLET_NAME, getNetworks } from "../../utils/localStorage";
import { setError } from "../../features/common/commonSlice";
import { connectWalletV1 } from "../../features/wallet/walletSlice";
import { networks } from "../../utils/chainsInfo";
import {
  CHAINCONFIG_CHAIN_NAME,
  CHAINCONFIG_CHAIN_ID,
  CHAINCONFIG_REST_ENDPOINT,
  CHAINCONFIG_RPC_ENDPOINT,
  CHAINCONFIG_LOGO,
  CURRENCY_COIN_DENOM,
  CURRENCY_COIN_MINIMAL_DENOM,
  CURRENCY_DECIAMLS,
  ACC_ADDRESS_PREFIX,
  FEE_CURRENCY_COIN_DENOM,
  FEE_CURRENCY_COIN_MINIMAL_DENOM,
  FEE_CURRENCY_DECIAMLS,
  GAS_PRICE_STEP_LOW,
  GAS_PRICE_STEP_AVG,
  GAS_PRICE_STEP_HIGH,
  COIN_TYPE,
  STAKE_CURRENCY_COIN_DENOM,
  STAKE_CURRENCY_COIN_MINIMAL_DENOM,
  STAKE_CURRENCY_DECIAMLS,
  EXPLORER_ENDPOINT,
} from "./utils";

const DialogAddNetwork = (props) => {
  const { open, dialogCloseHandle, selectNetworkDialogCloseHandle } = props;

  const dispatch = useDispatch();

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

  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const onSubmit = (data) => {
    addNetwork(data, nameToChainIDs);
    const walletName = localStorage.getItem(KEY_WALLET_NAME);
    dispatch(
      connectWalletV1({
        mainnets: [...networks, ...getNetworks()],
        testnets: [],
        walletName,
      })
    );
    dialogCloseHandle();
    dispatch(
      setError({ type: "success", message: "Network added successfully" })
    );
    selectNetworkDialogCloseHandle();
  };

  const setSameAsCurrency = (e, field) => {
    if (e.target.checked) {
      setValue(field + ".coinDenom", getValues(CURRENCY_COIN_DENOM), {
        shouldValidate: true,
      });
      setValue(
        field + ".coinMinimalDenom",
        getValues(CURRENCY_COIN_MINIMAL_DENOM),
        { shouldValidate: true }
      );
      setValue(field + ".decimals", getValues(CURRENCY_DECIAMLS), {
        shouldValidate: true,
      });
    }
  };

  const getCoinDenomValidations = (name, fieldName) => {
    return {
      required: getRequiredMsg(fieldName),
      validate: () => {
        if (!getValues(name).trim().length) {
          return getRequiredMsg(fieldName);
        }
        if (validateSpaces(getValues(name).trim())) {
          return getNoSpacesMsg(fieldName);
        }
      },
    };
  };

  const getCoinDecimalsValidations = (name, fieldName) => {
    return {
      required: getRequiredMsg(fieldName),
      min: { value: 1, message: "Value should be positive" },
      validate: () => {
        if (!validInteger(getValues(name))) {
          return "Floating points not allowed";
        }
      },
    };
  };

  const getURLValidations = (name, fieldName) => {
    return {
      required: getRequiredMsg(fieldName),
      validate: () => {
        if (!getValues(name).trim().length) {
          return getRequiredMsg(fieldName);
        }
        if (validateSpaces(getValues(name).trim())) {
          return getNoSpacesMsg(fieldName);
        }
      },
    };
  };

  const chainNameExist = () => {
    const chainName = getValues(CHAINCONFIG_CHAIN_NAME);
    const chainNamesList = Object.keys(nameToChainIDs);
    if (chainNamesList.includes(chainName.toLowerCase())) {
      return true;
    }
    return false;
  };

  const chainIDExist = () => {
    const chainID = getValues(CHAINCONFIG_CHAIN_ID);
    const chainNamesList = Object.keys(nameToChainIDs);
    for (let chain in chainNamesList) {
      if (
        nameToChainIDs[chainNamesList[chain]].toLowerCase() ===
        chainID.toLowerCase()
      ) {
        return true;
      }
    }
    return false;
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
                  name={CHAINCONFIG_CHAIN_NAME}
                  control={control}
                  rules={{
                    required: getRequiredMsg("Chain Name"),
                    validate: () => {
                      if (!getValues(CHAINCONFIG_CHAIN_NAME).trim().length) {
                        return getRequiredMsg("Chain Name");
                      }
                      if (
                        validateSpaces(getValues(CHAINCONFIG_CHAIN_NAME).trim())
                      ) {
                        return getNoSpacesMsg("Chain Name");
                      }
                      if (chainNameExist()) {
                        return "Chain exists with this name";
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Chain Name"
                      size="small"
                      name={CHAINCONFIG_CHAIN_NAME}
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
                  name={CHAINCONFIG_CHAIN_ID}
                  control={control}
                  rules={{
                    required: getRequiredMsg("Chain ID"),
                    validate: () => {
                      if (!getValues(CHAINCONFIG_CHAIN_ID).trim().length) {
                        return getRequiredMsg("Chain ID");
                      }
                      if (
                        validateSpaces(getValues(CHAINCONFIG_CHAIN_ID).trim())
                      ) {
                        return getNoSpacesMsg("Chain ID");
                      }
                      if (chainIDExist()) {
                        return "Chain exists with this ID";
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Chain ID"
                      size="small"
                      name={CHAINCONFIG_CHAIN_ID}
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
                  name={CHAINCONFIG_REST_ENDPOINT}
                  control={control}
                  rules={getURLValidations(
                    CHAINCONFIG_REST_ENDPOINT,
                    "Rest Endpoint"
                  )}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      type="url"
                      label="Rest Endpoint"
                      size="small"
                      name={CHAINCONFIG_REST_ENDPOINT}
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
                  name={CHAINCONFIG_RPC_ENDPOINT}
                  control={control}
                  rules={getURLValidations(
                    CHAINCONFIG_RPC_ENDPOINT,
                    "RPC Endpoint"
                  )}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      type="url"
                      label="RPC Endpoint"
                      size="small"
                      name={CHAINCONFIG_RPC_ENDPOINT}
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
                  name={CHAINCONFIG_LOGO}
                  control={control}
                  rules={getURLValidations(CHAINCONFIG_LOGO, "Logo URL")}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      type="url"
                      label="Logo URL"
                      size="small"
                      name={CHAINCONFIG_LOGO}
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
                  name={CURRENCY_COIN_DENOM}
                  control={control}
                  rules={getCoinDenomValidations(
                    CURRENCY_COIN_DENOM,
                    "Coin Denom"
                  )}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Denom"
                      size="small"
                      name={CURRENCY_COIN_DENOM}
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
                  name={CURRENCY_COIN_MINIMAL_DENOM}
                  control={control}
                  rules={getCoinDenomValidations(
                    CURRENCY_COIN_MINIMAL_DENOM,
                    "Coin Minimlal Denom"
                  )}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Minimal Denom"
                      size="small"
                      name={CURRENCY_COIN_MINIMAL_DENOM}
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
                  name={CURRENCY_DECIAMLS}
                  control={control}
                  rules={getCoinDecimalsValidations(
                    CURRENCY_DECIAMLS,
                    "Decimals"
                  )}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      type="number"
                      label="Decimals"
                      size="small"
                      name={CURRENCY_DECIAMLS}
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
                  name={ACC_ADDRESS_PREFIX}
                  control={control}
                  rules={{
                    required: getRequiredMsg("Account Address Prefix"),
                    validate: () => {
                      if (!getValues(ACC_ADDRESS_PREFIX).trim().length) {
                        return getRequiredMsg("Account Address Prefix");
                      }
                      if (
                        validateSpaces(getValues(ACC_ADDRESS_PREFIX).trim())
                      ) {
                        return getNoSpacesMsg("Account Address Prefix");
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Account Address Prefix"
                      size="small"
                      name={ACC_ADDRESS_PREFIX}
                      placeholder="Eg: cosmos"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.accAddressPerfix}
                      helperText={errors?.accAddressPerfix?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <FormSectionTitle title={"Fee Currencies"} />
              <Grid item xs={12}>
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    style={{ width: 10 }}
                    onChange={(e) => {
                      setSameAsCurrency(e, "feeCurrency");
                    }}
                  />
                  <Typography fontSize={12}>
                    Same as currency details
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={FEE_CURRENCY_COIN_DENOM}
                  control={control}
                  rules={getCoinDenomValidations(
                    FEE_CURRENCY_COIN_DENOM,
                    "Coin Denom"
                  )}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Denom"
                      size="small"
                      name={FEE_CURRENCY_COIN_DENOM}
                      placeholder="Eg: ATOM"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.feeCurrency?.coinDenom}
                      helperText={errors?.feeCurrency?.coinDenom?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={FEE_CURRENCY_COIN_MINIMAL_DENOM}
                  control={control}
                  rules={getCoinDenomValidations(
                    FEE_CURRENCY_COIN_MINIMAL_DENOM,
                    "Coin Minimlal Denom"
                  )}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Minimal Denom"
                      size="small"
                      name={FEE_CURRENCY_COIN_MINIMAL_DENOM}
                      placeholder="Eg: uatom"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.feeCurrency?.coinMinimalDenom}
                      helperText={
                        errors?.feeCurrency?.coinMinimalDenom?.message
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={FEE_CURRENCY_DECIAMLS}
                  control={control}
                  rules={getCoinDecimalsValidations(
                    FEE_CURRENCY_DECIAMLS,
                    "Decimals"
                  )}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      type="number"
                      label="Decimals"
                      size="small"
                      name={FEE_CURRENCY_DECIAMLS}
                      placeholder="Eg: 6"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.feeCurrency?.decimals}
                      helperText={errors?.feeCurrency?.decimals?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item container spacing={2} xs={12}>
                <FormSectionTitle title={"Gas Price Step"} />
                <Grid item xs={4}>
                  <Controller
                    name={GAS_PRICE_STEP_LOW}
                    control={control}
                    rules={{
                      required: getRequiredMsg("GasPriceStep Low"),
                      validate: () => {
                        if (getValues(GAS_PRICE_STEP_LOW) <= 0) {
                          return "Should be greater than 0";
                        }
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        type="number"
                        label="Low"
                        size="small"
                        name={GAS_PRICE_STEP_LOW}
                        placeholder="Eg: 0.01"
                        fullWidth
                        sx={{
                          mb: 2,
                        }}
                        error={errors?.gasPriceStep?.low}
                        helperText={errors?.gasPriceStep?.low?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name={GAS_PRICE_STEP_AVG}
                    control={control}
                    rules={{
                      required: getRequiredMsg("GasPriceStep Average"),
                      validate: () => {
                        if (getValues(GAS_PRICE_STEP_AVG) <= 0) {
                          return "Should be greater than 0";
                        }
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        type="number"
                        label="Average"
                        size="small"
                        name={GAS_PRICE_STEP_AVG}
                        placeholder="Eg: 0.025"
                        fullWidth
                        sx={{
                          mb: 2,
                        }}
                        error={errors?.gasPriceStep?.average}
                        helperText={errors?.gasPriceStep?.average?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name={GAS_PRICE_STEP_HIGH}
                    control={control}
                    rules={{
                      required: getRequiredMsg("GasPriceStep High"),
                      validate: () => {
                        if (getValues(GAS_PRICE_STEP_HIGH) <= 0) {
                          return "Should be greater than 0";
                        }
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        type="number"
                        label="High"
                        size="small"
                        name={GAS_PRICE_STEP_HIGH}
                        placeholder="Eg: 0.03"
                        fullWidth
                        sx={{
                          mb: 2,
                        }}
                        error={errors?.gasPriceStep?.high}
                        helperText={errors?.gasPriceStep?.high?.message}
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
                  name={COIN_TYPE}
                  control={control}
                  rules={getCoinDecimalsValidations(COIN_TYPE, "Coin Type")}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      type="number"
                      label="Coin Type"
                      size="small"
                      name={COIN_TYPE}
                      placeholder="Eg: 118"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.coinType}
                      helperText={errors?.coinType?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <FormSectionTitle title={"Stake Currency"} />
              <Grid item xs={12}>
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    style={{ width: 10 }}
                    onChange={(e) => {
                      setSameAsCurrency(e, "stakeCurrency");
                    }}
                  />
                  <Typography fontSize={12}>
                    Same as currency details
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={STAKE_CURRENCY_COIN_DENOM}
                  control={control}
                  rules={getCoinDenomValidations(
                    STAKE_CURRENCY_COIN_DENOM,
                    "Coin Denom"
                  )}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Denom"
                      size="small"
                      name={STAKE_CURRENCY_COIN_DENOM}
                      placeholder="Eg: ATOM"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.stakeCurrency?.coinDenom}
                      helperText={errors?.stakeCurrency?.coinDenom?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={STAKE_CURRENCY_COIN_MINIMAL_DENOM}
                  control={control}
                  rules={getCoinDenomValidations(
                    STAKE_CURRENCY_COIN_MINIMAL_DENOM,
                    "Coin Minimlal Denom"
                  )}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Coin Minimal Denom"
                      size="small"
                      name={STAKE_CURRENCY_COIN_MINIMAL_DENOM}
                      placeholder="Eg: uatom"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.stakeCurrency?.coinMinimalDenom}
                      helperText={
                        errors?.stakeCurrency?.coinMinimalDenom?.message
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={STAKE_CURRENCY_DECIAMLS}
                  control={control}
                  rules={getCoinDecimalsValidations(
                    STAKE_CURRENCY_DECIAMLS,
                    "Decimals"
                  )}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      type="number"
                      label="Decimals"
                      size="small"
                      name={STAKE_CURRENCY_DECIAMLS}
                      placeholder="Eg: 6"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.stakeCurrency?.decimals}
                      helperText={errors?.stakeCurrency?.decimals?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <FormSectionTitle title={"Explorer"} />
              <Grid item xs={6}>
                <Controller
                  name={EXPLORER_ENDPOINT}
                  control={control}
                  rules={getURLValidations(
                    EXPLORER_ENDPOINT,
                    "Explorer Tx Hash Endpoint"
                  )}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      type="url"
                      label="Explorer Tx Hash Endpoint"
                      size="small"
                      name={EXPLORER_ENDPOINT}
                      placeholder="Eg: https://www.mintscan.io/cosmos/txs/"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={errors?.explorerEndpoint}
                      helperText={errors?.explorerEndpoint?.message}
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
                  name={"enableModules.group"}
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
