import { Button, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Decimal } from "@cosmjs/math";
import { useDispatch, useSelector } from "react-redux";
import {
  createTxn,
  resetCreateTxnState,
} from "../../features/multisig/multisigSlice";
import { fee } from "../../txns/execute";
import FeeComponent from "./FeeComponent";
import { Box } from "@mui/system";
import { useForm, Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import { resetError, setError } from "../../features/common/commonSlice";

const DelegateForm = ({ chainInfo }) => {
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
      validator: null,
      from: "",
      gas: 200000,
      memo: "",
      fees: chainInfo?.config?.gasPriceStep?.average,
    },
  });

  const currency = chainInfo.config.currencies[0];

  const multisigAddress =
    (localStorage.getItem("multisigAddress") &&
      JSON.parse(localStorage.getItem("multisigAddress"))) ||
    {};

  var validators = useSelector((state) => state.staking.validators);
  var createRes = useSelector((state) => state.multisig.createTxnRes);

  useEffect(() => {
    if (createRes?.status === "rejected") {
      dispatch(
        setError({
          type: "error",
          message: createRes?.error,
        })
      );
    }
  }, [createRes]);

  useEffect(() => {
    return () => {
      dispatch(resetError());
      dispatch(resetCreateTxnState());
    };
  }, []);

  validators = (validators && validators.active) || {};
  var [data, setData] = useState([]);

  useEffect(() => {
    data = [];
    Object.entries(validators).map(([k, v], index) => {
      let obj1 = {
        value: k,
        label: v.description.moniker,
      };

      data = [...data, obj1];
    });

    setData([...data]);
  }, [validators]);

  const onSubmit = (data) => {
    const baseAmount = Decimal.fromUserInput(
      data.amount,
      Number(currency?.coinDecimals)
    ).atomics;

    const msgDelegate = {
      delegatorAddress: multisigAddress?.address,
      validatorAddress: data.validator?.value,
      amount: {
        amount: baseAmount,
        denom: currency?.coinMinimalDenom,
      },
    };

    const msg = {
      typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
      value: msgDelegate,
    };

    const feeObj = fee(currency?.coinMinimalDenom, data.fees, data.gas);

    const payload = {
      address: multisigAddress?.address,
      chainId: chainInfo?.config?.chainId,
      msgs: [msg],
      fee: feeObj,
      memo: data.memo,
      gas: data.gas,
    };

    dispatch(createTxn(payload));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="validator"
        control={control}
        defaultValue={null}
        rules={{ required: "Validator is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Autocomplete
            disablePortal
            label="validator"
            value={value}
            sx={{
              mt: 2,
              mb: 2,
            }}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            options={data}
            onChange={(event, item) => {
              onChange(item);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                placeholder="select validator"
                error={!!error}
                helperText={error ? error.message : null}
                label="validator"
              />
            )}
          />
        )}
      />

      <Controller
        name="amount"
        control={control}
        rules={{
          required: "Amount is required",
          validate: (value) => {
            return Number(value) > 0;
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            sx={{
              mb: 2,
            }}
            error={!!error}
            helperText={
              errors.amount?.type === "validate"
                ? "Invalid amount"
                : error?.message
            }
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

      <Controller
        name="gas"
        control={control}
        rules={{ required: "Gas is required" }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            sx={{
              mb: 2,
            }}
            {...field}
            error={!!error}
            helperText={error ? error.message : null}
            type="number"
            required
            label="Gas"
            fullWidth
          />
        )}
      />

      <Controller
        name="memo"
        control={control}
        render={({ field }) => (
          <TextField
            sx={{
              mb: 2,
            }}
            {...field}
            label="Memo"
            fullWidth
          />
        )}
      />

      <FeeComponent
        onSetFeeChange={(v) => setValue("fees", v)}
        chainInfo={chainInfo}
      />
      <Box
        sx={{
          textAlign: "center",
          mt: 2,
        }}
        component="div"
      >
        <Button
          type="submit"
          variant="contained"
          disableElevation
          disabled={createRes.status === "pending"}
          sx={{
            textTransform: "none",
          }}
        >
          {createRes.status === "pending" ? "Please wait..." : "Create"}
        </Button>
      </Box>
    </form>
  );
};

export default DelegateForm;
