import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CreateVestingAccount } from "../../../txns/vesting/CreateVestingAccount";
import { Decimal } from "@cosmjs/math";

CreateVestingAccountForm.propTypes = {
  chainInfo: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  onCreateVestingAccount: PropTypes.func.isRequired,
};

export default function CreateVestingAccountForm(props) {
  const { chainInfo, address } = props;
  const [isDelayed, setIsDelayed] = useState(false);

  const chainID = chainInfo?.config?.chainId;
  const date = new Date();
  const expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      from: address,
      to: "",
      amount: 0,
      expiration: expiration,
      delayed: false,
    },
  });

  const currency = chainInfo.config.currencies[0];
  const onSubmit = (data) => {
    const baseAmount = Decimal.fromUserInput(
      data.amount,
      Number(currency?.coinDecimals)
    ).atomics;

    const msgCreateVestingAccount = CreateVestingAccount(data.from, data.to, baseAmount, currency?.coinDenom, data.expiration.getTime(), data.delayed);
    props.onCreateVestingAccount(msgCreateVestingAccount);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="from"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            sx={{
              mt: 2,
            }}
            label="From"
            disabled
            fullWidth
          />
        )}
      />
      <Controller
        name="to"
        control={control}
        rules={{ required: "To address is required" }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="To"
            sx={{ mt: 2 }}
            required
            error={!!error}
            helperText={error ? error.message : null}
            fullWidth
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
              mt: 2,
            }}
            required
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
        name="expiration"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              disablePast
              renderInput={(props) => (
                <TextField required sx={{ mt: 2 }} fullWidth {...props} />
              )}
              label="Expiration"
              {...field}
              error={!!error}
              helperText={error ? error.message : null}
            />
          </LocalizationProvider>
        )}
      />
      <Controller
        name="delayed"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth sx={{ mt: 2 }} {...field}>
            <FormControlLabel
              control={
                <Checkbox
                  size="medium"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setValue("delayed", true);
                      setIsDelayed(true);
                    } else {
                      setValue("delayed", false);
                      setIsDelayed(false);
                    }
                  }}
                  checked={isDelayed}
                />
              }
              label={"Is Delayed"}
            />
          </FormControl>
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
