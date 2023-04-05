import { Box, Button, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Decimal } from "@cosmjs/math";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";

Delegate.propTypes = {
  chainInfo: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  onDelegate: PropTypes.func.isRequired,
};

export default function Delegate(props) {
  const { chainInfo, address } = props;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
      validator: null,
      delegator: address,
    },
  });

  var validators = useSelector((state) => state.staking.validators);
  var [data, setData] = useState([]);

  useEffect(() => {
    const data = [];
    for (let i = 0; i < validators.activeSorted.length; i++) {
      const validator = validators.active[validators.activeSorted[i]];
      const temp = {
        label: validator.description.moniker,
        value: validators.activeSorted[i],
      };
      data.push(temp);
    }

    for (let i = 0; i < validators.inactiveSorted.length; i++) {
      const validator = validators.inactive[validators.inactiveSorted[i]];
      if (!validator.jailed) {
        const temp = {
          label: validator.description.moniker,
          value: validators.inactiveSorted[i],
        };
        data.push(temp);
      }
    }

    setData(data);
  }, [validators]);

  const currency = chainInfo.config.currencies[0];
  const onSubmit = (data) => {
    const baseAmount = Decimal.fromUserInput(
      data.amount,
      Number(currency?.coinDecimals)
    ).atomics;

    const msgDelegate = {
      delegatorAddress: data.delegator,
      validatorAddress: data.validator?.value,
      amount: {
        amount: baseAmount,
        denom: currency?.coinMinimalDenom,
      },
    };

    props.onDelegate({
      typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
      value: msgDelegate,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="delegator"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            sx={{
              mt: 2,
            }}
            label="Delegator"
            disabled
            fullWidth
          />
        )}
      />
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
      <Box
        component="div"
        sx={{
          textAlign: "center",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          disableElevation
          sx={{
            mt: 2,
            justifyContent: "center",
            textTransform: "none",
          }}
        >
          Add transaction
        </Button>
      </Box>
    </form>
  );
}
