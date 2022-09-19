import { Button, InputAdornment, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Decimal } from "@cosmjs/math";
import {
  createTxn,
  resetCreateTxnState,
} from "../../features/multisig/multisigSlice";
import { fee } from "../../txns/execute";
import FeeComponent from "./FeeComponent";
import { Box } from "@mui/system";
import { useForm, Controller } from "react-hook-form";
import { fromBech32 } from "@cosmjs/encoding";
import { resetError, setError } from "../../features/common/commonSlice";

export default function SendForm({ chainInfo }) {
  const dispatch = useDispatch();
  var createRes = useSelector((state) => state.multisig.createTxnRes);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
      recipient: "",
      from: "",
      gas: 200000,
      memo: "",
      fees: chainInfo?.config?.gasPriceStep?.average * (10 ** chainInfo?.config?.currencies[0].coinDecimals),
    },
  });

  const multisigAddress =
    (localStorage.getItem("multisigAddress") &&
      JSON.parse(localStorage.getItem("multisigAddress"))) ||
    {};

  const currency = chainInfo.config.currencies[0];

  const onSubmit = (data) => {
    const amountInAtomics = Decimal.fromUserInput(
      data.amount,
      Number(currency.coinDecimals)
    ).atomics;

    const msgSend = {
      fromAddress: multisigAddress?.address,
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

    const feeObj = fee(
      chainInfo?.config.currencies[0].coinMinimalDenom,
      data.fees,
      data.gas
    );

    const payload = {
      chainId: chainInfo?.config?.chainId,
      msgs: [msg],
      fee: feeObj,
      memo: data.memo,
      address: multisigAddress?.address,
    };

    dispatch(createTxn(payload));
  };

  useEffect(() => {
    if (createRes.status === "rejected") {
      dispatch(
        setError({
          type: "error",
          message: createRes.error,
        })
      );
    }
  }, [createRes]);

  useEffect(() => {
    return () => {
      dispatch(resetCreateTxnState());
      dispatch(resetError());
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        onSetFeeChange={(v) => {
          setValue("fees", Number(v) * (10 ** chainInfo?.config?.currencies[0].coinDecimals));
        }}
        chainInfo={chainInfo}
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
          disabled={createRes.status === "pending"}
        >
          {createRes.status === "pending" ? "Please wait..." : "Create"}
        </Button>
      </Box>
    </form>
  );
}
