import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import {
  resetFeeFilter,
  txFeegrantBasic,
  txGrantFilter,
  txGrantPeriodic,
  resetFeeBasic,
  resetFeePeriodic,
} from "../../features/feegrant/feegrantSlice";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { PeriodicFeegrant } from "../../components/PeriodicFeeGrant";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useParams } from "react-router-dom";
import {
  resetError,
  setError,
  setFeegrant as setFeegrantState,
  removeFeegrant as removeFeegrantState,
} from "../../features/common/commonSlice";
import GroupTab, { TabPanel } from "../../components/group/GroupTab";
import {
  Alert,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import BasicFeeGrant from "../../components/feegrant/BasicFeeGrant";
import { authzMsgTypes } from "./../../utils/authorizations";
import {
  getFeegrant,
  setFeegrant,
  removeFeegrant as removeFeegrantLocalState,
} from "../../utils/localStorage";
import FeegranterInfo from "../../components/FeegranterInfo";
import {
  authzExecHelper,
  getGrantsToMe,
  resetExecTx,
  resetTxAuthzRes,
} from "../../features/authz/authzSlice";

const filterAuthzFeegrant = (grantsToMe) => {
  const granters = [];
  const grants = grantsToMe?.grants || [];
  for (const grant of grants) {
    const authorizationType = grant?.authorization["@type"];
    const isGenericAuthorization =
      authorizationType === "/cosmos.authz.v1beta1.GenericAuthorization";
    const isMsgGrantAllowance =
      grant?.authorization.msg === "/cosmos.feegrant.v1beta1.MsgGrantAllowance";
    if (isGenericAuthorization && isMsgGrantAllowance) {
      granters.push(grant.granter);
    }
  }
  return granters;
};

export default function NewFeegrant() {
  const [tab, setTab] = useState(0);
  const [value, setValue] = React.useState("");

  const params = useParams();

  const isAuthzMode = useSelector((state) => state.common.authzMode);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const networks = useSelector((state) => state.wallet.networks);

  const [currentNetwork, setCurrentNetwork] = React.useState(
    params?.networkName || selectedNetwork
  );
  const chainID = nameToChainIDs[currentNetwork];

  const grantsToMe = useSelector((state) => state.authz.grantsToMe?.[chainID]);

  const chainInfo = networks[chainID]?.network;
  const address = networks[chainID]?.walletInfo.bech32Address;

  const dispatch = useDispatch();
  const feegrantTx = useSelector((state) => state.feegrant.tx);
  const feeFilterTxRes = useSelector((state) => state.feegrant.txFilterRes);
  const feegrantBasicTxRes = useSelector(
    (state) => state.feegrant.txFeegrantBasicRes
  );
  const grantPeriodicTxRes = useSelector(
    (state) => state.feegrant.txGrantPeriodicRes
  );
  const feegrant = useSelector(
    (state) => state.common.feegrant?.[currentNetwork] || {}
  );
  const authzExecTx = useSelector((state) => state.authz.execTx);

  let navigate = useNavigate();
  useEffect(() => {
    if (feeFilterTxRes?.status === "idle") {
      navigate(`/${currentNetwork}/feegrant`);
    }
  }, [feeFilterTxRes?.status, navigate]);

  useEffect(() => {
    if (feegrantBasicTxRes?.status === "idle") {
      navigate(`/${currentNetwork}/feegrant`);
    }
  }, [feegrantBasicTxRes?.status, navigate]);

  useEffect(() => {
    if (grantPeriodicTxRes?.status === "idle") {
      navigate(`/${currentNetwork}/feegrant`);
    }
  }, [grantPeriodicTxRes?.status, navigate]);

  useEffect(() => {
    if (authzExecTx?.status === "idle") {
      navigate(`/${currentNetwork}/feegrant`);
    }
  }, [authzExecTx?.status, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetFeeFilter());
    };
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetFeeBasic());
    };
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetFeePeriodic());
    };
  }, []);

  useEffect(() => {
    const currentChainGrants = getFeegrant()?.[currentNetwork];
    dispatch(
      setFeegrantState({
        grants: currentChainGrants,
        chainName: currentNetwork.toLowerCase(),
      })
    );
  }, [currentNetwork]);

  const removeFeegrant = () => {
    // Should we completely remove feegrant or only for this session.
    dispatch(removeFeegrantState(currentNetwork));
    removeFeegrantLocalState(currentNetwork);
  };

  const date = new Date();
  const expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));
  const currency =
    networks[nameToChainIDs[currentNetwork]]?.network.config.currencies[0];

  const [msgTxTypes, setMsgTxTypes] = React.useState([]);
  const [isNoAuthzs, setNoAuthzs] = useState(false);
  const [authzGrants, setAuthzGrants] = useState();
  const [granter, setGranter] = useState("");

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setMsgTxTypes(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const onBasicSubmit = (data) => {
    if (!isAuthzMode) {
      dispatch(
        txFeegrantBasic({
          granter: address,
          grantee: data.grantee,
          spendLimit:
            Number(data.spendLimit) === 0
              ? null
              : Number(data.spendLimit) * 10 ** currency.coinDecimals,
          expiration:
            data.expiration === null
              ? data.expiration
              : data.expiration.toISOString(),
          denom: currency.coinMinimalDenom,
          chainId: chainInfo.config.chainId,
          rest: chainInfo.config.rest,
          aminoConfig: chainInfo.aminoConfig,
          prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
          feeAmount:
            chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average *
            10 ** currency.coinDecimals,
        })
      );
    } else {
      authzExecHelper(dispatch, {
        type: "feegrantBasic",
        from: address,
        granter: granter,
        grantee: data.grantee,
        spendLimit:
          Number(data.spendLimit) === 0
            ? null
            : Number(data.spendLimit) * 10 ** currency.coinDecimals,
        expiration:
          data.expiration === null
            ? data.expiration
            : data.expiration.toISOString(),
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average *
          10 ** currency.coinDecimals,
      });
    }
  };

  const onPeriodicGrant = (data) => {
    if (!isAuthzMode) {
      dispatch(
        txGrantPeriodic({
          granter: address,
          grantee: data.grantee,
          spendLimit:
            Number(data.spendLimit) === 0
              ? null
              : Number(data.spendLimit) * 10 ** currency.coinDecimals,
          expiration:
            data.expiration === null
              ? new Date(data.expiration).toISOString()
              : new Date(data.expiration).toISOString(),
          period: data.period,
          periodSpendLimit: data.periodSpendLimit,
          denom: currency.coinMinimalDenom,
          chainId: chainInfo.config.chainId,
          rest: chainInfo.config.rest,
          aminoConfig: chainInfo.aminoConfig,
          prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
          feeAmount:
            chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average *
            10 ** currency.coinDecimals,
        })
      );
    } else {
      authzExecHelper(dispatch, {
        type: "feegrantPeriodic",
        from: address,
        granter: granter,
        grantee: data.grantee,
        spendLimit:
          Number(data.spendLimit) === 0
            ? null
            : Number(data.spendLimit) * 10 ** currency.coinDecimals,
        expiration:
          data.expiration === null
            ? new Date(data.expiration).toISOString()
            : new Date(data.expiration).toISOString(),
        period: data.period,
        periodSpendLimit: data.periodSpendLimit,
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average *
          10 ** currency.coinDecimals,
      });
    }
  };

  const onFilteredTx = (data) => {
    if (!isAuthzMode) {
      dispatch(
        txGrantFilter({
          granter: address,
          grantee: data.grantee,
          spendLimit:
            Number(data.spendLimit) === 0
              ? null
              : Number(data.spendLimit) * 10 ** currency.coinDecimals,
          expiration:
            data.expiration === null
              ? new Date(data.expiration).toISOString()
              : new Date(data.expiration).toISOString(),
          period: data.period,
          periodSpendLimit: data.periodSpendLimit,
          denom: currency.coinMinimalDenom,
          chainId: chainInfo.config.chainId,
          rest: chainInfo.config.rest,
          aminoConfig: chainInfo.aminoConfig,
          prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
          feeAmount:
            chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average *
            10 ** currency.coinDecimals,
          allowanceType: value,
          txType: msgTxTypes,
        })
      );
    } else {
      authzExecHelper(dispatch, {
        type: "feegrantFiltered",
        from: address,
        granter: granter,
        grantee: data.grantee,
        spendLimit:
          Number(data.spendLimit) === 0
            ? null
            : Number(data.spendLimit) * 10 ** currency.coinDecimals,
        expiration:
          data.expiration === null
            ? new Date(data.expiration).toISOString()
            : new Date(data.expiration).toISOString(),
        period: data.period,
        periodSpendLimit: data.periodSpendLimit,
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average *
          10 ** currency.coinDecimals,
        allowanceType: value,
        txType: msgTxTypes,
      });
    }
  };

  function navigateTo(path) {
    navigate(path);
  }
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
      dispatch(resetError());
    };
  }, []);

  const handleTabChange = (value) => {
    setTab(value);
  };

  const methods = useForm({
    defaultValues: {
      grantee: "",
      spendLimit: 0,
      expiration: expiration,
      period: 1,
      periodSpendLimit: 0,
    },
  });

  const getLabelValue = (value) => {
    const arrSplit = value && value.split(".");
    return (arrSplit && arrSplit[arrSplit?.length - 1]) || "";
  };

  useEffect(() => {
    if (isAuthzMode) {
      dispatch(
        getGrantsToMe({
          baseURL: chainInfo.config.rest,
          grantee: address,
          chainID: chainID,
        })
      );
    }
  }, [isAuthzMode, chainInfo, address]);

  useEffect(() => {
    const result = filterAuthzFeegrant(grantsToMe);
    if (result?.length === 0) {
      setNoAuthzs(true);
    } else {
      setNoAuthzs(false);
      setAuthzGrants(result);
    }
  }, [grantsToMe]);

  return (
    <>
      {isAuthzMode && isNoAuthzs ? (
        <>
          {" "}
          <Typography color="text.primary">
            You don't have authz permission.
          </Typography>
        </>
      ) : (
        <>
          {feegrant?.granter?.length > 0 ? (
            <FeegranterInfo
              feegrant={feegrant}
              onRemove={() => {
                removeFeegrant();
              }}
            />
          ) : null}
          <Typography
            variant="h6"
            textAlign={"left"}
            color="text.primary"
            gutterBottom
          >
            Create Feegrant
          </Typography>
          <Alert
            variant="standard"
            severity="info"
            sx={{
              textAlign: "left",
              mb: 2,
              mt: 1,
            }}
          >
            Feegrant does not support ledger signing. Signing transactions
            through ledger will fail.
          </Alert>

          <Paper
            variant="elevation"
            sx={{
              mt: 1,
            }}
            elevation={0}
          >
            <GroupTab
              tabs={[
                { title: "Basic" },
                { title: "Periodic" },
                { title: "Filtered" },
              ]}
              handleTabChange={handleTabChange}
            />
            <TabPanel value={tab} index={0}>
              <Grid container>
                <Grid item xs={1} md={3}></Grid>
                <Grid item xs={10} md={6}>
                  <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onBasicSubmit)}>
                      <BasicFeeGrant
                        granters={authzGrants}
                        setGranter={setGranter}
                        granter={granter}
                      />
                      <Button
                        sx={{ mt: 4 }}
                        variant="contained"
                        type="submit"
                        disableElevation
                        disabled={
                          feegrantTx?.status === "pending" ||
                          authzExecTx?.status === "pending"
                        }
                      >
                        {feegrantTx?.status === "pending" ||
                        authzExecTx?.status === "pending" ? (
                          <CircularProgress size={25} />
                        ) : (
                          "Grant"
                        )}
                      </Button>
                    </form>
                  </FormProvider>
                </Grid>
                <Grid item xs={1} md={3} />
              </Grid>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <Grid container>
                <Grid item xs={1} md={3}></Grid>
                <Grid item xs={10} md={6}>
                  <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onPeriodicGrant)}>
                      <PeriodicFeegrant
                        loading={feegrantTx.status}
                        onGrant={onPeriodicGrant}
                        currency={currency}
                        granters={authzGrants}
                        setGranter={setGranter}
                        granter={granter}
                      />

                      <Button
                        sx={{ mt: 4 }}
                        variant="contained"
                        disableElevation
                        type="submit"
                        disabled={
                          feegrantTx.status === "pending" ||
                          authzExecTx?.status === "pending"
                        }
                      >
                        {feegrantTx.status === "pending" ||
                        authzExecTx?.status === "pending" ? (
                          <CircularProgress size={25} />
                        ) : (
                          "Grant"
                        )}
                      </Button>
                    </form>
                  </FormProvider>
                </Grid>
                <Grid item xs={1} md={3} />
              </Grid>
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <Grid container>
                <Grid item xs={1} md={3}></Grid>
                <Grid item xs={10} md={6}>
                  <FormControl sx={{ float: "left", mb: 2, mt: 1 }}>
                    <FormLabel
                      sx={{ textAlign: "left" }}
                      id="row-radio-buttons-group-label"
                    >
                      Feegrant type
                    </FormLabel>
                    <RadioGroup
                      row
                      onChange={(e) => setValue(e.target.value)}
                      aria-labelledby="allowance-group"
                      name="row-radio-allowance-group"
                    >
                      <FormControlLabel
                        value="Basic"
                        control={<Radio />}
                        label="Basic"
                      />
                      <FormControlLabel
                        value="Periodic"
                        control={<Radio />}
                        label="Periodic"
                      />
                    </RadioGroup>
                  </FormControl>

                  <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onFilteredTx)}>
                      <FormControl sx={{ mb: 2 }} fullWidth>
                        <InputLabel id="demo-multiple-chip-label">
                          Select Transaction
                        </InputLabel>
                        <Select
                          required
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          multiple
                          value={msgTxTypes}
                          onChange={handleChange}
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="Select Transaction"
                            />
                          }
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => (
                                <Chip
                                  key={value}
                                  label={getLabelValue(value)}
                                />
                              ))}
                            </Box>
                          )}
                        >
                          {authzMsgTypes().map((a, index) => (
                            <MenuItem key={index} value={a.typeURL}>
                              {a.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {(value === "Basic" && (
                        <BasicFeeGrant
                          granters={authzGrants}
                          setGranter={setGranter}
                          granter={granter}
                        />
                      )) ||
                        null}
                      {(value === "Periodic" && (
                        <PeriodicFeegrant
                          loading={feegrantTx.status}
                          onGrant={onPeriodicGrant}
                          currency={currency}
                          granters={authzGrants}
                          setGranter={setGranter}
                          granter={granter}
                        />
                      )) ||
                        null}

                      {(value && (
                        <Button
                          sx={{ mt: 4 }}
                          variant="contained"
                          type="submit"
                          disableElevation
                          disabled={
                            feeFilterTxRes.status === "pending" ||
                            authzExecTx?.status === "pending"
                          }
                        >
                          {feeFilterTxRes.status === "pending" ||
                          authzExecTx?.status === "pending" ? (
                            <CircularProgress size={25} />
                          ) : (
                            "Grant"
                          )}
                        </Button>
                      )) ||
                        null}
                    </form>
                  </FormProvider>
                </Grid>
                <Grid item xs={1} md={3} />
              </Grid>
            </TabPanel>
          </Paper>
        </>
      )}
    </>
  );
}
