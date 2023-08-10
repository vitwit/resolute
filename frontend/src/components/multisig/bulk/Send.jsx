import React from "react";
import PropTypes from "prop-types";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { Decimal } from "@cosmjs/math";
import { Box } from "@mui/system";
import { useForm, Controller } from "react-hook-form";
import { fromBech32 } from "@cosmjs/encoding";
import { useSelector } from "react-redux";

Send.propTypes = {
  chainInfo: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  onSend: PropTypes.func.isRequired,
};

export default function Send(props) {
  const { chainInfo } = props;
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      amount: 0,
      recipient: "",
      from: props.address,
    },
  });

  const currency = chainInfo.config.currencies[0];

  const multisigBal = useSelector((state) => state.multisig.balance);
  const available =
    (
      multisigBal?.balance?.amount /
      10 ** currency?.coinDecimals
    ).toLocaleString() || 0;

  const onSubmit = (data) => {
    const amountInAtomics = Decimal.fromUserInput(
      data.amount,
      Number(currency.coinDecimals)
    ).atomics;

    const msgSend = {
      fromAddress: data.from,
      toAddress: data.recipient,
      amount: [
        {
          amount: amountInAtomics,
          denom: currency.coinMinimalDenom,
        },
      ],
    };

    const msg = {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: msgSend,
    };

    props.onSend(msg);
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
        name="recipient"
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
      <Typography
        variant="body2"
        color="text.primary"
        style={{ textAlign: "end" }}
        className="hover-link"
        onClick={() => setValue("amount", available)}
      >
        {available} &nbsp;
        {currency?.coinDenom}
      </Typography>
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
