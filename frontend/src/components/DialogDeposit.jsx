import React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Controller, useForm } from "react-hook-form";
import { txDeposit } from "../features/gov/govSlice";
import { useDispatch, useSelector } from "react-redux";

const DialogDeposit = (props) => {
  const {
    onClose,
    open,
    balance,
    displayDenom,
    address,
    proposalId,
    chainInfo,
    feegrant,
  } = props;

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.gov.tx.status);

  const handleClose = () => {
    onClose();
  };

  const {
    handleSubmit,
    control,
    setValue,
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
        amount: Number(data.amount),
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
            <div style={{ marginBottom: "8px" }}>
              <Typography color="text.primary" fontWeight={600} sx={{ mt: 2 }}>
                Available Balance
              </Typography>
              <Typography
                color="text.primary"
                variant="body1"
                className="hover-link"
                onClick={() => {
                  setValue("amount", balance);
                }}
              >
                {balance}
              </Typography>
            </div>

            <div style={{ marginTop: 16 }}>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: "Amount is required",
                  validate: (value) => {
                    return Number(value) > 0 && Number(value) <= balance;
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="Amount to deposit"
                    fullWidth
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          {displayDenom}
                        </InputAdornment>
                      ),
                    }}
                    error={errors.amount}
                    helperText={
                      errors.amount?.type === "validate"
                        ? "Insufficient balance"
                        : errors.amount?.message
                    }
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
