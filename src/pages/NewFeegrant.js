import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from "@mui/material/Grid";
import {
  resetFeeFilter,
  txFeegrantBasic,
  txGrantFilter,
  txGrantPeriodic,
} from "../features/feegrant/feegrantSlice";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { PeriodicFeegrant } from "../components/PeriodicFeeGrant";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { resetError, setError } from "../features/common/commonSlice";
import GroupTab, { TabPanel } from "../components/group/GroupTab";
import { Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FilterFeeGrant } from "../components/feegrant/FilterFeeGrant";
import BasicFeeGrant from "../components/feegrant/BasicFeeGrant";
import { authzMsgTypes } from "../utils/authorizations";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function NewFeegrant() {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState("basic");
  const [value, setValue] = React.useState('');

  const address = useSelector((state) => state.wallet.address);
  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const dispatch = useDispatch();
  const feegrantTx = useSelector((state) => state.feegrant.tx);
  const feeFilterTxRes = useSelector((state) => state.feegrant.txFilterRes);

  useEffect(() => {
    if (feeFilterTxRes?.status === 'idle') {
      navigate(`/feegrant`)
    }
  }, [feeFilterTxRes?.status])

  useEffect(() => {
    return () => {
      dispatch(resetFeeFilter())
    }
  }, [])

  let date = new Date();
  let expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));
  const currency = useSelector(
    (state) => state.wallet.chainInfo.config.currencies[0]
  );

  const [msgTxTypes, setMsgTxTypes] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setMsgTxTypes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const onBasicSubmit = (data) => {
    console.log('data', data)
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
        rpc: chainInfo.config.rpc,
        feeAmount: chainInfo.config.gasPriceStep.average * (10 ** currency.coinDecimals),
      })
    );
  };

  const onPeriodicGrant = (data) => {
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
        rpc: chainInfo.config.rpc,
        feeAmount: chainInfo.config.gasPriceStep.average * (10 ** currency.coinDecimals),
      })
    );
  };

  const onFilteredTx = (data) => {

    dispatch(txGrantFilter({
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
      rpc: chainInfo.config.rpc,
      feeAmount: chainInfo.config.gasPriceStep.average * (10 ** currency.coinDecimals),
      allowanceType: value,
      txType: msgTxTypes,
    }))
    console.log('data----', data)
  }

  let navigate = useNavigate();
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
  }

  const methods = useForm({
    defaultValues: {
      grantee: "",
      spendLimit: 0,
      expiration: expiration,
      period: 1,
      periodSpendLimit: 0,
    },
  });

  const getLabelValue = value => {
    const arrSplit = value && value.split('.');
    return arrSplit && arrSplit[arrSplit?.length - 1] || '';
  }

  return (
    <>
      <Typography variant="h6" textAlign={'left'}
        gutterBottom
      > Create Fee Grant </Typography>
      <Paper variant="outlined">
        <GroupTab tabs={['Basic', 'Periodic', 'Filtered']} handleTabChange={handleTabChange} />
        <TabPanel value={tab} index={0}>
          <Box sx={{ width: '50%', m: '0 auto' }}>
            <Typography variant="h6" gutterBottom textAlign={'left'}>
              Create Basic Fee Grant </Typography>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onBasicSubmit)}>
                <BasicFeeGrant
                />
                <Button
                  style={{ marginTop: 32 }}
                  variant="outlined"
                  type="submit"
                  disabled={feegrantTx?.status === "pending"}
                >
                  {feegrantTx?.status === "pending" ? (
                    <CircularProgress size={25} />
                  ) : (
                    "Grant"
                  )}
                </Button>
              </form>
            </FormProvider>

          </Box>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Box sx={{ width: '50%', m: '0 auto' }}>
            <Typography variant="h6" textAlign={'left'} gutterBottom>
              Create Periodic Fee Grant
            </Typography>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onPeriodicGrant)}>
                <PeriodicFeegrant
                  loading={feegrantTx.status}
                  onGrant={onPeriodicGrant}
                  currency={currency}
                />

                <Button
                  style={{ marginTop: 32 }}
                  variant="outlined"
                  type='submit'
                  disabled={feegrantTx.status === 'pending'}
                >
                  {feegrantTx.status === 'pending' ?
                    <CircularProgress size={25} /> : "Grant"}
                </Button>
              </form>
            </FormProvider>
          </Box>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <Box sx={{ width: '50%', m: '0 auto' }}>
            <Typography variant="h6" textAlign={'left'} gutterBottom>
              Create Filter Fee Grant
            </Typography>

            <FormControl sx={{ float: 'left', mb: 2, mt: 1 }}>
              <FormLabel sx={{ textAlign: 'left' }} id="row-radio-buttons-group-label">
                Choose Allowance
              </FormLabel>
              <RadioGroup
                row
                onChange={(e) => setValue(e.target.value)}
                aria-labelledby="allowance-group"
                name="row-radio-allowance-group"
              >
                <FormControlLabel value="Basic" control={<Radio />} label="Basic" />
                <FormControlLabel value="Periodic" control={<Radio />} label="Periodic" />

              </RadioGroup>
            </FormControl>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onFilteredTx)}>
                <FormControl sx={{ mb: 2 }} fullWidth>
                  <InputLabel id="demo-multiple-chip-label">Select Transaction</InputLabel>
                  <Select
                    required
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={msgTxTypes}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip"
                      label="Select Transaction" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={getLabelValue(value)} />
                        ))}
                      </Box>
                    )}
                  >
                    {
                      authzMsgTypes().map(a => (
                        <MenuItem value={a.typeURL}>{a.label}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>

                {value === 'Basic' && <BasicFeeGrant /> || null}
                {value === 'Periodic' && <PeriodicFeegrant
                  loading={feegrantTx.status}
                  onGrant={onPeriodicGrant}
                  currency={currency}
                /> || null}

                {
                  value && <Button
                    style={{ marginTop: 32 }}
                    variant="outlined"
                    type='submit'
                    disabled={feeFilterTxRes.status === 'pending'}
                  >
                    {feeFilterTxRes.status === 'pending' ?
                      <CircularProgress size={25} /> : "Grant"}
                  </Button> || null
                }
              </form>

            </FormProvider>
          </Box>

        </TabPanel>
      </Paper>
    </>
  );
}
