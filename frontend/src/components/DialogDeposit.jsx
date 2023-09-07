import React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import { Controller, useForm } from "react-hook-form";
import { txDeposit } from "../features/gov/govSlice";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";

const DialogDeposit = (props) => {
  const { onClose, open, address, proposalId, chainInfo, feegrant } = props;

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.gov.tx.status);
  const currency = chainInfo.config.currencies[0];

  const handleClose = () => {
    onClose();
  };

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = (data) => {
    dispatch(
      txDeposit({
        depositer: address,
        proposalId: proposalId,
        amount: Number(data.amount) * 10 ** currency.coinDecimals,
        denom: chainInfo.config.currencies[0].coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rpc: chainInfo.config.rpc,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average *
          10 ** chainInfo.config.currencies[0].coinDecimals,
        feegranter: feegrant.granter,
      })
    );
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Typography>Deposit</Typography>
            <div style={{ marginTop: 16 }}>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: "Amount is required",
                  validate: () => {
                    if (getValues("amount") <= 0) {
                      return "Must be greater than 0";
                    }
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Amount to deposit"
                    fullWidth
                    size="small"
                    error={errors.amount}
                    helperText={errors?.amount?.message}
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
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="secondary"
              className="button-capitalize-title"
              disableElevation
              disabled={loading === "pending"}
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disableElevation
              type="submit"
              disabled={loading === "pending"}
              className="button-capitalize-title"
            >
              {loading === "pending" ? (
                <CircularProgress size={25} />
              ) : (
                "Deposit"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default DialogDeposit;
