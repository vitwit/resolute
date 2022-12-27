import { InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";

UnDelegateForm.propTypes = {
  chainInfo: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  onUndelegate: PropTypes.func.isRequired,
};

function parseDelegation(delegation, currency) {
  return (
    parseFloat(delegation?.delegation?.shares) /
    (10 ** currency?.coinDecimals).toFixed(6)
  );
}

export default function UnDelegateForm(props) {
  const { address } = props;

  const wallet = useSelector((state) => state?.wallet);
  const { chainInfo } = wallet;

  const {
    control,
    formState: { errors },
  } = useFormContext({
    defaultValues: {
      amount: 0,
      validator: null,
      delegator: address,
    },
  });

  const validators = useSelector((state) => state.staking.validators);
  const delegations = useSelector(
    (state) => state.staking.delegations.delegations
  );
  var [data, setData] = useState([]);

  useEffect(() => {
    const data = [];

    for (let i = 0; i < delegations.length; i++) {
      if (validators.active[delegations[i].delegation.validator_address]) {
        const temp = {
          label:
            validators.active[delegations[i].delegation.validator_address]
              .description.moniker,
          value: {
            shares: parseDelegation(
              delegations[i],
              chainInfo.config.currencies[0]
            ),
            validator: delegations[i].delegation.validator_address,
          },
        };
        data.push(temp);
      } else if (
        validators.inactive[delegations[i].delegation.validator_address]
      ) {
        const temp = {
          label:
            validators.inactive[delegations[i].delegation.validator_address]
              .description.moniker,
          value: {
            shares: parseDelegation(
              delegations[i],
              chainInfo.config.currencies[0]
            ),
            validator: delegations[i].delegation.validator_address,
          },
        };
        data.push(temp);
      }
    }

    setData(data);
  }, [delegations]);

  const currency = chainInfo.config.currencies[0];

  return (
    <>
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
            value={value?.validator}
            sx={{
              mt: 2,
              mb: 2,
            }}
            isOptionEqualToValue={(option, value) =>
              option.value?.validator === value.value?.validator
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
