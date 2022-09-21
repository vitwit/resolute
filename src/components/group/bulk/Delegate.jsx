import { Box, Button, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Decimal } from "@cosmjs/math";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";

import { useForm, Controller, useFormContext } from "react-hook-form";

Delegate.propTypes = {
  currency: PropTypes.object.isRequired,
};

export default function Delegate(props) {
  const { currency } = props;

  const { handleSubmit, watch, control,
    setValue,
    formState: { errors }, } = useFormContext({
      defaultValues: {
        amount: 0,
        validator: null,
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

  return (
    <>
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
    </>
  );
}
