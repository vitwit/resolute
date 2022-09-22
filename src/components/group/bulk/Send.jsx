import React from "react";
import PropTypes from "prop-types";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Decimal } from "@cosmjs/math";
import { Box } from "@mui/system";
import { useForm, Controller, useFormContext } from "react-hook-form";
import { fromBech32 } from "@cosmjs/encoding";

Send.propTypes = {
  chainInfo: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  onSend: PropTypes.object.isRequired,
};

export default function Send(props) {
  const { currency } = props;

  const { handleSubmit, watch, control,
    setValue,
    formState: { errors }, } = useFormContext({
      defaultValues: {
        amount: 0,
        recipient: "",
      },
    });

  return (
    <>
      <Controller
        name="toAddress"
        control={control}
        rules={{
          required: "Recipient is required",
          validate: (value) => {
            try {
              fromBech32(value);
              return true;
            } catch (error) {
              return false;
            }
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            sx={{
              mb: 2,
              mt: 2,
            }}
            label="Recipient"
            fullWidth
            error={!!error}
            helperText={
              errors.recipient?.type === "validate"
                ? "Invalid recipient address"
                : error?.message
            }
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
