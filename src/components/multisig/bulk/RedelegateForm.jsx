import { Box, Button, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Decimal } from "@cosmjs/math";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import { UnDelegate } from "../../../txns/staking";

RedelegateForm.propTypes = {
  validators: PropTypes.object.isRequired,
  chainInfo: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  onRedelegate: PropTypes.object.isRequired,
};

export default function RedelegateForm(props) {
  const { chainInfo, address } = props;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
      source: null,
      destination: null,
      delegator: address,
    },
  });

  var validators = useSelector((state) => state.staking.validators);
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

  const currency = chainInfo.config.currencies[0];
  const onSubmit = (data) => {
    const baseAmount = Decimal.fromUserInput(
      data.amount,
      Number(currency?.coinDecimals)
    ).atomics;

    const msgUnDelegate = UnDelegate(
      data.delegator,
      data.validator?.value,
      baseAmount,
      chainInfo.config.currencies[0].coinMinimalDenom
    );

    props.onUnDelegate(msgUnDelegate);
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
        name="source"
        control={control}
        defaultValue={null}
        rules={{ required: "Source Validator is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Autocomplete
            disablePortal
            label="Source validator"
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
                placeholder="from validator"
                error={!!error}
                helperText={error ? error.message : null}
                label="Source validator"
              />
            )}
          />
        )}
      />

      <Controller
        name="destination"
        control={control}
        defaultValue={null}
        rules={{ required: "Destination validator is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Autocomplete
            disablePortal
            label="Destination validator"
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
                placeholder="to validator"
                error={!!error}
                helperText={error ? error.message : null}
                label="Destination validator"
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
